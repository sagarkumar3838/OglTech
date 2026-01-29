const express = require('express');
const router = express.Router();
const { generateScorecard } = require('../services/scorecardGenerator');
const { db } = require('../index');

// Generate scorecard from submission
router.post('/generate', async (req, res) => {
  try {
    const { submissionId } = req.body;
    
    if (!submissionId) {
      return res.status(400).json({ error: 'Submission ID required' });
    }
    
    // Get submission data
    const submissionDoc = await db.collection('submissions').doc(submissionId).get();
    if (!submissionDoc.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    const submission = submissionDoc.data();
    
    // Get evaluation data
    const evalDoc = await db.collection('evaluations').doc(submission.evaluation_id).get();
    const evaluation = evalDoc.data();
    
    // Get questions
    const questionsSnapshot = await db.collection('questions')
      .where('evaluation_id', '==', submission.evaluation_id)
      .get();
    const questions = questionsSnapshot.docs.map(doc => doc.data());
    
    // Generate scorecard
    const scorecard = await generateScorecard({
      answers: submission.answers,
      questions,
      skill: evaluation.skill,
      level: evaluation.level,
      candidateName: submission.candidate_name,
      userId: submission.user_id
    });
    
    // Store scorecard
    const scorecardRef = await db.collection('scorecards').add({
      ...scorecard,
      submission_id: submissionId,
      evaluation_id: submission.evaluation_id
    });
    
    res.json({
      scorecard_id: scorecardRef.id,
      ...scorecard
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get scorecard by ID
router.get('/:scorecardId', async (req, res) => {
  try {
    const { scorecardId } = req.params;
    const doc = await db.collection('scorecards').doc(scorecardId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Scorecard not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all scorecards (admin)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('scorecards')
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();
    
    const scorecards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ scorecards });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
