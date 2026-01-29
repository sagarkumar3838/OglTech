# Localhost Setup Guide

Run the Skill Evaluation Platform on your local machine in under 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is fine)
- At least ONE AI provider API key (choose one):
  - OpenAI (recommended for testing)
  - Anthropic Claude
  - Google Gemini
  - Groq (fastest)
  - X.AI Grok

## Step 1: Install Dependencies (2 minutes)

```bash
# Install all dependencies
npm run install:all
```

This installs dependencies for:
- Root project
- Client (React frontend)
- Server (Node.js backend)

## Step 2: Create `.env` File (3 minutes)

Create a `.env` file in the **root directory**:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your values:

```env
# ============================================
# FIREBASE CONFIGURATION
# ============================================
# Get these from: https://console.firebase.google.com/
# Project Settings > General > Your apps > Web app

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# ============================================
# API URL (LOCALHOST)
# ============================================
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api

# ============================================
# AI PROVIDER (CHOOSE AT LEAST ONE)
# ============================================

# Option 1: OpenAI (Recommended for testing)
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Option 2: Anthropic Claude (High quality)
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Option 3: Google Gemini (Free tier available)
# GOOGLE_API_KEY=your-google-key-here
# GOOGLE_MODEL=gemini-1.5-pro

# Option 4: Groq (Ultra fast, free tier)
# GROQ_API_KEY=gsk_your-groq-key-here
# GROQ_MODEL=llama-3.1-70b-versatile

# Option 5: X.AI Grok
# XAI_API_KEY=xai-your-key-here
# XAI_MODEL=grok-beta

# ============================================
# RAG CONFIGURATION
# ============================================

# For localhost testing, use AI_ONLY mode
RAG_ENABLED=true
RAG_STRATEGY=ai_only
RAG_QUESTION_BANK_PERCENTAGE=0

# ============================================
# RATE LIMITING (Disable for localhost)
# ============================================
RATE_LIMIT_ENABLED=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# APPLICATION
# ============================================
NODE_ENV=development
PORT=5001

# AI Provider Priority (if you have multiple)
AI_PROVIDER_PRIORITY=openai,anthropic,google,groq,xai
```

### Important Notes:

1. **Firebase Config**: Get from Firebase Console → Project Settings → Your apps → Web app
2. **API URL**: Replace `your-project-id` with your actual Firebase project ID
3. **AI Provider**: You only need ONE API key to start
4. **RAG Strategy**: Set to `ai_only` for localhost (no question bank needed)
5. **Rate Limiting**: Disabled for localhost testing

## Step 3: Firebase Setup (2 minutes)

### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Click "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

### Enable Firestore

1. Go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for localhost)
4. Choose location (e.g., us-central)
5. Click "Enable"

### Update `.firebaserc`

Edit `.firebaserc` file:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Replace `your-actual-project-id` with your Firebase project ID.

## Step 4: Add Sample Career (1 minute)

Go to Firebase Console → Firestore Database → Start collection:

```
Collection ID: careers
Document ID: (auto-generate)

Fields:
  name (string): "OGL Content Developer"
  description (string): "Frontend developer specializing in web content"
  skills (array):
    [0] (map):
      name (string): "HTML"
      level (string): "Intermediate"
    [1] (map):
      name (string): "CSS"
      level (string): "Intermediate"
    [2] (map):
      name (string): "JavaScript"
      level (string): "Intermediate"
  created_at (string): "2026-01-20T00:00:00.000Z"
```

## Step 5: Run the Application (1 minute)

Open **TWO terminal windows**:

### Terminal 1 - Backend Server

```bash
npm run dev:server
```

You should see:
```
✔  functions[us-central1-api]: http function initialized
🤖 AI Provider Manager initialized with 1 provider(s):
   Priority order: openai
```

### Terminal 2 - Frontend Client

```bash
npm run dev:client
```

You should see:
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 6: Test the Application!

1. **Open browser**: http://localhost:3000

2. **Sign Up**:
   - Click "Sign Up"
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Sign Up"

3. **Go to Careers**:
   - Click "Careers" in navigation
   - You should see "OGL Content Developer"

4. **Start Evaluation**:
   - Click "OGL Content Developer"
   - Click "HTML" skill
   - Click "Intermediate" level
   - Wait for AI to generate questions (10-30 seconds)

5. **Complete Evaluation**:
   - Answer the questions
   - Click "Next" to navigate
   - Click "Submit Evaluation" when done

6. **View Scorecard**:
   - See your overall score
   - View dimension scores
   - Check strengths and gaps
   - See learning recommendations

## Troubleshooting

### Issue: "No AI providers configured"

**Solution**: Add at least one API key to `.env`

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

Then restart the server:
```bash
# Stop server (Ctrl+C)
npm run dev:server
```

### Issue: "Firebase permission denied"

**Solution**: Make sure Firestore is in "test mode"

1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Use these rules for localhost:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Open for localhost testing
    }
  }
}
```

4. Click "Publish"

**⚠️ Warning**: These rules are ONLY for localhost testing. Use proper rules for production!

### Issue: "Cannot connect to backend"

**Solution**: Check the API URL in `.env`

```env
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api
```

Make sure `your-project-id` matches your Firebase project ID.

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies

```bash
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### Issue: TypeScript errors

**Solution**: Check TypeScript compilation

```bash
npm run type-check
```

Fix any errors shown.

### Issue: Port already in use

**Solution**: Change the port

Edit `.env`:
```env
PORT=5002  # Change from 5001 to 5002
```

Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill -9
```

## Configuration for Localhost

### AI Only Mode (No Question Bank)

```env
RAG_ENABLED=true
RAG_STRATEGY=ai_only
```

This means:
- ✅ All questions generated by AI
- ✅ No question bank needed
- ✅ Maximum variety
- ✅ Simple setup

### Disable Rate Limiting

```env
RATE_LIMIT_ENABLED=false
```

This allows unlimited requests for testing.

### Use Fastest Provider

For quick testing, use Groq (fastest inference):

```env
GROQ_API_KEY=gsk_your-key-here
AI_PROVIDER_PRIORITY=groq
```

## Getting API Keys

### OpenAI (Recommended for Testing)

1. Go to https://platform.openai.com/
2. Sign up / Login
3. Go to "API keys"
4. Click "Create new secret key"
5. Copy key (starts with `sk-`)
6. Add to `.env`: `OPENAI_API_KEY=sk-...`

**Cost**: ~$0.10 per evaluation (10 questions)

### Groq (Free Tier Available)

1. Go to https://console.groq.com/
2. Sign up
3. Create API key
4. Copy key (starts with `gsk_`)
5. Add to `.env`: `GROQ_API_KEY=gsk_...`

**Cost**: Free tier available, very fast!

### Google Gemini (Free Tier Available)

1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy key
4. Add to `.env`: `GOOGLE_API_KEY=...`

**Cost**: Free tier available

## Localhost vs Production

| Feature | Localhost | Production |
|---------|-----------|------------|
| RAG Strategy | `ai_only` | `hybrid` |
| Rate Limiting | Disabled | Enabled |
| Firestore Rules | Test mode | Secure rules |
| API URL | localhost:5001 | Cloud Functions URL |
| Question Bank | Not needed | Recommended |
| Cost | Pay per API call | Optimized with caching |

## Next Steps

### 1. Test Different Levels

Try all three levels:
- Basic
- Intermediate  
- Advanced

### 2. Test Different Skills

Try all three skills:
- HTML
- CSS
- JavaScript

### 3. Add More Providers

Add multiple API keys for fallback:

```env
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
GOOGLE_API_KEY=...
```

### 4. Enable Question Bank (Optional)

If you want to use the question bank on localhost:

```bash
# Seed question bank
npx tsx scripts/seed-question-bank.ts

# Change strategy
RAG_STRATEGY=hybrid
RAG_QUESTION_BANK_PERCENTAGE=40
```

### 5. Deploy to Production

When ready, follow the deployment guide:
```bash
npm run deploy
```

See `DEPLOYMENT.md` for details.

## Quick Commands Reference

```bash
# Install everything
npm run install:all

# Run backend
npm run dev:server

# Run frontend
npm run dev:client

# Check types
npm run type-check

# Build for production
npm run build:client
npm run build:server

# Deploy to Firebase
npm run deploy
```

## Localhost Architecture

```
Browser (localhost:3000)
    │
    │ HTTP Requests
    ▼
Express Server (localhost:5001)
    │
    ├─→ Rate Limiter (disabled)
    ├─→ Authentication
    └─→ RAG Service (ai_only mode)
            │
            └─→ AI Provider Manager
                    │
                    └─→ OpenAI / Groq / Google / etc.
                            │
                            └─→ Generate Questions
                                    │
                                    └─→ Return to User
```

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm run install:all`)
- [ ] `.env` file created with Firebase config
- [ ] At least one AI provider API key added
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore enabled (test mode)
- [ ] Sample career added to Firestore
- [ ] Backend running (Terminal 1)
- [ ] Frontend running (Terminal 2)
- [ ] Can access http://localhost:3000
- [ ] Can sign up / login
- [ ] Can generate questions
- [ ] Can complete evaluation
- [ ] Can view scorecard

## Support

If you encounter issues:

1. Check both terminal windows for errors
2. Check browser console (F12 → Console)
3. Verify `.env` file has correct values
4. Ensure Firebase project is set up correctly
5. Verify API key is valid

## Summary

You now have a fully functional skill evaluation platform running on localhost with:

✅ **AI-powered question generation** (ai_only mode)
✅ **Multiple AI provider support** with automatic fallback
✅ **TypeScript** for type safety
✅ **React frontend** with modern UI
✅ **Express backend** with Firebase
✅ **No question bank needed** for localhost
✅ **Rate limiting disabled** for easy testing

**Start evaluating skills locally! 🚀**
