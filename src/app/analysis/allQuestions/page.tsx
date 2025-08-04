'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../lib/api-client';
import type { QuestionAnalysis } from '../../../lib/api-client';
import { QuestionGroup } from '../../../components/QuestionGroup';
import { ChevronLeft } from 'lucide-react';

export default function AllQuestions() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<QuestionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getQuestionAnalysis();
      setAnalysisData(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load analysis data');
      }
      console.error('Error loading analysis data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading all questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading questions</div>
          <div className="text-gray-300 mb-4">{error}</div>
          <button
            onClick={loadAnalysisData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (analysisData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No questions available</div>
          <div className="text-gray-300">No survey responses have been submitted yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/analysis')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Analysis</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            All Survey Questions
          </h1>
          <p className="text-gray-300 text-lg">
            Complete analysis of all {analysisData.length} questions
          </p>
        </div>

        {/* All Questions */}
        <QuestionGroup
          title="All Questions"
          questions={analysisData}
          showStats={true}
        />
      </div>
    </div>
  );
}