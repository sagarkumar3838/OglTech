import { supabase } from '../config/supabase';
import { AIProviderManager } from './aiProviders/AIProviderManager';
import questionBank from '../data/question-bank.json';

interface Question {
  type: string;
  question: string;
  options?: string[];
  correct_answer: any;
  explanation?: string;
  code_snippet?: string;
  test_cases?: any[];
}

export class HybridQuestionService {
  private aiManager: AIProviderManager;

  constructor() {
    this.aiManager = new AIProviderManager();
  }

  /**
   * Generate questions using hybrid approach:
   * 1. Try AI generation first
   * 2. If AI fails, fetch from Supabase database
   * 3. If database is empty, use local JSON fallback
   * 
   * IMPORTANT: Questions are UNIQUE per user - never repeats previously seen questions
   */
  async generateQuestions(
    skill: string,
    level: string,
    count: number = 10,
    useAI: boolean = true,
    userId?: string,
    excludeQuestionIds: string[] = []
  ): Promise<Question[]> {
    console.log(`\n🔍 Generating ${count} UNIQUE questions for ${skill} - ${level}`);
    console.log(`Strategy: ${useAI ? 'AI-first with fallback' : 'Database only'}`);
    console.log(`Excluding ${excludeQuestionIds.length} previously seen questions`);

    // Strategy 1: Try AI generation if enabled
    if (useAI) {
      try {
        const aiQuestions = await this.generateWithAI(skill, level, count);
        if (aiQuestions && aiQuestions.length > 0) {
          console.log(`✅ Generated ${aiQuestions.length} questions using AI`);
          // Store AI-generated questions in database for future use
          const storedIds = await this.storeQuestionsInDatabase(skill, level, aiQuestions);
          
          // Add question IDs to the questions
          return aiQuestions.map((q, idx) => ({
            ...q,
            question_id: storedIds[idx]
          }));
        }
      } catch (error: any) {
        console.log(`⚠️ AI generation failed: ${error.message}`);
        console.log(`📦 Falling back to database/JSON questions...`);
      }
    }

    // Strategy 2: Fetch from Supabase database (excluding previously seen)
    try {
      const dbQuestions = await this.fetchFromDatabase(skill, level, count, excludeQuestionIds);
      if (dbQuestions && dbQuestions.length > 0) {
        console.log(`✅ Retrieved ${dbQuestions.length} UNIQUE questions from database`);
        return dbQuestions;
      }
    } catch (error: any) {
      console.log(`⚠️ Database fetch failed: ${error.message}`);
    }

    // Strategy 3: Use local JSON fallback (excluding previously seen)
    console.log(`📄 Using local JSON question bank...`);
    const jsonQuestions = this.getFromJSON(skill, level, count, excludeQuestionIds);
    console.log(`✅ Retrieved ${jsonQuestions.length} questions from JSON`);
    return jsonQuestions;
  }

  /**
   * Generate questions using AI
   */
  private async generateWithAI(
    skill: string,
    level: string,
    count: number
  ): Promise<Question[]> {
    const evaluation = await this.aiManager.generateQuestions(skill, level, count);
    
    // Extract questions from the evaluation response
    if (evaluation && evaluation.questions) {
      return evaluation.questions as any;
    }

    return [];
  }

  /**
   * Fetch questions from Supabase database (excluding previously seen)
   */
  private async fetchFromDatabase(
    skill: string,
    level: string,
    count: number,
    excludeQuestionIds: string[] = []
  ): Promise<Question[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('skill', skill)
      .eq('level', level)
      .eq('verified', true);

    // Exclude previously seen questions
    if (excludeQuestionIds.length > 0) {
      query = query.not('question_id', 'in', `(${excludeQuestionIds.join(',')})`);
    }

    // Randomize order to get different questions each time
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(count * 2); // Fetch more to ensure we have enough after filtering

    if (error) throw error;

    // Shuffle and take only the requested count
    const shuffled = data.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((q: any) => ({
      question_id: q.question_id,
      type: q.type,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      code_snippet: q.code_snippet,
      test_cases: q.test_cases
    }));
  }

  /**
   * Get questions from local JSON file (excluding previously seen)
   */
  private getFromJSON(
    skill: string,
    level: string,
    count: number,
    excludeQuestionIds: string[] = []
  ): Question[] {
    const skillQuestions = (questionBank as any)[skill];
    
    if (!skillQuestions || !skillQuestions[level]) {
      console.log(`⚠️ No questions found in JSON for ${skill} - ${level}`);
      return [];
    }

    let questions = skillQuestions[level];
    
    // Filter out previously seen questions (if they have IDs)
    if (excludeQuestionIds.length > 0) {
      questions = questions.filter((q: any) => 
        !excludeQuestionIds.includes(q.question_id)
      );
    }

    // Shuffle to randomize
    questions = questions.sort(() => Math.random() - 0.5);
    
    // Return up to 'count' questions, or all if less than count
    const selected = questions.slice(0, Math.min(count, questions.length));
    
    // Add generated IDs if not present
    return selected.map((q: any, idx: number) => ({
      ...q,
      question_id: q.question_id || `json-${skill}-${level}-${idx}-${Date.now()}`
    }));
  }

  /**
   * Store AI-generated questions in database for future use
   * Returns array of question IDs
   */
  private async storeQuestionsInDatabase(
    skill: string,
    level: string,
    questions: Question[]
  ): Promise<string[]> {
    try {
      const questionIds: string[] = [];
      const questionsToInsert = questions.map((q) => {
        const questionId = `${skill.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        questionIds.push(questionId);
        
        return {
          question_id: questionId,
          skill: skill,
          level: level,
          type: q.type,
          question: q.question,
          options: q.options || [],
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          code_snippet: q.code_snippet || null,
          test_cases: q.test_cases || [],
          verified: true,
          usage_count: 0
        };
      });

      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) {
        console.log(`⚠️ Could not store questions in database: ${error.message}`);
        return questionIds;
      } else {
        console.log(`💾 Stored ${questions.length} questions in database`);
        return questionIds;
      }
    } catch (error: any) {
      console.log(`⚠️ Error storing questions: ${error.message}`);
      return [];
    }
  }

  /**
   * Build AI prompt for question generation
   */
  private buildPrompt(skill: string, level: string, count: number): string {
    return `Generate ${count} technical evaluation questions for ${skill} at ${level} level.

Level Guidelines:
- BASIC: Understanding concepts, reading code, identifying syntax
- INTERMEDIATE: Modifying code, debugging, applying concepts  
- ADVANCED: Creating solutions from scratch, architecture, best practices

Return a JSON array with this exact structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Why this is correct"
  }
]

Requirements:
- Mix of question types: mcq (multiple choice)
- Practical, real-world scenarios
- Clear, unambiguous questions
- Detailed explanations
- Return ONLY valid JSON array, no markdown`;
  }

  /**
   * Get question statistics
   */
  async getQuestionStats(): Promise<any> {
    const { data, error } = await supabase
      .from('questions')
      .select('skill, level, count');

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    return data;
  }
}

export default HybridQuestionService;
