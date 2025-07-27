'use client';

import { useRouter } from 'next/navigation';

interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

interface OpinionDistributionProps {
  questions: QuestionWithAnswer[];
}

export const OpinionDistribution: React.FC<OpinionDistributionProps> = ({ questions }) => {
  const router = useRouter();

  // Categorize questions by opinion score
  const leftQuestions = questions.filter(q => q.opinion_score && q.opinion_score >= 1 && q.opinion_score <= 3);
  const centerQuestions = questions.filter(q => q.opinion_score && q.opinion_score >= 4 && q.opinion_score <= 6);
  const rightQuestions = questions.filter(q => q.opinion_score && q.opinion_score >= 7 && q.opinion_score <= 9);

  const handleBucketClick = (bucket: 'left' | 'center' | 'right') => {
    router.push(`/results/distribution/${bucket}`);
  };

  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-2xl mb-4 text-center">
        Opinion Distribution
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left (1-3) */}
        <div 
          className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
          onClick={() => handleBucketClick('left')}
        >
          <h3 className="text-white font-semibold text-lg mb-3 text-center">
            Left (1-3)
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-white mb-2">
              {leftQuestions.length}
            </div>
            <div className="bg-white/20 rounded-full h-3 mb-3 mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${questions.length > 0 ? (leftQuestions.length / questions.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-white/80 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-medium">{leftQuestions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">
                {questions.length > 0 ? Math.round((leftQuestions.length / questions.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Center (4-6) */}
        <div 
          className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
          onClick={() => handleBucketClick('center')}
        >
          <h3 className="text-white font-semibold text-lg mb-3 text-center">
            Center (4-6)
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-white mb-2">
              {centerQuestions.length}
            </div>
            <div className="bg-white/20 rounded-full h-3 mb-3 mx-auto">
              <div 
                className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${questions.length > 0 ? (centerQuestions.length / questions.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-white/80 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-medium">{centerQuestions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">
                {questions.length > 0 ? Math.round((centerQuestions.length / questions.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Right (7-9) */}
        <div 
          className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
          onClick={() => handleBucketClick('right')}
        >
          <h3 className="text-white font-semibold text-lg mb-3 text-center">
            Right (7-9)
          </h3>
          
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-white mb-2">
              {rightQuestions.length}
            </div>
            <div className="bg-white/20 rounded-full h-3 mb-3 mx-auto">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${questions.length > 0 ? (rightQuestions.length / questions.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-white/80 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-medium">{rightQuestions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">
                {questions.length > 0 ? Math.round((rightQuestions.length / questions.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};