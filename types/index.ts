// Quiz types
export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizRequest {
  text: string;
}

export interface QuizResponse {
  questions: Question[];
}

// Summary types
export interface SummaryRequest {
  originalText: string;
  userSummary: string;
}

export interface SummaryResponse {
  isValid: boolean;
  feedback: string;
  score?: number;
}

// Chat types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  context?: string; // The text being studied
}

export interface ChatResponse {
  message: Message;
}

// Vector DB types (for future implementation)
export interface TextEmbedding {
  text: string;
  embedding: number[];
}

export interface SearchResult {
  text: string;
  score: number;
}
