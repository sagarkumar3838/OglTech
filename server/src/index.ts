import * as functions from 'firebase-functions';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter';
import questionRoutes from './routes/questions';
import evaluationRoutes from './routes/evaluations';
import scorecardRoutes from './routes/scorecards';
import careerRoutes from './routes/careers';
import adminRoutes from './routes/admin';
import progressRoutes from './routes/progress';
import aiChatRoutes from './routes/aiChat';

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Apply rate limiting to all routes
app.use(rateLimiter.middleware());

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/scorecards', scorecardRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', aiChatRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    typescript: true,
    features: {
      rag: true,
      multipleAIProviders: true,
      rateLimiting: true,
      questionBank: true,
      progressTracking: true
    }
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Export Firebase Function
export const api = functions.https.onRequest(app);
