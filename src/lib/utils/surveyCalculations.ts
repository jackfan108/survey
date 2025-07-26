interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

export const calculateAverageOpinionScore = (questions: QuestionWithAnswer[]): number => {
  const validScores = questions
    .map(q => q.opinion_score)
    .filter((score): score is number => score !== undefined && score !== null);
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return sum / validScores.length;
};

export const calculateWeightedOpinionScore = (questions: QuestionWithAnswer[]): number => {
  let weightedSum = 0;
  let totalWeight = 0;
  
  questions.forEach(question => {
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

export const calculateStandardDeviation = (questions: QuestionWithAnswer[]): number => {
  const validScores = questions
    .map(q => q.opinion_score)
    .filter((score): score is number => score !== undefined && score !== null);
  
  if (validScores.length <= 1) return 0;
  
  const mean = validScores.reduce((acc, score) => acc + score, 0) / validScores.length;
  const squaredDifferences = validScores.map(score => Math.pow(score - mean, 2));
  const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / validScores.length;
  
  return Math.sqrt(variance);
};

interface TagAnalysisData {
  tag_id: number;
  tag_name: string;
  question_count: number;
  question_ids: number[];
  weighted_average: number;
}

export const getTagColor = (tagName: string): string => {
  const tagColors: Record<string, string> = {
    'economy': 'bg-blue-500/20 border-blue-400/50 text-blue-100',
    'social': 'bg-green-500/20 border-green-400/50 text-green-100',
    'education': 'bg-purple-500/20 border-purple-400/50 text-purple-100',
    'immigration': 'bg-orange-500/20 border-orange-400/50 text-orange-100',
    'identity & rights': 'bg-pink-500/20 border-pink-400/50 text-pink-100',
    'health': 'bg-red-500/20 border-red-400/50 text-red-100',
    'law & justice': 'bg-yellow-500/20 border-yellow-400/50 text-yellow-100',
  };
  
  return tagColors[tagName] || 'bg-gray-500/20 border-gray-400/50 text-gray-100';
};

export const createQuestionToTagsMapping = (tagAnalysis: TagAnalysisData[]): Record<number, string[]> => {
  const questionToTags: Record<number, string[]> = {};
  
  tagAnalysis.forEach(tag => {
    tag.question_ids.forEach(questionId => {
      if (!questionToTags[questionId]) {
        questionToTags[questionId] = [];
      }
      questionToTags[questionId].push(tag.tag_name);
    });
  });
  
  return questionToTags;
};