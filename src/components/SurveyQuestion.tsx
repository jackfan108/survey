import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
}

interface Answer {
  opinion_score?: number;
  importance_score?: number;
}

interface SurveyQuestionProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, Answer>;
  onAnswerChange: (type: 'opinion_score' | 'importance_score', value: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  loading: boolean;
}

export const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  onAnswerChange,
  onNextQuestion,
  onPreviousQuestion,
  loading
}) => {
  if (!questions.length) return <div className="text-white">Loading questions...</div>;
  
  const question = questions[currentQuestionIndex];
  const currentAnswer = answers[question.id] || {};

  const isCurrentQuestionComplete = () => {
    return currentAnswer.opinion_score !== undefined && currentAnswer.importance_score !== undefined;
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* Progress Bar - Fixed at top */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-2xl w-full space-y-4 sm:space-y-8">
          {/* Question Text */}
          <div className="text-center">
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-8 leading-tight">
              {question.question_text}
            </h2>
          </div>

          {/* Opinion Scale (0-10) */}
          <div className="space-y-3 sm:space-y-6">
            <h3 className="text-sm sm:text-lg font-semibold text-white text-center">Your Position</h3>
            
            {/* Mobile Slider */}
            <div className="sm:hidden">
              <div className="text-center mb-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 text-lg font-bold ${
                  currentAnswer.opinion_score !== undefined 
                    ? 'border-blue-400 bg-blue-500 text-white' 
                    : 'border-gray-400 bg-white/10 text-gray-400'
                }`}>
                  {currentAnswer.opinion_score !== undefined ? currentAnswer.opinion_score : '?'}
                </div>
              </div>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={currentAnswer.opinion_score ?? 5}
                  onChange={(e) => onAnswerChange('opinion_score', parseInt(e.target.value))}
                  onTouchStart={(e) => onAnswerChange('opinion_score', parseInt((e.target as HTMLInputElement).value))}
                  onMouseDown={(e) => onAnswerChange('opinion_score', parseInt((e.target as HTMLInputElement).value))}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((currentAnswer.opinion_score ?? 5) - 1) / 8 * 100}%, rgba(255,255,255,0.1) ${((currentAnswer.opinion_score ?? 5) - 1) / 8 * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-200 mt-2 px-1">
                  <span>{question.label_0}</span>
                  <span>{question.label_10}</span>
                </div>
              </div>
            </div>

            {/* Desktop Circles */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 9 }, (_, i) => {
                    const value = i + 1;
                    return (
                      <button
                        key={value}
                        onClick={() => onAnswerChange('opinion_score', value)}
                        className={`w-14 h-14 rounded-full border-2 text-base font-semibold transition-all cursor-pointer flex-shrink-0 ${
                          currentAnswer.opinion_score === value
                            ? 'border-blue-400 bg-blue-500 text-white'
                            : 'border-gray-400 bg-white/10 text-gray-200 hover:border-blue-300 hover:bg-white/20'
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center mt-4">
                <div className="flex justify-between items-center text-base text-gray-200" style={{ width: 'calc(9 * 3.5rem + 8 * 0.5rem)' }}>
                  <span>{question.label_0}</span>
                  {question.label_5 && <span>{question.label_5}</span>}
                  <span>{question.label_10}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Importance Scale (1-5) */}
          <div className="space-y-3 sm:space-y-6 pt-4 sm:pt-8 border-t border-white/20">
            <h3 className="text-sm sm:text-lg font-semibold text-white text-center">
              How important is this issue to you personally?
            </h3>
            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-base text-gray-200">Barely matters</span>
              <div className="flex space-x-1 sm:space-x-4">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      onClick={() => onAnswerChange('importance_score', value)}
                      className={`w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 text-xs sm:text-base font-semibold transition-all cursor-pointer ${
                        currentAnswer.importance_score === value
                          ? 'border-blue-400 bg-blue-500 text-white'
                          : 'border-gray-400 bg-white/10 text-gray-200 hover:border-blue-300 hover:bg-white/20'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs sm:text-base text-gray-200">Extremely important</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex justify-between">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={onPreviousQuestion}
              disabled={loading}
              className={`w-28 sm:w-36 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                loading
                  ? 'bg-emerald-800 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              <span>Previous</span>
            </button>
          ) : (
            <div className="w-28 sm:w-36"></div>
          )}
          
          <button
            onClick={onNextQuestion}
            disabled={!isCurrentQuestionComplete() || loading}
            className={`w-28 sm:w-36 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              !isCurrentQuestionComplete() || loading
                ? 'bg-sky-800 text-sky-400 cursor-not-allowed'
                : 'bg-sky-600 text-white hover:bg-sky-700 cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}</span>
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};