# Quick Start Guide

Get your Skill Evaluation Platform running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account
- At least one AI provider API key (OpenAI, Anthropic, Google, Groq, or X.AI)

## Step 1: Install Dependencies (2 min)

```bash
npm run install:all
```

## Step 2: Create `.env` File (3 min)

Copy `.env.example` to `.env` and fill in your values:

```env
# Firebase (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# API URL (for local development)
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api

# At least ONE AI provider (recommended: Anthropic or OpenAI)
ANTHROPIC_API_KEY=sk-ant-your-key-here
# OR
OPENAI_API_KEY=sk-your-key-here

# RAG Configuration (recommended defaults)
RAG_ENABLED=true
RAG_STRATEGY=hybrid
RAG_QUESTION_BANK_PERCENTAGE=40

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=10
```

## Step 3: Firebase Setup (2 min)

```bash
# Login to Firebase
firebase login

# Update .firebaserc with your project ID
# Edit .firebaserc and replace "your-project-id"

# Deploy Firestore rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 4: Seed Question Bank (1 min)

```bash
npx tsx scripts/seed-question-bank.ts
```

This adds 12 high-quality sample questions.

## Step 5: Add Sample Career (1 min)

Go to Firebase Console > Firestore > Add Collection:

```
Collection: careers
Document ID: (auto)
Fields:
  name: "OGL Content Developer"
  description: "Frontend developer specializing in web content"
  skills: [
    { name: "HTML", level: "Intermediate" },
    { name: "CSS", level: "Intermediate" },
    { name: "JavaScript", level: "Intermediate" }
  ]
  created_at: "2026-01-20T00:00:00.000Z"
```

## Step 6: Run Locally (1 min)

Open two terminals:

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Step 7: Test the App!

1. Open http://localhost:3000
2. Click "Sign Up" and create an account
3. Go to "Careers"
4. Click "OGL Content Developer"
5. Select "HTML" > "Intermediate"
6. Complete the evaluation
7. View your scorecard!

## What Just Happened?

✅ **RAG System**: 40% questions from question bank, 60% AI-generated
✅ **AI Fallback**: If one provider fails, automatically tries the next
✅ **Rate Limiting**: Prevents abuse (10 requests per 15 minutes)
✅ **Quality Control**: Questions validated before use
✅ **TypeScript**: Full type safety throughout

## Next Steps

### Add More AI Providers

Add more API keys to `.env` for better reliability:

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
GROQ_API_KEY=gsk_...
XAI_API_KEY=xai-...
```

### Customize Question Bank

Add your own questions:

```bash
POST /api/admin/question-bank/add
{
  "question_id": "uuid",
  "skill_area": "JavaScript",
  "level": "INTERMEDIATE",
  "type": "mcq",
  "question": "Your question here?",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "A",
  "expected_skills": ["skill1", "skill2"],
  "difficulty_weight": 7
}
```

### Deploy to Production

```bash
# Build everything
npm run build:client
npm run build:server

# Deploy to Firebase
npm run deploy
```

Update `.env` with production API URL:
```env
VITE_API_URL=https://us-central1-your-project.cloudfunctions.net/api
```

Rebuild and redeploy:
```bash
npm run build:client
firebase deploy --only hosting
```

## Troubleshooting

### "No AI providers configured"
- Add at least one API key to `.env`
- Restart dev server

### "Question bank empty"
- Run: `npx tsx scripts/seed-question-bank.ts`

### "Firebase permission denied"
- Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Rate limit errors
- Increase `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Or disable: `RATE_LIMIT_ENABLED=false`

## Configuration Options

### RAG Strategies

**Hybrid (Recommended)**
```env
RAG_STRATEGY=hybrid
RAG_QUESTION_BANK_PERCENTAGE=40
```
Mix of question bank + AI. Best balance.

**RAG Only**
```env
RAG_STRATEGY=rag_only
```
Only use question bank. Zero AI costs, instant responses.

**AI Only**
```env
RAG_STRATEGY=ai_only
```
Only use AI. Maximum variety, higher costs.

### AI Provider Priority

```env
AI_PROVIDER_PRIORITY=anthropic,openai,google,groq,xai
```

System tries providers in this order.

## Key Features

🤖 **5 AI Providers**: OpenAI, Anthropic, Google, Groq, X.AI
📚 **RAG System**: Question bank + AI generation
🔒 **Rate Limiting**: Prevent abuse
✅ **Quality Control**: Automatic validation
📊 **Detailed Scorecards**: AI-powered analysis
🎯 **TypeScript**: Full type safety
🚀 **Production Ready**: Scalable architecture

## Documentation

- **README.md** - Overview and features
- **SETUP_GUIDE.md** - Detailed setup instructions
- **RAG_GUIDE.md** - RAG system documentation
- **FEATURES.md** - Complete feature list
- **DEPLOYMENT.md** - Production deployment guide

## Support

Check logs:
```bash
# Backend logs
firebase functions:log

# Browser console
Open DevTools > Console
```

## Success! 🎉

Your platform is now running with:
- Multiple AI providers with automatic fallback
- RAG system for quality and cost optimization
- Rate limiting for security
- TypeScript for reliability
- Production-ready architecture

Start evaluating skills!
