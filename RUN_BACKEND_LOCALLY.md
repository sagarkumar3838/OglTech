# Running Backend Server Locally

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create `server/.env` file:
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Providers (at least one required)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
XAI_API_KEY=...

# AI Provider Priority (comma-separated)
AI_PROVIDER_PRIORITY=openai,groq,deepseek,anthropic,google,xai

# Server Configuration
PORT=5001
NODE_ENV=development

# CORS - Add your Firebase URLs
FIREBASE_HOSTING_URL=https://your-app.web.app
VITE_APP_URL=http://localhost:3002

# Rate Limiting
RATE_LIMIT_ENABLED=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# RAG Configuration
RAG_ENABLED=true
RAG_STRATEGY=hybrid
RAG_QUESTION_BANK_PERCENTAGE=40
RAG_SIMILARITY_THRESHOLD=0.7
```

### 3. Start the Server

**Development Mode (with auto-reload):**
```bash
cd server
npm run dev
```

**Production Mode:**
```bash
cd server
npm run build
npm start
```

### 4. Verify Server is Running
Open browser to:
- http://localhost:5001/api/health
- Should see: `{"status":"ok",...}`

## Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Testing the Server

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Generate Questions
```bash
curl -X POST http://localhost:5001/api/questions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "skill": "html",
    "level": "easy",
    "count": 10,
    "useAI": true
  }'
```

### AI Chat
```bash
curl -X POST http://localhost:5001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is HTML?",
    "userId": "test-user"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change port in .env
PORT=5002
```

### CORS Errors
1. Check `VITE_APP_URL` in server/.env matches your frontend URL
2. Add your domain to `allowedOrigins` in server/src/server.ts
3. Restart server after changes

### AI Provider Errors
1. Check API keys are valid
2. Verify at least one provider is configured
3. Check provider priority order in AI_PROVIDER_PRIORITY
4. Server will try providers in order until one succeeds

### Database Connection Errors
1. Verify VITE_SUPABASE_URL is correct
2. Check VITE_SUPABASE_ANON_KEY is valid
3. Ensure RLS policies are set up (run fix-rls-UUID-version.sql)

## Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_SUPABASE_URL | Yes | Your Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Yes | Supabase anonymous key |
| OPENAI_API_KEY | No* | OpenAI API key |
| GROQ_API_KEY | No* | Groq API key (free tier available) |
| DEEPSEEK_API_KEY | No* | DeepSeek API key |
| ANTHROPIC_API_KEY | No* | Anthropic Claude API key |
| GOOGLE_API_KEY | No* | Google Gemini API key |
| XAI_API_KEY | No* | xAI Grok API key |
| PORT | No | Server port (default: 5001) |
| NODE_ENV | No | Environment (development/production) |

*At least one AI provider key is required for AI generation to work

## Next Steps

After server is running:
1. Start frontend: `cd client && npm run dev`
2. Test AI generation in the app
3. Check server logs for any errors
4. Monitor API calls in browser DevTools
