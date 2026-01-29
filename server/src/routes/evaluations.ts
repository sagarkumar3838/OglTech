import { Router, Request, Response } from 'express';
import admin from '../config/firebase';

const router = Router();
const db = admin.firestore();

// Submit evaluation answers
router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { evaluationId, userId, candidateName, answers } = req.body;

    if (!evaluationId || !userId || !answers) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Get questions with correct answers
    const questionsSnapshot = await db
      .collection('questions')
      .where('evaluation_id', '==', evaluationId)
      .get();

    const questions = questionsSnapshot.docs.map((doc) => doc.data());

    // Calculate results
    const results = questions.map((q, idx) => ({
      question_id: q.question_id,
      user_answer: answers[idx],
      correct_answer: q.correct_answer,
      is_correct: answers[idx] === q.correct_answer,
    }));

    const correctCount = results.filter((r) => r.is_correct).length;
    const score = Math.round((correctCount / questions.length) * 100);

    // Store submission
    const submissionRef = await db.collection('submissions').add({
      evaluation_id: evaluationId,
      user_id: userId,
      candidate_name: candidateName,
      answers,
      results,
      score,
      correct_count: correctCount,
      total_questions: questions.length,
      submitted_at: new Date().toISOString(),
    });

    res.json({
      submission_id: submissionRef.id,
      score,
      correct_count: correctCount,
      total_questions: questions.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  }
});

// Get evaluation by ID
router.get('/:evaluationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { evaluationId } = req.params;
    const doc = await db.collection('evaluations').doc(evaluationId).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Evaluation not found' });
      return;
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

// Get user's evaluations
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection('submissions')
      .where('user_id', '==', userId)
      .orderBy('submitted_at', 'desc')
      .get();

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ submissions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch user evaluations' });
  }
});

export default router;
