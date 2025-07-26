interface SurveyResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

interface SurveyResultsData {
  survey: SurveyResult;
  questions: QuestionWithAnswer[];
}

import { TagAnalysis } from './TagAnalysis';
import { 
  calculateAverageOpinionScore, 
  calculateWeightedOpinionScore, 
  calculateStandardDeviation,
  createQuestionToTagsMapping,
  getTagColor
} from '../lib/utils/surveyCalculations';

interface TagAnalysisData {
  tag_id: number;
  tag_name: string;
  question_count: number;
  question_ids: number[];
  weighted_average: number;
}

interface SurveyResultsDisplayProps {
  surveyResults: SurveyResultsData;
  tagAnalysis: TagAnalysisData[];
  onBackToSearch: () => void;
}

export const SurveyResultsDisplay: React.FC<SurveyResultsDisplayProps> = ({
  surveyResults,
  tagAnalysis,
  onBackToSearch,
}) => {


  const averageScore = calculateAverageOpinionScore(surveyResults.questions);
  const weightedScore = calculateWeightedOpinionScore(surveyResults.questions);
  const standardDeviation = calculateStandardDeviation(surveyResults.questions);
  const questionToTags = createQuestionToTagsMapping(tagAnalysis);
  return (
    <div className="h-full w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Your Survey Results
            </h1>
            <p className="text-white/80 text-lg">
              {surveyResults.survey.first_name} {surveyResults.survey.last_name}
            </p>
            <p className="text-white/60 text-sm">
              {surveyResults.survey.email}
            </p>
          </div>
          
          <button
            onClick={onBackToSearch}
            className="mb-4 bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors"
          >
            ← Search Another Email
          </button>
        </div>

        {/* Summary Score Components */}
        <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Average Opinion Score */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <h2 className="text-white font-semibold text-xl mb-4 text-center">
              Average Opinion Score
            </h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {averageScore.toFixed(1)}/9
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(averageScore / 9) * 100}%` }}
                ></div>
              </div>
              <p className="text-white/80 text-sm">
                Simple average of all your opinion scores
              </p>
            </div>
          </div>

          {/* Weighted Opinion Score */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <h2 className="text-white font-semibold text-xl mb-4 text-center">
              Weighted Opinion Score
            </h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {weightedScore.toFixed(1)}/9
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(weightedScore / 9) * 100}%` }}
                ></div>
              </div>
              <p className="text-white/80 text-sm">
                Opinion scores weighted by importance ratings
              </p>
            </div>
          </div>

        </div>
        
        {/* Opinion Deviation - Full Width */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
          <h2 className="text-white font-semibold text-xl mb-4 text-center">
            Opinion Deviation
          </h2>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-2">
              ±{standardDeviation.toFixed(2)}
            </div>
            <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((standardDeviation / 4.5) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-white/80 text-sm space-y-2">
            <p className="text-white/90 font-medium mb-3">Interpretation Guide:</p>
            <div className="text-left space-y-1">
              <div><strong>0–1:</strong> Very consistent views. Mostly same answers across topics.</div>
              <div><strong>1–2:</strong> Some variation. Leans one way but not always.</div>
              <div><strong>2–2.6:</strong> Big swings. Liberal on some things, conservative on others.</div>
              <div><strong>Above 2.6:</strong> Very rare. Extremely mixed views. Strong opinions on both ends across different topics.</div>
            </div>
          </div>
        </div>
        </div>

        {/* Tag Analysis */}
        <TagAnalysis tagAnalysis={tagAnalysis} />

        <div className="space-y-4">
          {surveyResults.questions.map((question, index) => (
            <div key={question.question_id} className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
              <h3 className="text-white font-semibold text-lg mb-3">
                Question {index + 1}: {question.question_text}
              </h3>
              
              {/* Tags for this question */}
              {questionToTags[question.question_id] && (
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
          ))}
        </div>
      </div>
    </div>
  );
};