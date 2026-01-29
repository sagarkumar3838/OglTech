import admin from '../config/firebase';
import { UserProgress, SkillProgress, LevelCompletion } from '../types';

const db = admin.firestore();

export class UserProgressService {
  /**
   * Get user progress for a specific career
   */
  async getUserProgress(userId: string, careerId: string): Promise<UserProgress | null> {
    try {
      const progressRef = db
        .collection('user_progress')
        .doc(`${userId}_${careerId}`);
      
      const doc = await progressRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      return doc.data() as UserProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Initialize user progress for a career
   */
  async initializeProgress(
    userId: string,
    careerId: string,
    skills: string[]
  ): Promise<UserProgress> {
    try {
      const skillProgress: SkillProgress[] = skills.map((skill) => ({
        skill_name: skill,
        levels_completed: [
          { level: 'BASIC', completed: false, score: 0, attempts: 0, best_score: 0 },
          { level: 'INTERMEDIATE', completed: false, score: 0, attempts: 0, best_score: 0 },
          { level: 'ADVANCED', completed: false, score: 0, attempts: 0, best_score: 0 },
        ],
        current_level: 'BASIC',
        unlocked_levels: ['BASIC'], // Only BASIC is unlocked initially
      }));

      const progress: UserProgress = {
        user_id: userId,
        career_id: careerId,
        skill_progress: skillProgress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db
        .collection('user_progress')
        .doc(`${userId}_${careerId}`)
        .set(progress);

      return progress;
    } catch (error) {
      console.error('Error initializing progress:', error);
      throw error;
    }
  }

  /**
   * Update progress after completing a level
   */
  async updateProgress(
    userId: string,
    careerId: string,
    skillName: string,
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
    score: number,
    scorecardId: string
  ): Promise<UserProgress> {
    try {
      const progressRef = db
        .collection('user_progress')
        .doc(`${userId}_${careerId}`);
      
      const doc = await progressRef.get();
      
      if (!doc.exists) {
        throw new Error('User progress not found');
      }
      
      const progress = doc.data() as UserProgress;
      
      // Find the skill progress
      const skillProgress = progress.skill_progress.find(
        (sp) => sp.skill_name === skillName
      );
      
      if (!skillProgress) {
        throw new Error(`Skill ${skillName} not found in progress`);
      }
      
      // Find the level completion
      const levelCompletion = skillProgress.levels_completed.find(
        (lc) => lc.level === level
      );
      
      if (!levelCompletion) {
        throw new Error(`Level ${level} not found for skill ${skillName}`);
      }
      
      // Update level completion
      levelCompletion.attempts += 1;
      levelCompletion.score = score;
      levelCompletion.best_score = Math.max(levelCompletion.best_score, score);
      
      // Check if level is passed (60% or higher)
      const passingScore = this.getPassingScore(level);
      if (score >= passingScore && !levelCompletion.completed) {
        levelCompletion.completed = true;
        levelCompletion.completed_at = new Date().toISOString();
        levelCompletion.scorecard_id = scorecardId;
        
        // Unlock next level
        this.unlockNextLevel(skillProgress, level);
      }
      
      progress.updated_at = new Date().toISOString();
      
      await progressRef.update(progress as any);
      
      return progress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Get passing score for a level
   */
  private getPassingScore(level: string): number {
    switch (level) {
      case 'BASIC':
        return 60;
      case 'INTERMEDIATE':
        return 70;
      case 'ADVANCED':
        return 75;
      default:
        return 60;
    }
  }

  /**
   * Unlock next level if current level is completed
   */
  private unlockNextLevel(
    skillProgress: SkillProgress,
    completedLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
  ): void {
    const levelOrder: ('BASIC' | 'INTERMEDIATE' | 'ADVANCED')[] = [
      'BASIC',
      'INTERMEDIATE',
      'ADVANCED',
    ];
    
    const currentIndex = levelOrder.indexOf(completedLevel);
    const nextLevel = levelOrder[currentIndex + 1];
    
    if (nextLevel && !skillProgress.unlocked_levels.includes(nextLevel)) {
      skillProgress.unlocked_levels.push(nextLevel);
      skillProgress.current_level = nextLevel;
      console.log(`✓ Unlocked ${nextLevel} level for ${skillProgress.skill_name}`);
    }
  }

  /**
   * Check if a level is unlocked for a user
   */
  async isLevelUnlocked(
    userId: string,
    careerId: string,
    skillName: string,
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
  ): Promise<boolean> {
    try {
      const progress = await this.getUserProgress(userId, careerId);
      
      if (!progress) {
        // If no progress exists, only BASIC is unlocked
        return level === 'BASIC';
      }
      
      const skillProgress = progress.skill_progress.find(
        (sp) => sp.skill_name === skillName
      );
      
      if (!skillProgress) {
        return level === 'BASIC';
      }
      
      return skillProgress.unlocked_levels.includes(level);
    } catch (error) {
      console.error('Error checking level unlock:', error);
      return level === 'BASIC'; // Default to BASIC unlocked
    }
  }

  /**
   * Get skill progress for a specific skill
   */
  async getSkillProgress(
    userId: string,
    careerId: string,
    skillName: string
  ): Promise<SkillProgress | null> {
    try {
      const progress = await this.getUserProgress(userId, careerId);
      
      if (!progress) {
        return null;
      }
      
      return (
        progress.skill_progress.find((sp) => sp.skill_name === skillName) || null
      );
    } catch (error) {
      console.error('Error getting skill progress:', error);
      throw error;
    }
  }

  /**
   * Get overall progress statistics
   */
  async getProgressStats(userId: string, careerId: string): Promise<{
    total_skills: number;
    completed_skills: number;
    total_levels: number;
    completed_levels: number;
    average_score: number;
    completion_percentage: number;
  }> {
    try {
      const progress = await this.getUserProgress(userId, careerId);
      
      if (!progress) {
        return {
          total_skills: 0,
          completed_skills: 0,
          total_levels: 0,
          completed_levels: 0,
          average_score: 0,
          completion_percentage: 0,
        };
      }
      
      const totalSkills = progress.skill_progress.length;
      const totalLevels = totalSkills * 3; // 3 levels per skill
      
      let completedLevels = 0;
      let totalScore = 0;
      let scoreCount = 0;
      
      progress.skill_progress.forEach((sp) => {
        sp.levels_completed.forEach((lc) => {
          if (lc.completed) {
            completedLevels++;
          }
          if (lc.best_score > 0) {
            totalScore += lc.best_score;
            scoreCount++;
          }
        });
      });
      
      const completedSkills = progress.skill_progress.filter((sp) =>
        sp.levels_completed.every((lc) => lc.completed)
      ).length;
      
      const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
      const completionPercentage = Math.round((completedLevels / totalLevels) * 100);
      
      return {
        total_skills: totalSkills,
        completed_skills: completedSkills,
        total_levels: totalLevels,
        completed_levels: completedLevels,
        average_score: averageScore,
        completion_percentage: completionPercentage,
      };
    } catch (error) {
      console.error('Error getting progress stats:', error);
      throw error;
    }
  }
}

export const userProgressService = new UserProgressService();
