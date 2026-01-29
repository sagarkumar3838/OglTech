# Hybrid Question Generation System

## 🎯 Overview

The system uses a **3-tier fallback strategy** to ensure questions are always available:

1. **AI Generation** (Primary) - OpenAI/Groq/DeepSeek generates fresh questions
2. **Supabase Database** (Secondary) - Pre-stored verified questions
3. **Local JSON** (Fallback) - Hardcoded questions in `question-bank.json`

## 📊 How It Works

```
User Request
    ↓
Try AI Generation (if enabled)
    ↓ (if fails)
Fetch from Supabase Database
    ↓ (if empty)
Use Local JSON Questions
    ↓
Return Questions
```

## 🚀 Quick Start

### 1. Run the SQL to seed initial questions

Execute `seed-questions-manual.sql` in Supabase SQL Editor:
https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/sql/new

This adds 42 questions to your database.

### 2. Add more questions to JSON (optional)

Edit `server/src/data/question-bank.json` to add more fallback questions.

### 3. Use the API

```bash
# Generate questions with AI (falls back automatically)
POST /api/questions/generate
{
  "skill": "JavaScript",
  "level": "BASIC",
  "count": 10,
  "useAI": true
}

# Get questions from database only (no AI)
POST /api/questions/generate
{
  "skill": "JavaScript",
  "level": "BASIC",
  "count": 10,
  "useAI": false
}
```

## 📁 File Structure

```
server/src/
├── data/
│   └── question-bank.json          # Local fallback questions
├── services/
│   ├── hybridQuestionService.ts    # Main hybrid service
│   └── aiProviders/
│       └── AIProviderManager.ts    # AI provider management
├── routes/
│   └── questions.ts                # API endpoints
└── config/
    └── supabase.ts                 # Supabase client
```

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# AI Providers (at least one required for AI generation)
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
DEEPSEEK_API_KEY=your_deepseek_key
```

## 📝 Adding Questions to JSON

Edit `server/src/data/question-bank.json`:

```json
{
  "JavaScript": {
    "BASIC": [
      {
        "type": "mcq",
        "question": "What is JavaScript?",
        "options": ["A programming language", "A coffee brand", "A database", "A framework"],
        "correct_answer": "A programming language",
        "explanation": "JavaScript is a programming language used for web development."
      }
    ],
    "INTERMEDIATE": [...],
    "ADVANCED": [...]
  }
}
```

## 🎨 Question Types Supported

1. **MCQ** (Multiple Choice Question)
   ```json
   {
     "type": "mcq",
     "question": "Question text?",
     "options": ["A", "B", "C", "D"],
     "correct_answer": "A",
     "explanation": "Why A is correct"
   }
   ```

2. **Multi-Select** (coming soon)
3. **Coding** (coming soon)
4. **Fill in the Blank** (coming soon)

## 🔄 Question Flow

### Scenario 1: AI Works ✅
```
Request → AI generates → Store in DB → Return to user
```

### Scenario 2: AI Fails, DB Has Questions ⚠️
```
Request → AI fails → Fetch from DB → Return to user
```

### Scenario 3: AI Fails, DB Empty, Use JSON 📄
```
Request → AI fails → DB empty → Use JSON → Return to user
```

## 💾 Database Schema

Questions are stored in Supabase with this structure:

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  question_id TEXT UNIQUE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB,
  explanation TEXT,
  verified BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Skills Covered

The system supports questions for:

1. HTML
2. CSS
3. JavaScript
4. TypeScript
5. React
6. Node.js
7. Python
8. Java
9. Testing Tools
10. Docker
11. Kubernetes
12. Cloud Platforms
13. jQuery
14. OGL Knowledge

Each skill has 3 levels: BASIC, INTERMEDIATE, ADVANCED

## 📊 API Endpoints

### Generate Questions
```
POST /api/questions/generate

Request:
{
  "skill": "JavaScript",
  "level": "BASIC",
  "count": 10,
  "useAI": true
}

Response:
{
  "success": true,
  "data": {
    "skill": "JavaScript",
    "level": "BASIC",
    "count": 10,
    "questions": [...],
    "source": "hybrid"
  }
}
```

### Get Statistics
```
GET /api/questions/stats

Response:
{
  "success": true,
  "data": {
    "total_questions": 42,
    "by_skill": {...},
    "by_level": {...}
  }
}
```

## 🛠️ Maintenance

### Adding New Skills

1. Add questions to `question-bank.json`
2. Run SQL to seed database
3. Update career definitions in Supabase

### Updating Questions

1. Edit in Supabase Table Editor
2. Or update `question-bank.json`
3. Or let AI generate new ones

## 🔐 Security

- Questions table has Row Level Security (RLS)
- Authenticated users can read questions
- Only system can write questions
- API keys are stored securely in environment variables

## 📈 Benefits

✅ **Always Available** - 3-tier fallback ensures questions are never missing
✅ **Cost Effective** - Uses AI only when needed, falls back to free storage
✅ **Scalable** - Can add unlimited questions to database
✅ **Flexible** - Easy to add new skills and levels
✅ **Fast** - Database and JSON are instant, no API delays

## 🚨 Troubleshooting

### AI Generation Fails
- Check API keys in `.env`
- Verify API quota/billing
- System automatically falls back to database

### Database Empty
- Run `seed-questions-manual.sql`
- Or add questions via Supabase Table Editor
- System automatically falls back to JSON

### JSON Questions Missing
- Edit `server/src/data/question-bank.json`
- Add questions for your skills/levels
- Rebuild the server

## 📞 Next Steps

1. ✅ Run SQL to seed database (42 questions)
2. ✅ Test API endpoints
3. ✅ Add more questions to JSON if needed
4. ✅ Configure AI providers
5. ✅ Deploy and test

---

**Your questions will ALWAYS be available, no matter what!** 🎉
