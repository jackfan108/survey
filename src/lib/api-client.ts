interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

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

interface TagAnalysis {
  tag_id: number;
  tag_name: string;
  question_count: number;
  question_ids: number[];
  weighted_average: number;
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.error || 'API request failed', response.status);
  }
  return response.json();
}

export const apiClient = {
  async getQuestions(): Promise<Question[]> {
    const response = await fetch('/api/questions');
    const result = await handleResponse<{ data: Question[] }>(response);
    return result.data;
  },

  async createSurvey(userInfo: UserInfo, answers: Record<number, Answer>): Promise<{ message: string; surveyId: number }> {
    const response = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInfo, answers }),
    });
    return handleResponse<{ message: string; surveyId: number }>(response);
  },

  async getSurveyResults(email: string): Promise<SurveyResultsData> {
    const response = await fetch(`/api/surveys/results?email=${encodeURIComponent(email)}`);
    const result = await handleResponse<{ data: SurveyResultsData }>(response);
    return result.data;
  },

  async getTagAnalysis(email: string): Promise<TagAnalysis[]> {
    const response = await fetch(`/api/surveys/tags?email=${encodeURIComponent(email)}`);
    const result = await handleResponse<{ data: TagAnalysis[] }>(response);
    return result.data;
  },
};

export { ApiError };
export type { UserInfo, Question, Answer, SurveyResult, QuestionWithAnswer, SurveyResultsData, TagAnalysis };