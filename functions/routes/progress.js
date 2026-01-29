const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// User Progress Service (inline implementation for functions)
class UserProgressService {
  async getUserProgress(userId, careerId) {
    try {
      const progressRef = db.collection('user_progress').doc(`${userId}_${careerId}`);
      const doc = await progressRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      return doc.data();
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  async initializeProgress(userId, careerId, skills) {
    try {
      const skillProgress = skills.map((skill) => ({
        skill_name: skill,
        levels_completed: [
          { level: 'BASIC', completed: false, score: 0, attempts: 0, best_score: 0 },
          { level: 'INTERMEDIATE', completed: false, score: 0, attempts: 0, best_score: 0 },
          { level: 'ADVANCED', completed: false, score: 0, attempts: 0, best_score: 0 },
        ],
        current_level: 'BASIC',
        unlocked_levels: ['BASIC'],
      }));

      const progress = {
        user_id: userId,
        career_id: careerId,
        skill_progress: skillProgress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('user_progress').doc(`${userId}_${careerId}`).set(progress);

      return progress;
    } catch (error) {
      console.error('Error initializing progress:', error);
      throw error;
    }
  }

  async updateProgress(userId, careerId, skillName, level, score, scorecardId) {
    try {
      const progressRef = db.collection('user_progress').doc(`${userId}_${careerId}`);
      const doc = await progressRef.get();
      
      if (!doc.exists) {
        throw new Error('User progress not found');
      }
      
      const progress = doc.data();
      const skillProgress = progress.skill_progress.find((sp) => sp.skill_name === skillName);
      
      if (!skillProgress) {
        throw new Error(`Skill ${skillName} not found in progress`);
      }
      
      const levelCompletion = skillProgress.levels_completed.find((lc) => lc.level === level);
      
      if (!levelCompletion) {
        throw new Error(`Level ${level} not found for skill ${skillName}`);
      }
      
      levelCompletion.attempts += 1;
      levelCompletion.score = score;
      levelCompletion.best_score = Math.max(levelCompletion.best_score, score);
      
      const passingScore = this.getPassingScore(level);
      if (score >= passingScore && !levelCompletion.completed) {
        levelCompletion.completed = true;
        levelCompletion.completed_at = new Date().toISOString();
        levelCompletion.scorecard_id = scorecardId;
        
        this.unlockNextLevel(skillProgress, level);
      }
      
      progress.updated_at = new Date().toISOString();
      
      await progressRef.update(progress);
      
      return progress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  getPassingScore(level) {
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

  unlockNextLevel(skillProgress, completedLevel) {
    const levelOrder = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];
    const currentIndex = levelOrder.indexOf(completedLevel);
    const nextLevel = levelOrder[currentIndex + 1];
    
    if (nextLevel && !skillProgress.unlocked_levels.includes(nextLevel)) {
      skillProgress.unlocked_levels.push(nextLevel);
      skillProgress.current_level = nextLevel;
      console.log(`✓ Unlocked ${nextLevel} level for ${skillProgress.skill_name}`);
    }
  }

  async isLevelUnlocked(userId, careerId, skillName, level) {
    try {
      const progress = await this.getUserProgress(userId, careerId);
      
      if (!progress) {
        return level === 'BASIC';
      }
      
      const skillProgress = progress.skill_progress.find((sp) => sp.skill_name === skillName);
      
      if (!skillProgress) {
        return level === 'BASIC';
      }
      
      return skillProgress.unlocked_levels.includes(level);
    } catch (error) {
      console.error('Error checking level unlock:', error);
      return level === 'BASIC';
    }
  }

  async getSkillProgress(userId, careerId, skillName) {
    try {
      const progress = await this.getUserProgress(userId, careerId);
      
      if (!progress) {
        return null;
      }
      
      return progress.skill_progress.find((sp) => sp.skill_name === skillName) || null;
    } catch (error) {
      console.error('Error getting skill progress:', error);
      throw error;
    }
  }

  async getProgressStats(userId, careerId) {
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
      const totalLevels = totalSkills * 3;
      
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

const userProgressService = new UserProgressService();

// Get user progress for a career
router.get('/:userId/:careerId', async (req, res) => {
  try {
    const { userId, careerId } = req.params;

    let progress = await userProgressService.getUserProgress(userId, careerId);

    if (!progress) {
      const careerDoc = await db.collection('careers').doc(careerId).get();
      
      if (!careerDoc.exists) {
        return res.status(404).json({ error: 'Career not found' });
      }

      const careerData = careerDoc.data();
      const skills = careerData.skills.map((s) => s.name);

      progress = await userProgressService.initializeProgress(userId, careerId, skills);
    }

    res.json(progress);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// Update progress after completing a level
router.post('/update', async (req, res) => {
  try {
    const { userId, careerId, skillName, level, score, scorecardId } = req.body;

    if (!userId || !careerId || !skillName || !level || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const progress = await userProgressService.updateProgress(
      userId,
      careerId,
      skillName,
      level,
      score,
      scorecardId
    );

    res.json(progress);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to update progress',
      message: error.message
    });
  }
});

// Check if a level is unlocked
router.get('/check-unlock/:userId/:careerId/:skillName/:level', async (req, res) => {
  try {
    const { userId, careerId, skillName, level } = req.params;

    const isUnlocked = await userProgressService.isLevelUnlocked(
      userId,
      careerId,
      skillName,
      level
    );

    res.json({ unlocked: isUnlocked });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to check level unlock status' });
  }
});

// Get skill progress
router.get('/skill/:userId/:careerId/:skillName', async (req, res) => {
  try {
    const { userId, careerId, skillName } = req.params;

    const skillProgress = await userProgressService.getSkillProgress(
      userId,
      careerId,
      skillName
    );

    if (!skillProgress) {
      return res.status(404).json({ error: 'Skill progress not found' });
    }

    res.json(skillProgress);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get skill progress' });
  }
});

// Get progress statistics
router.get('/stats/:userId/:careerId', async (req, res) => {
  try {
    const { userId, careerId } = req.params;

    const stats = await userProgressService.getProgressStats(userId, careerId);

    res.json(stats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get progress statistics' });
  }
});

module.exports = router;
