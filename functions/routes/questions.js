const express = require('express');
const router = express.Router();
const { generateQuestions } = require('../services/questionGenerator');
const { db } = require('../index');

// Generate new questions using AI
router.post('/generate', async (req, res) => {
  try {
    const { skill, level, count = 10 } = req.body;
    
    if (!skill || !level) {
      return res.status(400).json({ error: 'Skill and level are required' });
    }
    
    const validLevels = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];
    const validSkills = ['HTML', 'CSS', 'JavaScript'];
    
    if (!validLevels.includes(level) || !validSkills.includes(skill)) {
      return res.status(400).json({ error: 'Invalid skill or level' });
    }
    
    const questionsData = await generateQuestions(skill, level, count);
    
    // Store questions in Firestore
    const batch = db.batch();
    questionsData.questions.forEach(question => {
      const docRef = db.collection('questions').doc(question.question_id);
      batch.set(docRef, {
        ...question,
        evaluation_id: questionsData.evaluation_id
      });
    });
    await batch.commit();
    
    // Store evaluation metadata
    await db.collection('evaluations').doc(questionsData.evaluation_id).set({
      skill,
      level,
      question_count: count,
      generated_at: questionsData.generated_at,
      status: 'generated'
    });
    
    // Return questions without correct answers
    const sanitizedQuestions = questionsData.questions.map(q => {
      const { correct_answer, ...rest } = q;
      return rest;
    });
    
    res.json({
      evaluation_id: questionsData.evaluation_id,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get questions by evaluation ID
router.get('/:evaluationId', async (req, res) => {
  try {
    const { evaluationId } = req.params;
    
    const snapshot = await db.collection('questions')
      .where('evaluation_id', '==', evaluationId)
      .get();
    
    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      const { correct_answer, ...rest } = data;
      return rest;
    });
    
    res.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
