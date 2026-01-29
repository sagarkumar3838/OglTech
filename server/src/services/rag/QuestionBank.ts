import { Question } from '../../types';
import admin from '../../config/firebase';

const db = admin.firestore();

export class QuestionBank {
  /**
   * Get questions from the question bank based on skill and level
   */
  async getQuestions(skill: string, level: string, count: number): Promise<Question[]> {
    try {
      const snapshot = await db
        .collection('question_bank')
        .where('skill_area', '==', skill)
        .where('level', '==', level)
        .where('verified', '==', true)
        .limit(count * 2) // Get more than needed for randomization
        .get();

      const questions = snapshot.docs.map((doc) => doc.data() as Question);

      // Shuffle and return requested count
      return this.shuffleArray(questions).slice(0, count);
    } catch (error) {
      console.error('Error fetching from question bank:', error);
      return [];
    }
  }

  /**
   * Add a question to the question bank
   */
  async addQuestion(question: Question): Promise<void> {
    try {
      await db.collection('question_bank').doc(question.question_id).set({
        ...question,
        verified: false, // Requires manual verification
        added_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding to question bank:', error);
      throw error;
    }
  }

  /**
   * Get similar questions based on content
   */
  async getSimilarQuestions(
    skill: string,
    level: string,
    questionText: string,
    limit: number = 5
  ): Promise<Question[]> {
    try {
      // Simple keyword-based similarity (can be enhanced with embeddings)
      const keywords = this.extractKeywords(questionText);

      const snapshot = await db
        .collection('question_bank')
        .where('skill_area', '==', skill)
        .where('level', '==', level)
        .where('verified', '==', true)
        .limit(50)
        .get();

      const questions = snapshot.docs.map((doc) => doc.data() as Question);

      // Calculate similarity scores
      const scoredQuestions = questions.map((q) => ({
        question: q,
        score: this.calculateSimilarity(keywords, this.extractKeywords(q.question)),
      }));

      // Sort by score and return top matches
      return scoredQuestions
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((sq) => sq.question);
    } catch (error) {
      console.error('Error finding similar questions:', error);
      return [];
    }
  }

  /**
   * Verify and approve a question for the bank
   */
  async verifyQuestion(questionId: string): Promise<void> {
    try {
      await db.collection('question_bank').doc(questionId).update({
        verified: true,
        verified_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error verifying question:', error);
      throw error;
    }
  }

  /**
   * Get statistics about the question bank
   */
  async getStatistics(): Promise<{
    total: number;
    verified: number;
    bySkill: Record<string, number>;
    byLevel: Record<string, number>;
  }> {
    try {
      const snapshot = await db.collection('question_bank').get();
      const questions = snapshot.docs.map((doc) => doc.data());

      const stats = {
        total: questions.length,
        verified: questions.filter((q) => q.verified).length,
        bySkill: {} as Record<string, number>,
        byLevel: {} as Record<string, number>,
      };

      questions.forEach((q) => {
        stats.bySkill[q.skill_area] = (stats.bySkill[q.skill_area] || 0) + 1;
        stats.byLevel[q.level] = (stats.byLevel[q.level] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
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
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'should',
      'could',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
      'what',
      'which',
      'who',
      'when',
      'where',
      'why',
      'how',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Calculate similarity between two keyword sets
   */
  private calculateSimilarity(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
  }
}

export const questionBank = new QuestionBank();
