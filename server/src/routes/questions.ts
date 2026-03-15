import express from 'express';
import { randomBytes } from 'crypto';
import { HybridQuestionService } from '../services/hybridQuestionService';

const router = express.Router();
const questionService = new HybridQuestionService();

/**
 * POST /api/questions/generate
 * Generate questions using hybrid approach
 * 
 * Body:
 * {
 *   "skill": "JavaScript",
 *   "level": "BASIC",
 *   "count": 10,
 *   "useAI": true  // optional, defaults to true
 * }
 */
router.post('/generate', async (req, res) => {
  try {
    const { skill, level, count = 10, useAI = true } = req.body;

    // Input validation
    if (!skill || !level) {
      return res.status(400).json({
        success: false,
        error: 'Skill and level are required'
      });
    }

    // Sanitize and validate inputs
    const sanitizedSkill = String(skill).trim().substring(0, 100);
    const sanitizedLevel = String(level).trim().toUpperCase();
    const validatedCount = Math.min(Math.max(parseInt(count) || 10, 1), 100); // Limit 1-100
    
    // Validate level
    const validLevels = ['BASIC', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EASY', 'MEDIUM', 'HARD'];
    if (!validLevels.includes(sanitizedLevel)) {
      return res.status(400).json({
        success: false,
        error: `Invalid level. Must be one of: ${validLevels.join(', ')}`
      });
    }

    const questions = await questionService.generateQuestions(
      sanitizedSkill,
      sanitizedLevel,
      validatedCount,
      Boolean(useAI)
    );

    // Generate evaluation ID using cryptographically secure random
    const randomSuffix = randomBytes(16).toString('hex');
    const evaluationId = `eval-${Date.now()}-${randomSuffix}`;

    res.json({
      success: true,
      data: {
        evaluation_id: evaluationId,
        skill: sanitizedSkill,
        level: sanitizedLevel,
        count: questions.length,
        questions,
        source: useAI ? 'AI' : 'Database'
      }
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate questions'
    });
  }
});

/**
 * POST /api/questions/generate-html5
 * Generate questions for specific HTML5 features
 * 
 * Body:
 * {
 *   "features": ["Web Workers API", "WebSockets", "Canvas 2D Context"],
 *   "level": "BASIC",
 *   "questionsPerFeature": 2,
 *   "useAI": true
 * }
 */
router.post('/generate-html5', async (req, res) => {
  try {
    const { 
      features, 
      level = 'BASIC', 
      questionsPerFeature = 2, 
      useAI = true 
    } = req.body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Features array is required'
      });
    }

    const allQuestions = [];
    
    // Generate questions for each feature
    for (const feature of features) {
      const questions = await questionService.generateQuestions(
        `HTML5 - ${feature}`,
        level,
        questionsPerFeature,
        useAI
      );
      
      allQuestions.push({
        feature,
        questions
      });
    }

    res.json({
      success: true,
      data: {
        level,
        totalFeatures: features.length,
        totalQuestions: allQuestions.reduce((sum, f) => sum + f.questions.length, 0),
        questionsByFeature: allQuestions,
        source: useAI ? 'AI' : 'Database'
      }
    });
  } catch (error: any) {
    console.error('Error generating HTML5 questions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate HTML5 questions'
    });
  }
});

/**
 * GET /api/questions/stats
 * Get question statistics from database
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await questionService.getQuestionStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch stats'
    });
  }
});

export default router;
