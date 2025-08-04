'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../lib/api-client';
import type { UserInfo, Question, Answer } from '../lib/api-client';
import { UserInfoForm } from './UserInfoForm';
import { SurveyQuestion } from './SurveyQuestion';
import { CompletionScreen } from './CompletionScreen';


const SurveyApp = () => {
  const router = useRouter();
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
      const data = await apiClient.getQuestions();
      if (process.env.NODE_ENV === 'development') {
        setQuestions(data.slice(0, 1));
      } else {
        setQuestions(data);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Error loading questions:', err.message);
      } else {
        console.error('Failed to load questions:', err);
      }
    }
    setLoading(false);
  };

  const handleUserInfoSubmit = () => {
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
      
      const result = await apiClient.createSurvey(userInfo, answers);
      
      console.log('Survey completed successfully:', result);
      setLoading(false);
      setStep('complete');
      
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Error completing survey:', err.message);
        alert(`Error completing survey: ${err.message}`);
      } else {
        console.error('Error completing survey:', err);
        alert(`Error completing survey: ${err instanceof Error ? err.message : String(err)}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="main-content h-full w-full" style={{ height: '100dvh' }}>
      {step === 'user-info' && (
        <div className="h-full p-4 sm:p-6 md:p-8 flex items-center justify-center w-full">
          <div className="w-full">
            <UserInfoForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onSubmit={handleUserInfoSubmit}
              loading={loading}
              onViewResults={() => router.push('/results')}
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