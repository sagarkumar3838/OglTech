const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Import your server app
// Note: We'll need to copy the built server files here
const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins in Firebase Functions
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: 'firebase',
    message: 'Firebase Functions API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SkillEval API Server on Firebase Functions',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      note: 'Full API endpoints available after deployment'
    }
  });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
