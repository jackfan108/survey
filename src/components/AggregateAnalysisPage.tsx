'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../lib/api-client';
import type { QuestionAnalysis } from '../lib/api-client';
import { QuestionGroup } from './QuestionGroup';
import { ChevronLeft } from 'lucide-react';

export const AggregateAnalysisPage: React.FC = () => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading aggregate analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading analysis data</div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No analysis data available</div>
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
            onClick={() => router.push('/results')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Results</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Aggregate Survey Analysis
          </h1>
          <p className="text-gray-300 text-lg">
            Distribution of responses across all questions
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Total questions analyzed: {analysisData.length}
          </p>
        </div>

        {/* Most Controversial Questions */}
        <QuestionGroup
          title="Most Controversial"
          questions={analysisData
            .slice()
            .sort((a, b) => b.opinion_std_deviation - a.opinion_std_deviation)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* Most Consensus Questions */}
        <QuestionGroup
          title="Most Consensus"
          questions={analysisData
            .slice()
            .sort((a, b) => a.opinion_std_deviation - b.opinion_std_deviation)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* Most Important Questions */}
        <QuestionGroup
          title="Most Important"
          questions={analysisData
            .slice()
            .sort((a, b) => b.importance_mean - a.importance_mean)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* Least Important Questions */}
        <QuestionGroup
          title="Least Important"
          questions={analysisData
            .slice()
            .sort((a, b) => a.importance_mean - b.importance_mean)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* Most Liberal Questions */}
        <QuestionGroup
          title="Most Liberal"
          questions={analysisData
            .slice()
            .sort((a, b) => a.weighted_opinion_score - b.weighted_opinion_score)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* Most Conservative Questions */}
        <QuestionGroup
          title="Most Conservative"
          questions={analysisData
            .slice()
            .sort((a, b) => b.weighted_opinion_score - a.weighted_opinion_score)
            .slice(0, 3)
          }
          showStats={true}
          className="mb-16"
        />

        {/* All Questions */}
        <QuestionGroup
          title="All Questions"
          questions={analysisData}
          showStats={false}
        />

        {/* Summary Stats */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Summary Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {analysisData.length}
              </div>
              <div className="text-gray-300">Questions Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {analysisData.reduce((sum, q) => sum + q.total_responses, 0)}
              </div>
              <div className="text-gray-300">Total Responses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Math.round(analysisData.reduce((sum, q) => sum + q.total_responses, 0) / analysisData.length)}
              </div>
              <div className="text-gray-300">Avg Responses per Question</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};