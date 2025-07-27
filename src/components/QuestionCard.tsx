import { getTagColor } from '../lib/utils/surveyCalculations';

interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

interface QuestionCardProps {
  question: QuestionWithAnswer;
  index?: number;
  questionToTags?: Record<number, string[]>;
  showTags?: boolean;
  useQuestionId?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index = 0, 
  questionToTags,
  showTags = true,
  useQuestionId = false
}) => {
  const displayNumber = useQuestionId ? question.question_id : index + 1;
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
      <h3 className="text-white font-semibold text-lg mb-3">
        Question {displayNumber}: {question.question_text}
      </h3>
      
      {/* Tags for this question */}
      {showTags && questionToTags && questionToTags[question.question_id] && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {questionToTags[question.question_id].map((tagName) => (
              <span
                key={tagName}
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(tagName)}`}
              >
                {tagName}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white/80 font-medium mb-2">Opinion Score</h4>
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>{question.label_0}</span>
            <span>{question.label_10}</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${((question.opinion_score || 0) / 9) * 100}%` }}
            ></div>
          </div>
          <p className="text-white text-center font-semibold">
            {question.opinion_score}/9
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white/80 font-medium mb-2">Importance Score</h4>
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>Not Important</span>
            <span>Very Important</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${((question.importance_score || 0) / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-white text-center font-semibold">
            {question.importance_score}/5
          </p>
        </div>
      </div>
    </div>
  );
};