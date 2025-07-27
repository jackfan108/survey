'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../../lib/api-client';
import type { SurveyResultsData, TagAnalysis } from '../../../../lib/api-client';
import { QuestionCard } from '../../../../components/QuestionCard';
import { createQuestionToTagsMapping, getTagColor } from '../../../../lib/utils/surveyCalculations';
import { appCache } from '../../../../lib/cache';

export default function TagDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tagId = parseInt(params.id as string);
  const tagName = searchParams.get('name') || '';
  
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

  // Find the specific tag data
  const currentTag = tagAnalysis.find(tag => tag.tag_id === tagId);
  if (!currentTag) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Tag not found</div>
      </div>
    );
  }

  // Filter questions that belong to this tag
  const tagQuestions = surveyResults.questions.filter(question => 
    currentTag.question_ids.includes(question.question_id)
  );

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
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full border ${getTagColor(tagName)}`}>
                {tagName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {tagName.charAt(0).toUpperCase() + tagName.slice(1)} Analysis
            </h1>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-2">
                {currentTag.weighted_average.toFixed(1)}/9
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentTag.weighted_average / 9) * 100}%` }}
                ></div>
              </div>
              <p className="text-white/80 text-sm">
                Weighted average across {currentTag.question_count} questions
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-xl mb-4">
            Questions in this category ({tagQuestions.length})
          </h2>
          {tagQuestions.map((question, index) => (
            <QuestionCard
              key={question.question_id}
              question={question}
              index={index}
              questionToTags={questionToTags}
              showTags={true}
              useQuestionId={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}