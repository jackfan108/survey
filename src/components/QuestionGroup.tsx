import React from 'react';
import { Histogram } from './Histogram';
import type { QuestionAnalysis } from '../lib/api-client';

interface QuestionGroupProps {
  title: string;
  questions: QuestionAnalysis[];
  showStats?: boolean;
  className?: string;
  highlightMetric?: 'std_deviation' | 'importance' | 'weighted_score';
}

export const QuestionGroup: React.FC<QuestionGroupProps> = ({
  title,
  questions,
  showStats = false,
  className = '',
  highlightMetric
}) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className={`p-3 sm:p-6 lg:p-8 mx-2 sm:mx-0 ${className}`}>
      <div className="sticky top-2 sm:top-4 bg-gradient-to-br from-slate-900/80 via-purple-900/85 to-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-3 sm:p-4 mb-6 sm:mb-8 z-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center leading-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {questions.map((question, index) => (
          <div key={question.question_id} className="bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 p-3 sm:p-4 lg:p-6">
            {/* Question Header */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 leading-tight">
                Question {index + 1}: {question.question_text}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                <span className="bg-white/5 px-2 py-1 rounded">Total responses: {question.total_responses}</span>
                {showStats && (
                  <>
                    <span className="bg-white/5 px-2 py-1 rounded">Opinion Mean: {question.opinion_mean.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded ${
                      highlightMetric === 'importance' 
                        ? 'bg-green-500/30 text-green-100 font-semibold' 
                        : 'bg-white/5'
                    }`}>Importance Mean: {question.importance_mean.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded ${
                      highlightMetric === 'weighted_score' 
                        ? 'bg-yellow-500/40 text-yellow-100 font-semibold' 
                        : 'bg-white/5'
                    }`}>Weighted Score: {question.weighted_opinion_score.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded ${
                      highlightMetric === 'std_deviation' 
                        ? 'bg-orange-500/30 text-orange-100 font-semibold' 
                        : 'bg-white/5'
                    }`}>Opinion Std Dev: {question.opinion_std_deviation.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Histogram Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Opinion Score Histogram */}
              <div>
                <Histogram
                  data={question.opinion_distribution}
                  title="Opinion Distribution"
                  xAxisLabelLeft={question.label_0}
                  xAxisLabelRight={question.label_10}
                  color="bg-blue-500"
                />
              </div>

              {/* Importance Score Histogram */}
              <div>
                <Histogram
                  data={question.importance_distribution}
                  title="Importance Distribution"
                  xAxisLabelLeft="Barely matters"
                  xAxisLabelRight="Extremely important"
                  color="bg-green-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};