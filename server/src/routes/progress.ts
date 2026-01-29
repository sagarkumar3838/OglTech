import { Router, Request, Response } from 'express';
import { userProgressService } from '../services/userProgressService';
import admin from '../config/firebase';

const router = Router();
const db = admin.firestore();

// Get user progress for a career
router.get('/:userId/:careerId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, careerId } = req.params;

    let progress = await userProgressService.getUserProgress(userId, careerId);

    // If no progress exists, initialize it
    if (!progress) {
      const careerDoc = await db.collection('careers').doc(careerId).get();
      
      if (!careerDoc.exists) {
        res.status(404).json({ error: 'Career not found' });
        return;
      }

      const careerData = careerDoc.data();
      const skills = careerData!.skills.map((s: any) => s.name);

      progress = await userProgressService.initializeProgress(userId, careerId, skills);
    }

    res.json(progress);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// Update progress after completing a level
router.post('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, careerId, skillName, level, score, scorecardId } = req.body;

    if (!userId || !careerId || !skillName || !level || score === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check if a level is unlocked
router.get(
  '/check-unlock/:userId/:careerId/:skillName/:level',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, careerId, skillName, level } = req.params;

      const isUnlocked = await userProgressService.isLevelUnlocked(
        userId,
        careerId,
        skillName,
        level as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
      );

      res.json({ unlocked: isUnlocked });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to check level unlock status' });
    }
  }
);

// Get skill progress
router.get(
  '/skill/:userId/:careerId/:skillName',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, careerId, skillName } = req.params;

      const skillProgress = await userProgressService.getSkillProgress(
        userId,
        careerId,
        skillName
      );

      if (!skillProgress) {
        res.status(404).json({ error: 'Skill progress not found' });
        return;
      }

      res.json(skillProgress);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to get skill progress' });
    }
  }
);

// Get progress statistics
router.get('/stats/:userId/:careerId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, careerId } = req.params;

    const stats = await userProgressService.getProgressStats(userId, careerId);

    res.json(stats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get progress statistics' });
  }
});

export default router;
