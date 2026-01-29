export interface Career {
  id: string;
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
  type: 'mcq' | 'multi_select' | 'scenario' | 'code_reasoning' | 'assertion_reason';
  question: string;
  options: string[];
  expected_skills: string[];
  created_at: string;
}

export interface Evaluation {
  evaluation_id: string;
  questions: Question[];
}

export interface Scorecard {
  id?: string;
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

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface EvaluationFile {
  name: string;
  path: string;
  created: string;
  modified: string;
  size: number;
  content?: any;
}

// Question types for evaluation system (matching Supabase schema)
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'advanced';
export type SkillType = 'html' | 'css' | 'javascript' | 'jquery' | 'devtools';

// Supabase Question structure
export interface EvaluationQuestion {
  id: string;
  question_id?: string;
  skill: string;  // Changed from SkillType to string for flexibility
  level: string;  // Changed from DifficultyLevel to string to match Supabase
  type: 'mcq' | 'multi_select' | 'coding' | 'fill_blank' | 'matching';
  question: string;
  options?: string[];
  correct_answer: any;  // JSONB in Supabase
  explanation?: string;
  code_snippet?: string;
  test_cases?: any[];
  blanks?: any[];
  matching_pairs?: any;
  created_at?: string;
  verified?: boolean;
  usage_count?: number;
}

export interface UserSkillProgress {
  userId: string;
  skills: Record<SkillType, {
    completed: DifficultyLevel[];
    bestScores: Record<DifficultyLevel, number>;
  }>;
  oglCoursesUnlocked: boolean;
}
