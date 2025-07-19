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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Progress Bar - Fixed at top */}
      <div className="w-full px-4 py-6 flex-shrink-0">
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
      <div className="flex-1 flex items-center justify-center px-4 overflow-y-auto">
        <div className="max-w-2xl w-full space-y-8">
          {/* Question Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-8">
              {question.question_text}
            </h2>
          </div>

          {/* Opinion Scale (0-10) */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white text-center">Your Position</h3>
            <div className="flex justify-between items-center gap-1">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onAnswerChange('opinion_score', i)}
                  className={`w-16 h-16 rounded-full border-2 text-lg font-semibold transition-all cursor-pointer ${
                    currentAnswer.opinion_score === i
                      ? 'border-blue-400 bg-blue-500 text-white'
                      : 'border-gray-400 bg-white/10 text-gray-200 hover:border-blue-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-base text-gray-200">
              <span>{question.label_0}</span>
              {question.label_5 && <span>{question.label_5}</span>}
              <span>{question.label_10}</span>
            </div>
          </div>

          {/* Importance Scale (1-5) */}
          <div className="space-y-6 pt-8 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white text-center">
              How important is this issue to you personally?
            </h3>
            <div className="flex justify-center items-center space-x-4">
              <span className="text-base text-gray-200">Barely matters</span>
              <div className="flex space-x-4">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      onClick={() => onAnswerChange('importance_score', value)}
                      className={`w-16 h-16 rounded-full border-2 text-lg font-semibold transition-all cursor-pointer ${
                        currentAnswer.importance_score === value
                          ? 'border-blue-400 bg-blue-500 text-white'
                          : 'border-gray-400 bg-white/10 text-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <span className="text-base text-gray-200">Extremely important</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="w-full px-4 py-6 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex justify-between">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={onPreviousQuestion}
              disabled={loading}
              className={`w-36 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? 'bg-emerald-800 text-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>
          ) : (
            <div className="w-36"></div>
          )}
          
          <button
            onClick={onNextQuestion}
            disabled={!isCurrentQuestionComplete() || loading}
            className={`w-36 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              !isCurrentQuestionComplete() || loading
                ? 'bg-sky-800 text-sky-400 cursor-not-allowed'
                : 'bg-sky-600 text-white hover:bg-sky-700 cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentQuestionIndex === questions.length - 1 ? 'Complete Survey' : 'Next'}</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};