import { EvaluationQuestion, SkillType, DifficultyLevel } from '../types';
import { supabase } from '../config/supabase';

// Type aliases for compatibility
type Skill = SkillType;
type Difficulty = DifficultyLevel;
type Question = EvaluationQuestion;

// Interface for JSON question file structure (legacy)
interface QuestionFile {
  skill: Skill;
  difficulty: Difficulty;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    topic: string;
    explanation: string;
  }>;
}

// Cache for loaded questions to avoid repeated queries
const questionCache = new Map<string, Question[]>();

// Load questions from Supabase
export const loadQuestionsFromSupabase = async (skill: string, level: string): Promise<Question[]> => {
  const cacheKey = `${skill}-${level}`;

  // Return cached questions if available
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  try {
    // Normalize skill and level to lowercase for database query
    // Remove spaces: "OGL Knowledge" -> "oglknowledge"
    const normalizedSkill = skill.toLowerCase().trim().replace(/\s+/g, '');
    const normalizedLevel = level.toLowerCase().trim();

    console.log(`Loading questions from Supabase: skill="${normalizedSkill}", level="${normalizedLevel}"`);

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('skill', normalizedSkill)
      .eq('level', normalizedLevel);

    if (error) throw error;

    console.log(`Loaded ${data?.length || 0} questions for ${normalizedSkill}-${normalizedLevel}`);

    const questions: Question[] = data || [];
    
    // Cache the questions
    questionCache.set(cacheKey, questions);
    return questions;
  } catch (error) {
    console.error(`Error loading questions for ${skill}-${level}:`, error);
    return [];
  }
};

// Fallback: Load questions from JSON file (for development)
export const loadQuestionsFromJSON = async (skill: Skill, difficulty: Difficulty): Promise<Question[]> => {
  const cacheKey = `${skill}-${difficulty}`;

  // Return cached questions if available
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  try {
    // NOTE: Dynamic imports disabled - using Supabase instead
    // If you need local JSON fallback, create the files in src/data/questions/
    throw new Error('Local JSON loading disabled. Use Supabase questions instead.');
    
    /* Original dynamic import code (commented out):
    const questionFile = await import(`../data/questions/${skill}-${difficulty}.json`);
    const data: QuestionFile = questionFile.default;

    // Convert to Question format (matching Supabase structure)
    const questions: Question[] = data.questions.map(q => ({
      id: q.id,
      question_id: q.id,
      skill,
      level: difficulty,
      type: 'mcq' as const,
      question: q.text,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation
    }));

    // Cache the questions
    questionCache.set(cacheKey, questions);
    return questions;
    */
  } catch (error) {
    console.error(`Error loading questions for ${skill}-${difficulty}:`, error);
    return [];
  }
};

// Main function: Load questions (tries Supabase first, falls back to JSON)
export const loadQuestions = async (skill: string, level: string): Promise<Question[]> => {
  // Try Supabase first
  const supabaseQuestions = await loadQuestionsFromSupabase(skill, level);
  if (supabaseQuestions.length > 0) {
    return supabaseQuestions;
  }

  // Fallback to JSON if Supabase is empty
  return loadQuestionsFromJSON(skill as Skill, level as Difficulty);
};

// Get unique random questions from a pool
export const getUniqueRandomQuestions = (questions: Question[], count: number): Question[] => {
  if (questions.length <= count) {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Load all questions for a skill across all difficulties
export const loadAllQuestionsForSkill = async (skill: Skill): Promise<{
  easy: Question[];
  medium: Question[];
  hard: Question[];
  advanced: Question[];
}> => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'advanced'];
  const questionBank = {
    easy: [] as Question[],
    medium: [] as Question[],
    hard: [] as Question[],
    advanced: [] as Question[]
  };

  // Load questions for each difficulty
  for (const difficulty of difficulties) {
    try {
      questionBank[difficulty] = await loadQuestions(skill, difficulty);
    } catch (error) {
      console.warn(`Could not load ${skill}-${difficulty} questions:`, error);
      questionBank[difficulty] = [];
    }
  }

  return questionBank;
};

// Generate balanced test questions (mix of difficulties)
export const generateBalancedTestQuestions = async (
  skill: Skill,
  totalCount: number = 10
): Promise<Question[]> => {
  const questionBank = await loadAllQuestionsForSkill(skill);

  // Define distribution based on total count
  const getDistribution = (total: number) => {
    if (total <= 4) return { easy: total, medium: 0, hard: 0, advanced: 0 };
    if (total <= 6) return { easy: 3, medium: total - 3, hard: 0, advanced: 0 };
    if (total <= 8) return { easy: 3, medium: 3, hard: total - 6, advanced: 0 };
    return { easy: 3, medium: 3, hard: 2, advanced: total - 8 };
  };

  const distribution = getDistribution(totalCount);
  const selectedQuestions: Question[] = [];

  // Select questions from each difficulty level
  Object.entries(distribution).forEach(([level, count]) => {
    if (count > 0) {
      const levelQuestions = questionBank[level as Difficulty];
      const selected = getUniqueRandomQuestions(levelQuestions, count);
      selectedQuestions.push(...selected);
    }
  });

  // Final shuffle to randomize order
  return selectedQuestions.sort(() => Math.random() - 0.5);
};

// Generate questions for specific difficulty level
export const generateLevelTestQuestions = async (
  skill: Skill,
  difficulty: Difficulty,
  count: number = 10
): Promise<Question[]> => {
  const questions = await loadQuestions(skill, difficulty);
  
  // If we don't have enough questions, return what we have
  if (questions.length === 0) {
    console.warn(`No questions found for ${skill}-${difficulty}`);
    return [];
  }
  
  if (questions.length < count) {
    console.warn(`Only ${questions.length} questions available for ${skill}-${difficulty}, requested ${count}`);
    // Return all available questions, shuffled
    return questions.sort(() => Math.random() - 0.5);
  }
  
  return getUniqueRandomQuestions(questions, count);
};

// Clear cache (useful for development/testing)
export const clearQuestionCache = (): void => {
  questionCache.clear();
};

// Get available question count for a skill/difficulty
export const getQuestionCount = async (skill: Skill, difficulty: Difficulty): Promise<number> => {
  const questions = await loadQuestions(skill, difficulty);
  return questions.length;
};

// Validate that all required question files exist
export const validateQuestionFiles = async (): Promise<{
  valid: boolean;
  missing: string[];
  available: string[];
}> => {
  const skills: Skill[] = ['html', 'css', 'javascript', 'jquery', 'devtools'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'advanced'];
  const missing: string[] = [];
  const available: string[] = [];

  for (const skill of skills) {
    for (const difficulty of difficulties) {
      try {
        const questions = await loadQuestions(skill, difficulty);
        if (questions.length > 0) {
          available.push(`${skill}-${difficulty}`);
        } else {
          missing.push(`${skill}-${difficulty}`);
        }
      } catch (error) {
        missing.push(`${skill}-${difficulty}`);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    available
  };
};
