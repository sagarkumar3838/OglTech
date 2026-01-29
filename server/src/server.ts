import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimiter } from './middleware/rateLimiter';
import questionRoutes from './routes/questions';
import evaluationRoutes from './routes/evaluations';
import scorecardRoutes from './routes/scorecards';
import careerRoutes from './routes/careers';
import adminRoutes from './routes/admin';
import progressRoutes from './routes/progress';
import aiChatRoutes from './routes/aiChat';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(rateLimiter.middleware());

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/scorecards', scorecardRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', aiChatRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      rag: true,
      multipleAIProviders: true,
      rateLimiting: true,
      questionBank: true,
      progressTracking: true
    }
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'SkillEval API Server',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      questions: '/api/questions',
      evaluations: '/api/evaluations',
      scorecards: '/api/scorecards',
      careers: '/api/careers',
      progress: '/api/progress',
      aiChat: '/api/chat'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      '/api/health',
      '/api/questions',
      '/api/evaluations',
      '/api/scorecards',
      '/api/careers',
      '/api/progress',
      '/api/chat'
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server (only if not running in Firebase Functions)
if (process.env.NODE_ENV !== 'firebase') {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           🚀 SkillEval API Server Running! 🚀                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Server: http://localhost:${PORT}
Health: http://localhost:${PORT}/api/health
Environment: ${process.env.NODE_ENV || 'development'}

Available Endpoints:
  - GET  /api/health
  - GET  /api/questions
  - POST /api/evaluations
  - POST /api/scorecards
  - GET  /api/careers
  - GET  /api/progress
  - POST /api/chat

Press Ctrl+C to stop the server
    `);
  });
}

export default app;
