'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../lib/api-client';
import type { SurveyResultsData, TagAnalysis } from '../lib/api-client';
import { SurveyResultsDisplay } from './SurveyResultsDisplay';
import { appCache } from '../lib/cache';


const ResultsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [surveyResults, setSurveyResults] = useState<SurveyResultsData | null>(null);
  const [tagAnalysis, setTagAnalysis] = useState<TagAnalysis[] | null>(null);

  // Check cache on component mount
  useEffect(() => {
    const cached = appCache.get();
    if (cached) {
      setSurveyResults(cached.surveyResults);
      setTagAnalysis(cached.tagAnalysis);
      setEmail(cached.surveyResults.survey.email);
    }
  }, []);

  const loadResults = async (emailAddress: string) => {
    // Check cache first
    const cached = appCache.get();
    if (cached && cached.surveyResults.survey.email === emailAddress) {
      setSurveyResults(cached.surveyResults);
      setTagAnalysis(cached.tagAnalysis);
      setMessage('');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setSurveyResults(null);

    try {
      const [results, tags] = await Promise.all([
        apiClient.getSurveyResults(emailAddress),
        apiClient.getTagAnalysis(emailAddress)
      ]);
      
      // Cache the results
      appCache.set(results, tags);
      
      setSurveyResults(results);
      setTagAnalysis(tags);
      setMessage('');
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
        setMessage(errorMessage);
      }
      setSurveyResults(null);
      setTagAnalysis(null);
    } finally {
      setIsLoading(false);
    }
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

    await loadResults(email);
  };

  const handleBackToSearch = () => {
    setSurveyResults(null);
    setTagAnalysis(null);
    setEmail('');
    setMessage('');
    // Clear cache when going back to search
    appCache.clear();
  };

  if (surveyResults) {
    return (
      <SurveyResultsDisplay 
        surveyResults={surveyResults}
        tagAnalysis={tagAnalysis || []}
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

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-3">
              Or explore overall survey trends
            </p>
            <button
              onClick={() => router.push('/analysis')}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-md border border-white/20 hover:border-white/30 transition-all"
            >
              View Aggregate Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;