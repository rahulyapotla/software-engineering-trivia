export interface Question {
  question: string;
  options: string[];
  embedding?: any;
}

export interface StoredQuestion extends Question {
  id: string;
  created_at: string;
}

export interface LLMAnswer {
  correct_index: number;
  explanation?: string;
}

export interface UserAnswerInput {
  question_id: string;
  question: string;
  options: string[];
  chosen_index: number;
  totalScore: number;
}

export interface Answer {
  question_id: string;
  chosen_index: number;
  correct_index: number;
  is_correct: boolean;
  score: number;
  explanation: string;
}

export interface ScoreBroadcast {
  totalScore: number;
  explanation: string;
  is_correct: boolean;
  correct_index: number;
}

export interface ApiSuccess {
  ok: true;
}

export interface ApiError {
  ok: false;
  error: string;
  details?: string;
}

export type ApiResponse = ApiSuccess | ApiError;