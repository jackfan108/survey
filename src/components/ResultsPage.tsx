import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { SurveyResultsDisplay } from './SurveyResultsDisplay';

interface SurveyResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

interface SurveyResultsData {
  survey: SurveyResult;
  questions: QuestionWithAnswer[];
}

const ResultsPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [surveyResults, setSurveyResults] = useState<SurveyResultsData | null>(null);

  const fetchSurveyResults = async (email: string): Promise<SurveyResultsData | null> => {
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('email', email)
      .single();

    console.log("surveyData", surveyData);

    if (surveyError || !surveyData) {
      throw new Error('No survey found for this email address');
    }

    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select(`
        question_id,
        opinion_score,
        importance_score,
        questions (
          id,
          question_text,
          label_0,
          label_5,
          label_10
        )
      `)
      .eq('survey_id', surveyData.id);

      console.log('jflog answersData', answersData)
      console.log('jflog answersError', answersError)

    if (answersError) {
      throw new Error('Error fetching survey answers', answersError);
    }

const questions: QuestionWithAnswer[] = answersData?.map((answer) => ({
      question_id: answer.question_id,
      question_text: answer.questions[0].question_text,
      label_0: answer.questions[0].label_0,
      label_5: answer.questions[0].label_5,
      label_10: answer.questions[0].label_10,
      opinion_score: answer.opinion_score,
      importance_score: answer.importance_score,
    })) || [];

    return {
      survey: surveyData,
      questions: questions,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setSurveyResults(null);

    try {
      const results = await fetchSurveyResults(email);
      setSurveyResults(results);
      setMessage('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setMessage(errorMessage);
      setSurveyResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setSurveyResults(null);
    setEmail('');
    setMessage('');
  };

  if (surveyResults) {
    return (
      <SurveyResultsDisplay 
        surveyResults={surveyResults} 
        onBackToSearch={handleBackToSearch}
      />
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Survey Results
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Enter your email and see your analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? 'Loading...' : 'Get My Analysis'}
          </button>

          {message && (
            <div className={`text-center text-sm ${message.includes('No survey found') || message.includes('Please') || message.includes('Error') ? 'text-red-300' : 'text-green-300'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResultsPage;