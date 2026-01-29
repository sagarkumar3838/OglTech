const express = require('express');
const router = express.Router();
const { db } = require('../index');

// Get all careers
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('careers').get();
    const careers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({ careers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get career by ID
router.get('/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;
    const doc = await db.collection('careers').doc(careerId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Career not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create career (admin)
router.post('/', async (req, res) => {
  try {
    const { name, description, skills } = req.body;
    
    if (!name || !skills) {
      return res.status(400).json({ error: 'Name and skills required' });
    }
    
    const careerRef = await db.collection('careers').add({
      name,
      description,
      skills,
      created_at: new Date().toISOString()
    });
    
    res.json({ id: careerRef.id, message: 'Career created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
