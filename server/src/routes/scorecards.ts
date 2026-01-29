import { Router, Request, Response } from 'express';
import { generateScorecard } from '../services/scorecardGenerator';
import { userProgressService } from '../services/userProgressService';
import admin from '../config/firebase';

const router = Router();
const db = admin.firestore();

// Generate scorecard from submission
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { submissionId, careerId, skillName, level } = req.body;

    if (!submissionId) {
      res.status(400).json({ error: 'Submission ID required' });
      return;
    }

    // Get submission data
    const submissionDoc = await db.collection('submissions').doc(submissionId).get();
    if (!submissionDoc.exists) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    const submission = submissionDoc.data()!;

    // Get evaluation data
    const evalDoc = await db.collection('evaluations').doc(submission.evaluation_id).get();
    const evaluation = evalDoc.data()!;

    // Get questions
    const questionsSnapshot = await db
      .collection('questions')
      .where('evaluation_id', '==', submission.evaluation_id)
      .get();
    const questions = questionsSnapshot.docs.map((doc) => doc.data());

    // Generate scorecard
    const scorecard = await generateScorecard({
      answers: submission.answers,
      questions: questions as any,
      skill: evaluation.skill,
      level: evaluation.level,
      candidateName: submission.candidate_name,
      userId: submission.user_id,
    });

    // Store scorecard
    const scorecardRef = await db.collection('scorecards').add({
      ...scorecard,
      submission_id: submissionId,
      evaluation_id: submission.evaluation_id,
    });

    // Update user progress if careerId, skillName, and level are provided
    if (careerId && skillName && level) {
      try {
        await userProgressService.updateProgress(
          submission.user_id,
          careerId,
          skillName,
          level,
          scorecard.overall_score,
          scorecardRef.id
        );
        console.log(`✓ Updated progress for ${submission.user_id}`);
      } catch (error) {
        console.error('Error updating progress:', error);
        // Don't fail the request if progress update fails
      }
    }

    res.json({
      scorecard_id: scorecardRef.id,
      ...scorecard,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate scorecard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get scorecard by ID
router.get('/:scorecardId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { scorecardId } = req.params;
    const doc = await db.collection('scorecards').doc(scorecardId).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Scorecard not found' });
      return;
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch scorecard' });
  }
});

// Get all scorecards (admin)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db
      .collection('scorecards')
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();

    const scorecards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ scorecards });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch scorecards' });
  }
});

export default router;
