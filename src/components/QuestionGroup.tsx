import React from 'react';
import { Histogram } from './Histogram';
import type { QuestionAnalysis } from '../lib/api-client';

interface QuestionGroupProps {
  title: string;
  questions: QuestionAnalysis[];
  showStats?: boolean;
  className?: string;
}

export const QuestionGroup: React.FC<QuestionGroupProps> = ({
  title,
  questions,
  showStats = false,
  className = ''
}) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sm:p-8 ${className}`}>
      <div className="sticky top-4 bg-gradient-to-br from-slate-900/80 via-purple-900/85 to-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4 mb-8 z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
          {title}
        </h2>
      </div>

      <div className="space-y-12">
        {questions.map((question, index) => (
          <div key={question.question_id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            {/* Question Header */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                Question {index + 1}: {question.question_text}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span>Total responses: {question.total_responses}</span>
                {showStats && (
                  <>
                    <span>Opinion Mean: {question.opinion_mean.toFixed(2)}</span>
                    <span>Importance Mean: {question.importance_mean.toFixed(2)}</span>
                    <span>Weighted Score: {question.weighted_opinion_score.toFixed(2)}</span>
                    <span>Opinion Std Dev: {question.opinion_std_deviation.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Histogram Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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