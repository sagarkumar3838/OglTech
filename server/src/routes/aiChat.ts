import { Router } from 'express';
import axios from 'axios';
import config from '../config/env';

const router = Router();

// AI Provider configurations
const providers = {
  openai: {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    getHeaders: () => ({
      'Authorization': `Bearer ${config.openai.apiKey}`,
      'Content-Type': 'application/json',
    }),
    getPayload: (message: string) => ({
      model: 'gpt-3.5-turbo', // Free tier model
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant specialized in programming, career development, and technical education. 
You provide clear, accurate, and friendly responses. Format your responses in a readable way with proper spacing and structure.
Be encouraging and supportive while maintaining technical accuracy.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
    extractResponse: (data: any) => data.choices[0].message.content,
    isConfigured: () => !!config.openai.apiKey
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    getHeaders: () => ({
      'Authorization': `Bearer ${config.groq.apiKey}`,
      'Content-Type': 'application/json',
    }),
    getPayload: (message: string) => ({
      model: config.groq.model || 'llama-3.3-70b-versatile', // Updated to latest free model
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant specialized in programming, career development, and technical education. 
You provide clear, accurate, and friendly responses. Format your responses in a readable way with proper spacing and structure.
Be encouraging and supportive while maintaining technical accuracy.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
    extractResponse: (data: any) => data.choices[0].message.content,
    isConfigured: () => !!config.groq.apiKey
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    getHeaders: () => ({
      'Authorization': `Bearer ${config.deepseek.apiKey}`,
      'Content-Type': 'application/json',
    }),
    getPayload: (message: string) => ({
      model: config.deepseek.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant specialized in programming, career development, and technical education. 
You provide clear, accurate, and friendly responses. Format your responses in a readable way with proper spacing and structure.
Be encouraging and supportive while maintaining technical accuracy.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
    extractResponse: (data: any) => data.choices[0].message.content,
    isConfigured: () => !!config.deepseek.apiKey
  }
};

// Test endpoint to check configuration
router.get('/ai-chat/test', (req, res) => {
  const configuredProviders = Object.entries(providers)
    .filter(([_, provider]) => provider.isConfigured())
    .map(([name, provider]) => ({
      name,
      displayName: provider.name,
      configured: true
    }));

  res.json({
    status: 'ok',
    availableProviders: configuredProviders,
    totalConfigured: configuredProviders.length,
    timestamp: new Date().toISOString()
  });
});

// Try to get response from AI providers with fallback
async function getAIResponse(message: string): Promise<{ response: string; provider: string }> {
  const providerOrder = ['groq', 'openai', 'deepseek']; // Groq is fastest and free
  const errors: any[] = [];

  for (const providerName of providerOrder) {
    const provider = providers[providerName as keyof typeof providers];
    
    if (!provider.isConfigured()) {
      console.log(`⏭️  Skipping ${provider.name} - not configured`);
      continue;
    }

    try {
      console.log(`🤖 Trying ${provider.name}...`);
      
      const response = await axios.post(
        provider.url,
        provider.getPayload(message),
        { headers: provider.getHeaders() }
      );

      const aiResponse = provider.extractResponse(response.data);
      console.log(`✅ ${provider.name} responded successfully`);
      
      return {
        response: aiResponse,
        provider: provider.name
      };
    } catch (error: any) {
      console.error(`❌ ${provider.name} failed:`, error.response?.data?.error?.message || error.message);
      errors.push({
        provider: provider.name,
        error: error.response?.data?.error?.message || error.message
      });
      // Continue to next provider
    }
  }

  // All providers failed
  throw new Error(`All AI providers failed. Errors: ${JSON.stringify(errors)}`);
}

router.post('/ai-chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    console.log('💬 AI Chat Request:', { 
      message: message?.substring(0, 50) + '...', 
      userId,
      timestamp: new Date().toISOString()
    });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if any provider is configured
    const hasConfiguredProvider = Object.values(providers).some(p => p.isConfigured());
    if (!hasConfiguredProvider) {
      console.error('❌ No AI providers configured');
      return res.status(500).json({ 
        error: 'No AI providers configured',
        details: 'Please set at least one of: OPENAI_API_KEY, GROQ_API_KEY, or DEEPSEEK_API_KEY in your .env file'
      });
    }

    // Try to get response with automatic fallback
    const { response: aiResponse, provider } = await getAIResponse(message);

    res.json({
      response: aiResponse,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('💥 AI Chat Error:', error.message);
    
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message,
      hint: 'Check server logs for more details. Make sure at least one AI provider API key is configured.'
    });
  }
});

export default router;
