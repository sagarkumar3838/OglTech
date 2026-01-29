const express = require('express');
const router = express.Router();
const { db } = require('../index');

// Submit evaluation answers
router.post('/submit', async (req, res) => {
  try {
    const { evaluationId, userId, candidateName, answers } = req.body;
    
    if (!evaluationId || !userId || !answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get questions with correct answers
    const questionsSnapshot = await db.collection('questions')
      .where('evaluation_id', '==', evaluationId)
      .get();
    
    const questions = questionsSnapshot.docs.map(doc => doc.data());
    
    // Calculate results
    const results = questions.map((q, idx) => ({
      question_id: q.question_id,
      user_answer: answers[idx],
      correct_answer: q.correct_answer,
      is_correct: answers[idx] === q.correct_answer
    }));
    
    const correctCount = results.filter(r => r.is_correct).length;
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
      submitted_at: new Date().toISOString()
    });
    
    res.json({
      submission_id: submissionRef.id,
      score,
      correct_count: correctCount,
      total_questions: questions.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get evaluation by ID
router.get('/:evaluationId', async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const doc = await db.collection('evaluations').doc(evaluationId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's evaluations
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const snapshot = await db.collection('submissions')
      .where('user_id', '==', userId)
      .orderBy('submitted_at', 'desc')
      .get();
    
    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ submissions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
