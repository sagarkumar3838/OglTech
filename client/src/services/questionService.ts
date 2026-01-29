import { collection, doc, setDoc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { EvaluationQuestion, SkillType, DifficultyLevel, UserSkillProgress as UserProgressType } from '../types';

// Type aliases for compatibility
type Question = EvaluationQuestion;
type Skill = SkillType;
type Difficulty = DifficultyLevel;
type UserProgress = UserProgressType;

// Collection names
const QUESTIONS_COLLECTION = 'questions';
const CATEGORIES_COLLECTION = 'categories';
const USER_PROGRESS_COLLECTION = 'userProgress';

// Question Service for Firebase operations
export class QuestionService {
  // Add a single question
  static async addQuestion(question: Question): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
        ...question,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  // Add multiple questions in batch
  static async addQuestionsBatch(questions: Question[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      questions.forEach((question) => {
        const docRef = doc(collection(db, QUESTIONS_COLLECTION));
        batch.set(docRef, {
          ...question,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      await batch.commit();
      console.log(`Successfully added ${questions.length} questions`);
    } catch (error) {
      console.error('Error adding questions batch:', error);
      throw error;
    }
  }

  // Get questions by skill and difficulty
  static async getQuestions(skill: Skill, difficulty: Difficulty, limit?: number): Promise<Question[]> {
    try {
      const q = query(
        collection(db, QUESTIONS_COLLECTION),
        where('skill', '==', skill),
        where('difficulty', '==', difficulty)
      );
      const querySnapshot = await getDocs(q);
      const questions: Question[] = [];

      querySnapshot.forEach((doc) => {
        questions.push({ ...doc.data(), id: doc.id } as Question);
      });

      // Shuffle and limit if specified
      const shuffled = questions.sort(() => Math.random() - 0.5);
      return limit ? shuffled.slice(0, limit) : shuffled;
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  }
}

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress> => {
  try {
    const docRef = doc(db, USER_PROGRESS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }

    // Return default progress for new users
    const defaultProgress: UserProgress = {
      userId,
      skills: {
        html: { completed: [], bestScores: { easy: 0, medium: 0, hard: 0, advanced: 0 } },
        css: { completed: [], bestScores: { easy: 0, medium: 0, hard: 0, advanced: 0 } },
        javascript: { completed: [], bestScores: { easy: 0, medium: 0, hard: 0, advanced: 0 } },
        jquery: { completed: [], bestScores: { easy: 0, medium: 0, hard: 0, advanced: 0 } },
        devtools: { completed: [], bestScores: { easy: 0, medium: 0, hard: 0, advanced: 0 } }
      },
      oglCoursesUnlocked: false
    };

    return defaultProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

// Save user progress
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    const docRef = doc(db, USER_PROGRESS_COLLECTION, progress.userId);
    await setDoc(docRef, progress);
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
};
