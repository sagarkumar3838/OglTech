const express = require('express');
const router = express.Router();
const multer = require('multer');
const { AssemblyAI } = require('assemblyai');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize AssemblyAI client
const getAssemblyAIClient = () => {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY not configured');
  }
  return new AssemblyAI({ apiKey });
};

/**
 * POST /api/transcription/transcribe
 * Transcribe audio using AssemblyAI
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No audio file provided' 
      });
    }

    const client = getAssemblyAIClient();
    
    // Convert buffer to base64 for AssemblyAI
    const audioBuffer = req.file.buffer;
    
    // Upload audio to AssemblyAI
    const uploadUrl = await client.files.upload(audioBuffer);
    
    // Create transcription
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      language_code: req.body.language || 'en'
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    res.json({
      success: true,
      text: transcript.text,
      confidence: transcript.confidence,
      words: transcript.words
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to transcribe audio'
    });
  }
});

/**
 * POST /api/transcription/transcribe-url
 * Transcribe audio from URL using AssemblyAI
 */
router.post('/transcribe-url', async (req, res) => {
  try {
    const { audio_url, language } = req.body;

    if (!audio_url) {
      return res.status(400).json({ 
        success: false, 
        error: 'No audio URL provided' 
      });
    }

    const client = getAssemblyAIClient();
    
    // Create transcription from URL
    const transcript = await client.transcripts.transcribe({
      audio: audio_url,
      language_code: language || 'en'
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    res.json({
      success: true,
      text: transcript.text,
      confidence: transcript.confidence,
      words: transcript.words
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to transcribe audio'
    });
  }
});

module.exports = router;
