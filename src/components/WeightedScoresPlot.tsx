import React from 'react';
import type { SurveyWeightedScore } from '../lib/api-client';

interface WeightedScoresPlotProps {
  scores: SurveyWeightedScore[];
}

export const WeightedScoresPlot: React.FC<WeightedScoresPlotProps> = ({ scores }) => {
  if (scores.length === 0) {
    return null;
  }

  // Filter and sort scores by their weighted opinion score
  const validScores = scores
    .filter(score => score.weighted_opinion_score >= 1 && score.weighted_opinion_score <= 9)
    .sort((a, b) => a.weighted_opinion_score - b.weighted_opinion_score);

  // Create scale markers for the 1-9 range
  const scaleMarkers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-3 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16 mx-2 sm:mx-0">
      <div className="sticky top-2 sm:top-4 bg-gradient-to-br from-slate-900/80 via-purple-900/85 to-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-3 sm:p-4 mb-6 sm:mb-8 z-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center leading-tight">
          Survey Distribution by Weighted Opinion Score
        </h2>
      </div>

      <div className="p-3 sm:p-6">
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-2">
            Individual weighted opinion scores for {validScores.length} survey responses
          </p>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Scale background */}
          <div className="relative h-16 sm:h-20 lg:h-24 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-lg border border-white/20 mb-3 sm:mb-4">
            {/* Scale markers */}
            <div className="absolute inset-0 flex justify-between items-center px-1 sm:px-2">
              {scaleMarkers.map((marker) => (
                <div key={marker} className="flex flex-col items-center">
                  <div className="w-px h-4 sm:h-5 lg:h-6 bg-white/40"></div>
                  <span className="text-xs text-gray-300 mt-1">{marker}</span>
                </div>
              ))}
            </div>

            {/* Data points */}
            <div className="absolute inset-0">
              {validScores.map((score) => {
                // Position the point on the 1-9 scale
                const leftPercentage = ((score.weighted_opinion_score - 1) / 8) * 100;
                
                return (
                  <div
                    key={score.survey_id}
                    className="absolute transform -translate-x-1/2 group"
                    style={{ 
                      left: `${Math.max(2, Math.min(98, leftPercentage))}%`,
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)'
                    }}
                  >
                    {/* Data point */}
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-white to-blue-100 rounded-full border-2 border-blue-500 shadow-xl hover:scale-125 hover:shadow-2xl transition-all duration-200 cursor-pointer ring-2 ring-blue-400/50">
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-black/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {score.first_name}{score.last_name ? ` ${score.last_name.charAt(0)}` : ''}: {score.weighted_opinion_score.toFixed(2)}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scale labels */}
          <div className="flex justify-between px-1 sm:px-2">
            <span className="text-xs sm:text-sm text-blue-300 font-medium">More Liberal</span>
            <span className="text-xs sm:text-sm text-red-300 font-medium">More Conservative</span>
          </div>
        </div>

        {/* Score list for reference */}
        <div className="mt-4 sm:mt-6">
          <h4 className="text-white font-medium mb-2 sm:mb-3 text-center text-sm sm:text-base">Individual Survey Scores</h4>
          <div className="max-h-24 sm:max-h-32 overflow-y-auto bg-white/5 rounded-lg p-2 sm:p-3">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              {validScores.map((score) => (
                <span
                  key={score.survey_id}
                  className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/20"
                >
                  {score.first_name}{score.last_name ? ` ${score.last_name.charAt(0)}` : ''}: {score.weighted_opinion_score.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 text-center px-2">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Each point represents one survey&apos;s weighted opinion score. Hover for details.
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-1 sm:mt-0">
              Weighted scores consider both opinion position (1-9) and issue importance (1-5).
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};