import { Router, Request, Response } from 'express';
import { questionBank } from '../services/rag/QuestionBank';
import { aiProviderManager } from '../services/aiProviders/AIProviderManager';
import admin from '../config/firebase';

const router = Router();
const db = admin.firestore();

// Get question bank statistics
router.get('/question-bank/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await questionBank.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Verify a question in the question bank
router.post('/question-bank/verify/:questionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;
    await questionBank.verifyQuestion(questionId);
    res.json({ message: 'Question verified successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to verify question' });
  }
});

// Get unverified questions
router.get('/question-bank/unverified', async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db
      .collection('question_bank')
      .where('verified', '==', false)
      .limit(50)
      .get();

    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch unverified questions' });
  }
});

// Get AI provider status
router.get('/ai-providers/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = aiProviderManager.getProviderStats();
    const availableProviders = aiProviderManager.getAvailableProviders();
    
    res.json({
      providers: stats,
      priority: availableProviders,
      total: availableProviders.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch provider status' });
  }
});

// Manually add question to question bank
router.post('/question-bank/add', async (req: Request, res: Response): Promise<void> => {
  try {
    const question = req.body;
    
    if (!question.question_id) {
      res.status(400).json({ error: 'question_id is required' });
      return;
    }

    await questionBank.addQuestion(question);
    res.json({ message: 'Question added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Bulk import questions to question bank
router.post('/question-bank/bulk-import', async (req: Request, res: Response): Promise<void> => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      res.status(400).json({ error: 'questions must be an array' });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const question of questions) {
      try {
        await questionBank.addQuestion(question);
        successCount++;
      } catch (error) {
        console.error('Error adding question:', error);
        errorCount++;
      }
    }

    res.json({
      message: 'Bulk import completed',
      success: successCount,
      errors: errorCount,
      total: questions.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to bulk import questions' });
  }
});

export default router;
