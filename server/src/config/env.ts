import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface EnvConfig {
  // Firebase
  firebase: {
    projectId: string;
  };
  
  // AI Providers
  openai: {
    apiKey: string;
    model: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
  google: {
    apiKey: string;
    model: string;
  };
  xai: {
    apiKey: string;
    model: string;
  };
  groq: {
    apiKey: string;
    model: string;
  };
  deepseek: {
    apiKey: string;
    model: string;
  };
  
  // RAG Configuration
  rag: {
    enabled: boolean;
    strategy: 'hybrid' | 'rag_only' | 'ai_only';
    questionBankPercentage: number;
    similarityThreshold: number;
  };
  
  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    enabled: boolean;
  };
  
  // App
  nodeEnv: string;
  port: number;
  aiProviderPriority: string[];
}

const getEnvVar = (key: string, defaultValue?: string, silent: boolean = false): string => {
  const value = process.env[key] || defaultValue;
  if (!value && !defaultValue && !silent) {
    console.warn(`Warning: Missing environment variable: ${key}`);
    return '';
  }
  return value || '';
};

export const config: EnvConfig = {
  firebase: {
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'your-project-id'),
  },
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY', ''),
    model: getEnvVar('OPENAI_MODEL', 'gpt-4-turbo-preview'),
  },
  anthropic: {
    apiKey: getEnvVar('ANTHROPIC_API_KEY', '', true), // Silent - optional provider
    model: getEnvVar('ANTHROPIC_MODEL', 'claude-3-5-sonnet-20241022'),
  },
  google: {
    apiKey: getEnvVar('GOOGLE_API_KEY', '', true), // Silent - optional provider
    model: getEnvVar('GOOGLE_MODEL', 'gemini-1.5-pro'),
  },
  xai: {
    apiKey: getEnvVar('XAI_API_KEY', '', true), // Silent - optional provider
    model: getEnvVar('XAI_MODEL', 'grok-beta'),
  },
  groq: {
    apiKey: getEnvVar('GROQ_API_KEY', ''),
    model: getEnvVar('GROQ_MODEL', 'llama-3.1-70b-versatile'),
  },
  deepseek: {
    apiKey: getEnvVar('DEEPSEEK_API_KEY', ''),
    model: getEnvVar('DEEPSEEK_MODEL', 'deepseek-chat'),
  },
  rag: {
    enabled: getEnvVar('RAG_ENABLED', 'true') === 'true',
    strategy: (getEnvVar('RAG_STRATEGY', 'hybrid') as 'hybrid' | 'rag_only' | 'ai_only'),
    questionBankPercentage: parseInt(getEnvVar('RAG_QUESTION_BANK_PERCENTAGE', '40')),
    similarityThreshold: parseFloat(getEnvVar('RAG_SIMILARITY_THRESHOLD', '0.7')),
  },
  rateLimit: {
    windowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000')),
    maxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '10')),
    enabled: getEnvVar('RATE_LIMIT_ENABLED', 'true') === 'true',
  },
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '5001')),
  aiProviderPriority: getEnvVar('AI_PROVIDER_PRIORITY', 'openai,groq,deepseek,anthropic,google,xai').split(','),
};

export default config;
