// User progression service for difficulty advancement
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserSkillProgress as UserProgressType, SkillType, DifficultyLevel } from '../types';
import { getUserProgress } from './questionService';

// Type aliases for compatibility
type UserProgress = UserProgressType;
type Skill = SkillType;
type Difficulty = DifficultyLevel;

// User skill progression data structure
export interface UserSkillProgress {
  userId: string;
  skill: Skill;
  currentLevel: Difficulty;
  levelScores: Record<Difficulty, number>;
  completedLevels: Difficulty[];
  totalTestsTaken: number;
  lastTestDate: Date;
  consecutivePasses: number;
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastStreakDate?: Date;
  };
}

// Determine next difficulty level based on performance
export const getNextDifficultyLevel = (
  currentLevel: Difficulty,
  passedCurrentLevel: boolean,
  consecutivePasses: number
): Difficulty | null => {
  const levelOrder: Difficulty[] = ['easy', 'medium', 'hard', 'advanced'];

  if (!passedCurrentLevel) {
    // Reset consecutive passes on failure
    return currentLevel;
  }

  // Require 2 consecutive passes to advance to medium, 3 to advance to hard, 4 to advanced
  const requiredPasses = currentLevel === 'easy' ? 1 : currentLevel === 'medium' ? 2 : 3;

  if (consecutivePasses >= requiredPasses) {
    const currentIndex = levelOrder.indexOf(currentLevel);
    if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
      return null; // No next level
    }
    return levelOrder[currentIndex + 1];
  }

  return currentLevel;
};

// Check if user passed current level (70% threshold)
export const didPassLevel = (correctAnswers: number, totalQuestions: number = 10): boolean => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  return percentage >= 70;
};

// Get user's progression data for a specific skill
export const getUserSkillProgress = async (
  userId: string,
  skill: Skill
): Promise<UserSkillProgress> => {
  try {
    const docRef = doc(db, 'userProgression', `${userId}-${skill}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserSkillProgress;
      return data;
    }

    // Create default progression for new users
    const defaultProgress: UserSkillProgress = {
      userId,
      skill,
      currentLevel: 'easy',
      levelScores: { easy: 0, medium: 0, hard: 0, advanced: 0 },
      completedLevels: [],
      totalTestsTaken: 0,
      lastTestDate: new Date(),
      consecutivePasses: 0,
      streakData: {
        currentStreak: 0,
        longestStreak: 0
      }
    };

    return defaultProgress;
  } catch (error) {
    console.error('Error getting user skill progress:', error);
    throw error;
  }
};

// Update user's progression after completing a test
export const updateUserProgression = async (
  userId: string,
  skill: Skill,
  testResult: {
    difficulty: Difficulty;
    correctAnswers: number;
    totalQuestions: number;
    timestamp: Date;
  }
): Promise<void> => {
  try {
    const passed = didPassLevel(testResult.correctAnswers, testResult.totalQuestions);

    // Get current progression
    const currentProgress = await getUserSkillProgress(userId, skill);

    // Update score for this level
    currentProgress.levelScores[testResult.difficulty] = Math.max(
      currentProgress.levelScores[testResult.difficulty] || 0,
      testResult.correctAnswers
    );

    // Update streak data
    const today = new Date().toDateString();
    const lastStreakDate = currentProgress.streakData.lastStreakDate?.toDateString();

    if (passed) {
      if (today === lastStreakDate) {
        // Already counted today
      } else {
        currentProgress.streakData.currentStreak++;
        currentProgress.streakData.longestStreak = Math.max(
          currentProgress.streakData.longestStreak,
          currentProgress.streakData.currentStreak
        );
      }
      currentProgress.streakData.lastStreakDate = testResult.timestamp;

      // Update consecutive passes
      currentProgress.consecutivePasses++;
    } else {
      currentProgress.streakData.currentStreak = 0;
      currentProgress.consecutivePasses = 0;
    }

    // Check if level is completed and determine progression
    if (passed && !currentProgress.completedLevels.includes(testResult.difficulty)) {
      currentProgress.completedLevels.push(testResult.difficulty);
    }

    // Determine next level
    const nextLevel = getNextDifficultyLevel(
      currentProgress.currentLevel,
      passed,
      currentProgress.consecutivePasses
    );

    if (nextLevel && nextLevel !== currentProgress.currentLevel) {
      currentProgress.currentLevel = nextLevel;
    }

    // Update stats
    currentProgress.totalTestsTaken++;
    currentProgress.lastTestDate = testResult.timestamp;

    // Save to Firebase
    const docRef = doc(db, 'userProgression', `${userId}-${skill}`);
    await setDoc(docRef, currentProgress);

  } catch (error) {
    console.error('Error updating user progression:', error);
    throw error;
  }
};

// Get recommended next level for a user and skill
export const getRecommendedLevel = async (
  userId: string,
  skill: Skill
): Promise<Difficulty> => {
  try {
    const progress = await getUserSkillProgress(userId, skill);
    return progress.currentLevel;
  } catch (error) {
    console.error('Error getting recommended level:', error);
    return 'easy'; // Default to easy if error
  }
};

// Get user's overall progression stats
export const getUserProgressionStats = async (userId: string): Promise<{
  totalTests: number;
  averageScore: number;
  currentStreaks: Record<Skill, number>;
  completedSkills: Skill[];
  overallProgress: number; // 0-100 percentage
}> => {
  try {
    const progress = await getUserProgress(userId);
    const skills: Skill[] = ['html', 'css', 'javascript', 'jquery', 'devtools'];

    let totalTests = 0;
    let totalScore = 0;
    const completedSkills: Skill[] = [];
    const currentStreaks: Record<Skill, number> = {} as Record<Skill, number>;

    for (const skill of skills) {
      const skillProgress = await getUserSkillProgress(userId, skill);
      totalTests += skillProgress.totalTestsTaken;

      // Calculate average score for this skill
      const scores = Object.values(skillProgress.levelScores);
      if (scores.length > 0) {
        const skillAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
        totalScore += skillAvg;
      }

      currentStreaks[skill] = skillProgress.streakData.currentStreak;

      // Check if skill is completed (all levels passed)
      if (skillProgress.completedLevels.length === 4) {
        completedSkills.push(skill);
      }
    }

    const averageScore = totalTests > 0 ? totalScore / skills.length : 0;
    const overallProgress = (completedSkills.length / skills.length) * 100;

    return {
      totalTests,
      averageScore,
      currentStreaks,
      completedSkills,
      overallProgress
    };

  } catch (error) {
    console.error('Error getting user progression stats:', error);
    throw error;
  }
};

// Check if user can take a specific test level
export const canTakeTestLevel = async (
  userId: string,
  skill: Skill,
  requestedLevel: Difficulty
): Promise<boolean> => {
  try {
    const progress = await getUserSkillProgress(userId, skill);

    // Always allow easy level
    if (requestedLevel === 'easy') return true;

    const levelOrder: Difficulty[] = ['easy', 'medium', 'hard', 'advanced'];
    const currentIndex = levelOrder.indexOf(progress.currentLevel);
    const requestedIndex = levelOrder.indexOf(requestedLevel);

    // Can take current level or previous levels for practice
    return requestedIndex <= currentIndex;
  } catch (error) {
    console.error('Error checking test level access:', error);
    return false;
  }
};
