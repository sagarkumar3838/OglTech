import { v4 as uuidv4 } from 'uuid';
import { Evaluation, Question } from '../../types';
import { questionBank } from './QuestionBank';
import { aiProviderManager } from '../aiProviders/AIProviderManager';
import config from '../../config/env';
import admin from '../../config/firebase';

const db = admin.firestore();

export class RAGService {
  /**
   * Generate questions using intelligent caching strategy
   * 1. Check if exact same request exists in cache
   * 2. If not, check question bank for available questions
   * 3. If insufficient, generate with AI and cache results
   */
  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    console.log(`Generating ${count} questions for ${skill} at ${level} level`);

    // Step 1: Check cache for exact match
    const cachedEvaluation = await this.checkCache(skill, level, count);
    if (cachedEvaluation) {
      console.log('✓ Found cached evaluation, reusing questions');
      return this.createEvaluationFromCache(cachedEvaluation);
    }

    // Step 2: Try to get questions from question bank
    const bankQuestions = await questionBank.getQuestions(skill, level, count);
    
    if (bankQuestions.length >= count) {
      console.log(`✓ Found ${bankQuestions.length} questions in question bank`);
      const evaluation = this.createEvaluation(skill, level, bankQuestions);
      await this.cacheEvaluation(evaluation);
      return evaluation;
    }

    // Step 3: Generate with AI (with diverse question types)
    console.log(`Generating ${count} questions with AI (${bankQuestions.length} from bank)`);
    const neededCount = count - bankQuestions.length;
    
    try {
      const aiEvaluation = await aiProviderManager.generateQuestions(skill, level, neededCount);
      const aiQuestions = aiEvaluation.questions;

      // Validate and store AI-generated questions
      const validQuestions = await this.validateAndStoreQuestions(aiQuestions);
      
      // Combine bank questions with AI questions
      const allQuestions = this.shuffleArray([...bankQuestions, ...validQuestions]);
      
      const evaluation = this.createEvaluation(skill, level, allQuestions);
      await this.cacheEvaluation(evaluation);
      
      console.log(`✓ Generated evaluation with ${allQuestions.length} questions`);
      return evaluation;
    } catch (error) {
      console.error('AI generation failed:', error);
      
      // Fallback: use whatever we have from question bank
      if (bankQuestions.length > 0) {
        console.log(`⚠ Falling back to ${bankQuestions.length} questions from bank`);
        return this.createEvaluation(skill, level, bankQuestions);
      }
      
      throw new Error('Failed to generate questions and no fallback available');
    }
  }

  /**
   * Check cache for existing evaluation
   */
  private async checkCache(
    skill: string,
    level: string,
    count: number
  ): Promise<any | null> {
    try {
      const cacheKey = `${skill}_${level}_${count}`;
      const cacheRef = db.collection('evaluation_cache').doc(cacheKey);
      const cacheDoc = await cacheRef.get();

      if (cacheDoc.exists) {
        const cacheData = cacheDoc.data();
        const cacheAge = Date.now() - new Date(cacheData!.cached_at).getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (cacheAge < maxAge) {
          // Update usage stats
          await cacheRef.update({
            usage_count: admin.firestore.FieldValue.increment(1),
            last_used: new Date().toISOString(),
          });
          return cacheData;
        } else {
          console.log('Cache expired, will regenerate');
          await cacheRef.delete();
        }
      }
    } catch (error) {
      console.error('Error checking cache:', error);
    }
    return null;
  }

  /**
   * Cache evaluation for future use
   */
  private async cacheEvaluation(evaluation: Evaluation): Promise<void> {
    try {
      const cacheKey = `${evaluation.skill}_${evaluation.evaluation_level}_${evaluation.question_count}`;
      await db.collection('evaluation_cache').doc(cacheKey).set({
        ...evaluation,
        cached_at: new Date().toISOString(),
        usage_count: 1,
        last_used: new Date().toISOString(),
      });
      console.log(`✓ Cached evaluation: ${cacheKey}`);
    } catch (error) {
      console.error('Error caching evaluation:', error);
    }
  }

  /**
   * Create evaluation from cached data
   */
  private createEvaluationFromCache(cacheData: any): Evaluation {
    return {
      evaluation_id: uuidv4(), // New ID for each use
      evaluation_level: cacheData.evaluation_level,
      skill: cacheData.skill,
      question_count: cacheData.question_count,
      questions: cacheData.questions,
      generated_at: new Date().toISOString(),
      status: 'generated',
    };
  }

  /**
   * Create evaluation object
   */
  private createEvaluation(skill: string, level: string, questions: Question[]): Evaluation {
    return {
      evaluation_id: uuidv4(),
      evaluation_level: level,
      skill,
      question_count: questions.length,
      questions,
      generated_at: new Date().toISOString(),
      status: 'generated',
    };
  }

  /**
   * Validate and store AI-generated questions
   */
  private async validateAndStoreQuestions(questions: Question[]): Promise<Question[]> {
    const validQuestions: Question[] = [];

    for (const question of questions) {
      const validation = await this.validateQuestion(question);
      
      if (validation.valid) {
        // Store in question bank
        try {
          await questionBank.addQuestion({
            ...question,
            created_at: new Date().toISOString(),
            verified: false, // Requires manual verification
            usage_count: 0,
          });
          validQuestions.push(question);
        } catch (error) {
          console.error('Error storing question:', error);
          // Still include the question even if storage fails
          validQuestions.push(question);
        }
      } else {
        console.warn(`Invalid question detected: ${validation.issues.join(', ')}`);
      }
    }

    return validQuestions;
  }

  /**
   * Validate question quality
   */
  async validateQuestion(question: Question): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check for required fields
    if (!question.question || question.question.trim().length < 10) {
      issues.push('Question text is too short or missing');
    }

    // Validate based on question type
    switch (question.type) {
      case 'mcq':
      case 'multi_select':
        if (!question.options || question.options.length < 2) {
          issues.push('Insufficient answer options');
        }
        if (!question.correct_answer) {
          issues.push('Missing correct answer');
        }
        // Check for duplicate options
        if (question.options) {
          const uniqueOptions = new Set(question.options);
          if (uniqueOptions.size !== question.options.length) {
            issues.push('Duplicate answer options detected');
          }
        }
        // Check if correct answer is in options
        if (question.correct_answer && question.options) {
          const correctAnswers = Array.isArray(question.correct_answer)
            ? question.correct_answer
            : [question.correct_answer];
          for (const answer of correctAnswers) {
            if (!question.options.includes(answer)) {
              issues.push('Correct answer not found in options');
            }
          }
        }
        break;

      case 'coding':
        if (!question.code_snippet && !question.question.includes('write') && !question.question.includes('implement')) {
          issues.push('Coding question missing code snippet or clear instructions');
        }
        break;

      case 'fill_blank':
        if (!question.blanks || question.blanks.length === 0) {
          issues.push('Fill in the blank question missing blanks data');
        }
        break;

      case 'matching':
        if (!question.matching_pairs) {
          issues.push('Matching question missing matching pairs data');
        }
        break;
    }

    // Check for hallucination indicators
    const hallucinations = [
      'as an ai',
      'i cannot',
      'i apologize',
      'i don\'t have',
      'sorry',
      '[insert',
      'example.com',
      'placeholder',
      'lorem ipsum',
    ];

    const questionLower = question.question.toLowerCase();
    for (const indicator of hallucinations) {
      if (questionLower.includes(indicator)) {
        issues.push(`Potential hallucination detected: "${indicator}"`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  /**
   * Shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    total_cached: number;
    by_skill: Record<string, number>;
    by_level: Record<string, number>;
    most_used: any[];
  }> {
    try {
      const snapshot = await db.collection('evaluation_cache').get();
      const caches = snapshot.docs.map((doc) => doc.data());

      const stats = {
        total_cached: caches.length,
        by_skill: {} as Record<string, number>,
        by_level: {} as Record<string, number>,
        most_used: [] as any[],
      };

      caches.forEach((cache) => {
        stats.by_skill[cache.skill] = (stats.by_skill[cache.skill] || 0) + 1;
        stats.by_level[cache.evaluation_level] = (stats.by_level[cache.evaluation_level] || 0) + 1;
      });

      // Get most used caches
      stats.most_used = caches
        .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
        .slice(0, 10)
        .map((cache) => ({
          skill: cache.skill,
          level: cache.evaluation_level,
          count: cache.question_count,
          usage_count: cache.usage_count,
          last_used: cache.last_used,
        }));

      return stats;
    } catch (error) {
      console.error('Error getting cache stats:', error);
      throw error;
    }
  }

  /**
   * Clear old cache entries
   */
  async clearOldCache(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const snapshot = await db
        .collection('evaluation_cache')
        .where('last_used', '<', cutoffDate.toISOString())
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✓ Cleared ${snapshot.size} old cache entries`);
      return snapshot.size;
    } catch (error) {
      console.error('Error clearing old cache:', error);
      throw error;
    }
  }
}

export const ragService = new RAGService();
