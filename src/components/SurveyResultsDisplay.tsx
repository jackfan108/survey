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

interface SurveyResultsDisplayProps {
  surveyResults: SurveyResultsData;
  onBackToSearch: () => void;
}

export const SurveyResultsDisplay: React.FC<SurveyResultsDisplayProps> = ({
  surveyResults,
  onBackToSearch,
}) => {
  const calculateAverageOpinionScore = () => {
    const validScores = surveyResults.questions
      .map(q => q.opinion_score)
      .filter((score): score is number => score !== undefined && score !== null);
    
    if (validScores.length === 0) return 0;
    
    const sum = validScores.reduce((acc, score) => acc + score, 0);
    return sum / validScores.length;
  };

  const calculateWeightedOpinionScore = () => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    surveyResults.questions.forEach(question => {
      const opinionScore = question.opinion_score;
      const importanceScore = question.importance_score;
      
      if (opinionScore !== undefined && opinionScore !== null && 
          importanceScore !== undefined && importanceScore !== null) {
        weightedSum += opinionScore * importanceScore;
        totalWeight += importanceScore;
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const calculateStandardDeviation = () => {
    const validScores = surveyResults.questions
      .map(q => q.opinion_score)
      .filter((score): score is number => score !== undefined && score !== null);
    
    if (validScores.length <= 1) return 0;
    
    const mean = validScores.reduce((acc, score) => acc + score, 0) / validScores.length;
    const squaredDifferences = validScores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / validScores.length;
    
    return Math.sqrt(variance);
  };

  const averageScore = calculateAverageOpinionScore();
  const weightedScore = calculateWeightedOpinionScore();
  const standardDeviation = calculateStandardDeviation();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
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

          {/* Standard Deviation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <h2 className="text-white font-semibold text-xl mb-4 text-center">
              Opinion Deviation
            </h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                ±{standardDeviation.toFixed(1)}
              </div>
              <div className="bg-white/20 rounded-full h-4 mb-4 mx-auto max-w-xs">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((standardDeviation / 4.5) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-white/80 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>1σ range:</span>
                  <span>{Math.max(0, averageScore - standardDeviation).toFixed(1)} - {Math.min(9, averageScore + standardDeviation).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>2σ range:</span>
                  <span>{Math.max(0, averageScore - 2 * standardDeviation).toFixed(1)} - {Math.min(9, averageScore + 2 * standardDeviation).toFixed(1)}</span>
                </div>
                <p className="text-center mt-2">
                  Consistency of your opinions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {surveyResults.questions.map((question, index) => (
            <div key={question.question_id} className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Question {index + 1}: {question.question_text}
              </h3>
              
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