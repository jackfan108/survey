import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserInfoForm } from './components/UserInfoForm';
import { SurveyQuestion } from './components/SurveyQuestion';
import { CompletionScreen } from './components/CompletionScreen';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface Question {
  id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
}

interface Answer {
  opinion_score?: number;
  importance_score?: number;
}

const SurveyApp = () => {
  const [step, setStep] = useState<'user-info' | 'survey' | 'complete'>('user-info');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.from('questions').select('*');
      
      if (error) {
        console.error('Error loading questions:', error);
      } else {
        if (!data || data.length === 0) {
          console.log('No questions found in database');
        } else {
          setQuestions(data);
        }
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
    setLoading(false);
  };

  const handleUserInfoSubmit = () => {
    // Just move to survey step, don't create survey record yet
    setStep('survey');
  };

  const handleAnswerChange = (type: 'opinion_score' | 'importance_score', value: number) => {
    const questionId = questions[currentQuestionIndex]?.id;
    if (!questionId) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: value
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete survey - save everything to database
      completeSurvey();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeSurvey = async () => {
    setLoading(true);
    
    try {
      console.log('Creating survey with user info:', userInfo);
      
      // Create survey record
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .insert([{
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          email: userInfo.email
        }])
        .select();

      if (surveyError) {
        console.error('Error creating survey:', surveyError);
        alert(`Error saving survey: ${surveyError.message}`);
        setLoading(false);
        return;
      }

      const surveyId = surveyData[0]?.id;
      console.log('Survey created with ID:', surveyId);

      // Save all answers
      const answerInserts = Object.entries(answers).map(([questionId, answer]) => ({
        survey_id: surveyId,
        question_id: parseInt(questionId),
        opinion_score: answer.opinion_score,
        importance_score: answer.importance_score
      }));

      console.log('Inserting answers:', answerInserts);

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answerInserts);

      if (answersError) {
        console.error('Error saving answers:', answersError);
        alert(`Error saving answers: ${answersError.message}`);
        setLoading(false);
        return;
      }

      console.log('Survey completed successfully');
      setLoading(false);
      setStep('complete');
      
    } catch (err) {
      console.error('Error completing survey:', err);
      alert(`Error completing survey: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      {step === 'user-info' && (
        <div className="h-full p-4 sm:p-6 md:p-8 flex items-center justify-center w-full">
          <div className="w-full">
            <UserInfoForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onSubmit={handleUserInfoSubmit}
              loading={loading}
            />
          </div>
        </div>
      )}
      
      {step === 'survey' && (
        <SurveyQuestion
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          loading={loading}
        />
      )}
      
      {step === 'complete' && (
        <div className="h-full p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <CompletionScreen />
        </div>
      )}
    </div>
  );
};

export default SurveyApp;