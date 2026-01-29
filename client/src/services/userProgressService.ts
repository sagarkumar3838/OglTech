import { supabase } from '../config/supabase';

export interface UserProgress {
  id: string;
  user_id: string;
  career_id: string;
  skill_progress: SkillProgress[];
  overall_completion: number;
  created_at: string;
  updated_at: string;
}

export interface SkillProgress {
  skill_name: string;
  unlocked_levels: string[];
  levels_completed: LevelCompletion[];
}

export interface LevelCompletion {
  level: string;
  completed: boolean;
  best_score: number;
  attempts: number;
  last_attempt_date?: string;
}

export interface TestHistory {
  skill: string;
  level: string;
  score: number;
  date: string;
  passed: boolean;
}

/**
 * Fetch user progress for a specific career
 */
export const getUserProgress = async (userId: string, careerId: string): Promise<UserProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('career_id', careerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No progress found - return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
};

/**
 * Calculate overall statistics from user progress
 */
export const calculateProgressStats = (progress: UserProgress | null) => {
  if (!progress || !progress.skill_progress) {
    return {
      completedCourses: 0,
      evaluationsPassed: 0,
      totalEvaluations: 0,
      averageScore: 0,
      totalAttempts: 0,
      skillsCompleted: 0,
      totalSkills: 0,
      overallProgress: 0
    };
  }

  const skillProgress = progress.skill_progress;
  let totalEvaluations = 0;
  let evaluationsPassed = 0;
  let totalScore = 0;
  let scoreCount = 0;
  let totalAttempts = 0;
  let skillsCompleted = 0;

  skillProgress.forEach(skill => {
    if (skill.levels_completed) {
      skill.levels_completed.forEach(level => {
        totalEvaluations++;
        totalAttempts += level.attempts || 0;
        
        if (level.completed) {
          evaluationsPassed++;
        }
        
        if (level.best_score > 0) {
          totalScore += level.best_score;
          scoreCount++;
        }
      });

      // Check if all levels are completed for this skill
      const allLevelsCompleted = skill.levels_completed.every(lc => lc.completed);
      if (allLevelsCompleted) {
        skillsCompleted++;
      }
    }
  });

  const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  const overallProgress = progress.overall_completion || 0;

  return {
    completedCourses: evaluationsPassed, // Using passed evaluations as completed courses
    evaluationsPassed,
    totalEvaluations,
    averageScore,
    totalAttempts,
    skillsCompleted,
    totalSkills: skillProgress.length,
    overallProgress
  };
};

/**
 * Get test history from user progress
 */
export const getTestHistory = (progress: UserProgress | null): TestHistory[] => {
  if (!progress || !progress.skill_progress) {
    return [];
  }

  const history: TestHistory[] = [];

  progress.skill_progress.forEach(skill => {
    if (skill.levels_completed) {
      skill.levels_completed.forEach(level => {
        if (level.attempts > 0) {
          history.push({
            skill: skill.skill_name,
            level: level.level,
            score: level.best_score,
            date: level.last_attempt_date || progress.updated_at,
            passed: level.completed
          });
        }
      });
    }
  });

  // Sort by date, most recent first
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return history;
};

/**
 * Get skill proficiency breakdown
 */
export const getSkillProficiency = (progress: UserProgress | null) => {
  if (!progress || !progress.skill_progress) {
    return [];
  }

  return progress.skill_progress.map(skill => {
    const levels = skill.levels_completed || [];
    const completedLevels = levels.filter(l => l.completed).length;
    const totalLevels = 3; // easy, medium, hard
    const percentage = Math.round((completedLevels / totalLevels) * 100);
    
    // Calculate average score for this skill
    const scores = levels.filter(l => l.best_score > 0).map(l => l.best_score);
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    let proficiency = 'Beginner';
    if (percentage >= 80) proficiency = 'Advanced';
    else if (percentage >= 50) proficiency = 'Intermediate';

    return {
      name: skill.skill_name,
      percentage,
      proficiency,
      avgScore,
      completedLevels,
      totalLevels
    };
  });
};

/**
 * Get recent achievements
 */
export const getRecentAchievements = (progress: UserProgress | null) => {
  if (!progress || !progress.skill_progress) {
    return [];
  }

  const achievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }> = [];

  progress.skill_progress.forEach(skill => {
    if (skill.levels_completed) {
      skill.levels_completed.forEach(level => {
        if (level.completed) {
          achievements.push({
            title: `${skill.skill_name} - ${level.level} Level Completed`,
            description: `Successfully passed with a score of ${level.best_score}%. Completed after ${level.attempts} attempt${level.attempts > 1 ? 's' : ''}.`,
            date: level.last_attempt_date || progress.updated_at,
            icon: level.best_score >= 90 ? '🏆' : level.best_score >= 70 ? '⭐' : '🎯'
          });
        }
      });
    }
  });

  // Sort by date, most recent first
  achievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return achievements.slice(0, 5); // Return top 5 most recent
};
