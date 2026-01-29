import { Router, Request, Response } from 'express';
import admin from '../config/firebase';

const router = Router();
const db = admin.firestore();

// Get all careers
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('careers').get();
    const careers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ careers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// Get career by ID
router.get('/:careerId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { careerId } = req.params;
    const doc = await db.collection('careers').doc(careerId).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Career not found' });
      return;
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch career' });
  }
});

// Create career (admin)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, skills } = req.body;

    if (!name || !skills) {
      res.status(400).json({ error: 'Name and skills required' });
      return;
    }

    const careerRef = await db.collection('careers').add({
      name,
      description,
      skills,
      created_at: new Date().toISOString(),
    });

    res.json({ id: careerRef.id, message: 'Career created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create career' });
  }
});

export default router;
