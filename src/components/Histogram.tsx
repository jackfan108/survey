import React from 'react';

interface HistogramProps {
  data: Record<string | number, number>;
  title: string;
  xAxisLabel?: string;
  xAxisLabelLeft?: string;
  xAxisLabelRight?: string;
  yAxisLabel?: string;
  color?: string;
  maxValue?: number;
}

export const Histogram: React.FC<HistogramProps> = ({
  data,
  title,
  xAxisLabel = '',
  xAxisLabelLeft = '',
  xAxisLabelRight = '',
  color = 'bg-blue-500',
  maxValue
}) => {
  const entries = Object.entries(data);
  const values = entries.map(([, value]) => value);
  const actualMaxValue = maxValue || Math.max(...values);
  
  // Avoid division by zero
  const safeMaxValue = actualMaxValue === 0 ? 1 : actualMaxValue;

  return (
    <div className="p-3 sm:p-4">
      <h3 className="text-white font-semibold text-base sm:text-lg mb-6 sm:mb-8 text-center">{title}</h3>
      
      <div className="relative">
        
        {/* Chart area */}
        <div className="mx-1 sm:mx-2">
          {/* Chart area */}
          <div className="flex items-end justify-between mb-2 h-24 sm:h-32 relative">
            
            {/* Bars */}
            {entries.map(([key, value]) => (
              <div key={key} className="flex flex-col items-center flex-1 mx-0.5 sm:mx-1">
                <div className="relative w-full flex justify-center">
                  <div
                    className={`${color} rounded-t-sm transition-all duration-300 hover:opacity-80 w-6 sm:w-8 max-w-full`}
                    style={{
                      height: `${(value / safeMaxValue) * 96}px`,
                    }}
                  />
                  {/* Value label on top of bar */}
                  {value > 0 && (
                    <span className="absolute -top-6 text-xs text-white font-semibold">
                      {value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* X-axis */}
          <div className="border-t border-white/20 pt-2">
            <div className="flex justify-between">
              {entries.map(([key]) => (
                <div key={key} className="flex-1 text-center">
                  <span className="text-sm text-gray-300">{key}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis labels */}
          {(xAxisLabelLeft || xAxisLabelRight) ? (
            <div className="flex justify-between mt-2 px-2">
              <span className="text-xs text-gray-300">{xAxisLabelLeft}</span>
              <span className="text-xs text-gray-300">{xAxisLabelRight}</span>
            </div>
          ) : xAxisLabel ? (
            <div className="text-center mt-2">
              <span className="text-xs text-gray-300">{xAxisLabel}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};