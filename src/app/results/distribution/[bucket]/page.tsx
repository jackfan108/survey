'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionCard } from '../../../../components/QuestionCard';
import { createQuestionToTagsMapping } from '../../../../lib/utils/surveyCalculations';
import { appCache } from '../../../../lib/cache';
import type { SurveyResultsData, TagAnalysis } from '../../../../lib/api-client';

export default function DistributionDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const bucket = params.bucket as 'left' | 'center' | 'right';
  
  const [surveyResults, setSurveyResults] = useState<SurveyResultsData | null>(null);
  const [tagAnalysis, setTagAnalysis] = useState<TagAnalysis[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Try to get data from cache first
      const cached = appCache.get();
      if (cached) {
        setSurveyResults(cached.surveyResults);
        setTagAnalysis(cached.tagAnalysis);
        setIsLoading(false);
        return;
      }
      
      // If no cache, redirect back to results page
      setError('No data found. Please search for results first.');
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-300 mb-4">{error}</div>
          <button
            onClick={() => router.push('/results')}
            className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors"
          >
            Go to Results Page
          </button>
        </div>
      </div>
    );
  }

  if (!surveyResults || !tagAnalysis) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">No data found</div>
      </div>
    );
  }

  // Filter questions based on bucket
  let filteredQuestions: typeof surveyResults.questions = [];
  let bucketTitle = '';
  let bucketDescription = '';
  let bucketColor = '';

  switch (bucket) {
    case 'left':
      filteredQuestions = surveyResults.questions.filter(q => q.opinion_score && q.opinion_score >= 1 && q.opinion_score <= 3);
      bucketTitle = 'Left Leaning (1-3)';
      bucketDescription = 'Questions where you scored 1-3 on the opinion scale';
      bucketColor = 'from-blue-600 to-blue-400';
      break;
    case 'center':
      filteredQuestions = surveyResults.questions.filter(q => q.opinion_score && q.opinion_score >= 4 && q.opinion_score <= 6);
      bucketTitle = 'Center (4-6)';
      bucketDescription = 'Questions where you scored 4-6 on the opinion scale';
      bucketColor = 'from-green-600 to-green-400';
      break;
    case 'right':
      filteredQuestions = surveyResults.questions.filter(q => q.opinion_score && q.opinion_score >= 7 && q.opinion_score <= 9);
      bucketTitle = 'Right Leaning (7-9)';
      bucketDescription = 'Questions where you scored 7-9 on the opinion scale';
      bucketColor = 'from-red-600 to-red-400';
      break;
    default:
      filteredQuestions = [];
  }

  const questionToTags = createQuestionToTagsMapping(tagAnalysis);

  return (
    <div className="h-full w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 sm:p-8 mb-6">
          <button
            onClick={() => router.push('/results')}
            className="mb-4 bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors"
          >
            ← Back to Results
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {bucketTitle}
            </h1>
            <p className="text-white/80 text-lg mb-4">
              {bucketDescription}
            </p>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-2">
                {filteredQuestions.length}
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
                <div 
                  className={`bg-gradient-to-r ${bucketColor} h-4 rounded-full transition-all duration-1000`}
                  style={{ width: `${surveyResults.questions.length > 0 ? (filteredQuestions.length / surveyResults.questions.length) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-white/80 text-sm">
                {filteredQuestions.length} out of {surveyResults.questions.length} questions 
                ({surveyResults.questions.length > 0 ? Math.round((filteredQuestions.length / surveyResults.questions.length) * 100) : 0}%)
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-xl mb-4">
            Questions in this category ({filteredQuestions.length})
          </h2>
          {filteredQuestions.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 text-center">
              <p className="text-white/80">No questions found in this opinion range.</p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question.question_id}
                question={question}
                index={index}
                questionToTags={questionToTags}
                showTags={true}
                useQuestionId={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}