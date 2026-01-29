export interface Career {
  id?: string;
  name: string;
  description: string;
  skills: Skill[];
  created_at: string;
}

export interface Skill {
  name: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface Question {
  question_id: string;
  level: string;
  skill_area: string;
  type: 'mcq' | 'multi_select' | 'coding' | 'fill_blank' | 'matching' | 'scenario' | 'code_reasoning' | 'assertion_reason';
  question: string;
  options?: string[]; // For MCQ, multi_select
  correct_answer?: string | string[]; // Single or multiple answers
  code_snippet?: string; // For coding questions
  test_cases?: TestCase[]; // For coding questions
  blanks?: BlankQuestion[]; // For fill in the blank
  matching_pairs?: MatchingPair[]; // For matching questions
  expected_skills: string[];
  difficulty_weight: number;
  created_at: string;
  verified?: boolean; // For question bank
  usage_count?: number; // Track how many times used
  last_used?: string; // Last usage timestamp
}

export interface TestCase {
  input: string;
  expected_output: string;
  description?: string;
}

export interface BlankQuestion {
  text: string; // Text with __BLANK__ placeholders
  answers: string[]; // Correct answers for each blank
}

export interface MatchingPair {
  left: string[];
  right: string[];
  correct_matches: { [key: string]: string }; // Map left items to right items
}

export interface Evaluation {
  evaluation_id: string;
  evaluation_level: string;
  skill: string;
  question_count: number;
  questions: Question[];
  generated_at: string;
  status: string;
}

export interface Submission {
  submission_id?: string;
  evaluation_id: string;
  user_id: string;
  candidate_name: string;
  answers: (string | null)[];
  results?: SubmissionResult[];
  score?: number;
  correct_count?: number;
  total_questions?: number;
  submitted_at: string;
}

export interface SubmissionResult {
  question_id: string;
  user_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
}

export interface Scorecard {
  scorecard_id?: string;
  candidate_name: string;
  user_id: string;
  skill: string;
  level_attempted: string;
  overall_score: number;
  correct_count: number;
  total_questions: number;
  level_readiness: 'EXCEEDS_EXPECTATION' | 'MEETS_EXPECTATION' | 'BELOW_EXPECTATION';
  observed_maturity: string;
  dimension_scores: DimensionScores;
  question_breakdown: QuestionBreakdown[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  hiring_recommendation: 'STRONG_HIRE' | 'CONSIDER' | 'NO_HIRE';
  evaluator_summary: string;
  created_at: string;
  submission_id: string;
  evaluation_id: string;
}

export interface DimensionScores {
  correctness: number;
  reasoning: number;
  debugging: number;
  design_thinking?: number;
}

export interface QuestionBreakdown {
  question_id: string;
  type: string;
  max_marks: number;
  awarded_marks: number;
  is_correct: boolean;
}

export interface AIProvider {
  name: string;
  generateQuestions(skill: string, level: string, count: number): Promise<Evaluation>;
  analyzePerformance(data: any): Promise<any>;
}

export interface RateLimitInfo {
  userId: string;
  requestCount: number;
  windowStart: number;
}

export interface UserProgress {
  user_id: string;
  career_id: string;
  skill_progress: SkillProgress[];
  created_at: string;
  updated_at: string;
}

export interface SkillProgress {
  skill_name: string;
  levels_completed: LevelCompletion[];
  current_level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  unlocked_levels: ('BASIC' | 'INTERMEDIATE' | 'ADVANCED')[];
}

export interface LevelCompletion {
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  completed: boolean;
  score: number;
  attempts: number;
  best_score: number;
  completed_at?: string;
  scorecard_id?: string;
}
