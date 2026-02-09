# Practice Questions Database Setup Guide

## Overview
This guide will help you create a new "Practice Questions" database in Supabase and upload all your questions (beginner, intermediate, and advanced levels) from CSV files.

## 📋 What You Have
- **120+ CSV files** in the `questions/` folder
- Questions covering **40+ skills** (HTML, CSS, JavaScript, Python, React, etc.)
- **3 difficulty levels** for each skill: beginner, intermediate, advanced
- Estimated **3000+ questions** ready to upload

## 🚀 Quick Start (3 Steps)

### Step 1: Create the Database Table in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `create-practice-questions-database.sql`
4. Click **Run** to execute

This creates:
- ✅ `practice_questions` table with proper schema
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates
- ✅ Statistics view

### Step 2: Verify Your Environment

Make sure your `.env` file has these variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Upload All Questions

Simply run:
```bash
UPLOAD_ALL_PRACTICE_QUESTIONS.bat
```

This will:
1. Install required dependencies
2. Process all CSV files in the `questions/` folder
3. Upload questions in batches of 100
4. Show progress for each file
5. Display a summary when complete

## 📊 Database Schema

```sql
practice_questions (
    id                UUID PRIMARY KEY
    skill             TEXT NOT NULL
    level             TEXT NOT NULL (beginner/intermediate/advanced)
    type              TEXT NOT NULL (mcq/fillblank/code/truefalse)
    question          TEXT NOT NULL
    option_a          TEXT
    option_b          TEXT
    option_c          TEXT
    option_d          TEXT
    correct_answer    TEXT NOT NULL
    explanation       TEXT
    topic             TEXT
    subtopic          TEXT
    difficulty_score  INTEGER (1-10)
    points            INTEGER (default: 10)
    time_limit        INTEGER (default: 60 seconds)
    tags              TEXT[]
    created_at        TIMESTAMP
    updated_at        TIMESTAMP
    is_active         BOOLEAN (default: TRUE)
)
```

## 🎯 Features

### 1. Three Difficulty Levels
- **Beginner**: Fundamental concepts, basic syntax
- **Intermediate**: Practical applications, common patterns
- **Advanced**: Complex scenarios, optimization, best practices

### 2. Multiple Question Types
- **MCQ**: Multiple choice questions (most common)
- **Fill Blank**: Code completion questions
- **Code**: Full code writing questions
- **True/False**: Quick concept checks

### 3. Smart Indexing
Fast queries by:
- Skill (e.g., "JavaScript")
- Level (e.g., "intermediate")
- Skill + Level combination
- Tags for topic filtering

### 4. Security
- Public read access for active questions
- Authenticated users can read all questions
- Service role has full access for management

## 📁 Your Question Files

All files in `questions/` folder follow this pattern:
```
{skill}-{level}.csv

Examples:
- javascript-beginner.csv
- python-intermediate.csv
- react-advanced.csv
```

### Skills Included (40+)
- **Frontend**: HTML, CSS, JavaScript, TypeScript, React, Vue, Angular
- **Backend**: Node.js, Python, Java, PHP, C#, Go, Ruby, Rust
- **Mobile**: React Native, Flutter, Swift, Kotlin
- **Database**: SQL, PostgreSQL, MongoDB, Oracle, Redis
- **DevOps**: Docker, Kubernetes, AWS, Azure, GCP, Terraform, Ansible
- **Tools**: Git, Linux, VSCode, Webpack, Jest, Cypress, Selenium
- **Graphics**: OpenGL, GLSL, Unity, Unreal

## 🔍 Verify Upload

After uploading, run this SQL query in Supabase:

```sql
-- Check total questions
SELECT COUNT(*) as total_questions FROM practice_questions;

-- Check by skill and level
SELECT 
    skill,
    level,
    COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check question types
SELECT 
    type,
    COUNT(*) as count
FROM practice_questions
GROUP BY type;
```

## 🛠️ Manual Upload (Alternative Method)

If the batch script doesn't work, you can upload manually:

1. **Using Supabase Dashboard**:
   - Go to Table Editor → practice_questions
   - Click "Insert" → "Import data from CSV"
   - Select a CSV file
   - Map columns
   - Import

2. **Using SQL**:
   ```sql
   COPY practice_questions(skill, level, type, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
   FROM '/path/to/your/file.csv'
   DELIMITER ','
   CSV HEADER;
   ```

## 📝 Query Examples

### Get random questions for practice
```sql
SELECT * FROM practice_questions
WHERE skill = 'JavaScript' 
  AND level = 'intermediate'
  AND is_active = TRUE
ORDER BY RANDOM()
LIMIT 10;
```

### Get questions by topic
```sql
SELECT * FROM practice_questions
WHERE skill = 'React'
  AND topic = 'Hooks'
  AND level = 'advanced';
```

### Get statistics
```sql
SELECT * FROM practice_questions_stats
WHERE skill = 'Python';
```

## 🔧 Troubleshooting

### Issue: "Table already exists"
**Solution**: The script handles this automatically. If you want a fresh start, uncomment the DROP TABLE line in the SQL file.

### Issue: "Permission denied"
**Solution**: Make sure you're using the service role key for uploads, not the anon key.

### Issue: "CSV parsing error"
**Solution**: Check that your CSV files have proper headers and no special characters.

### Issue: Upload is slow
**Solution**: The script uploads in batches of 100 with small delays to avoid rate limiting. This is normal for large datasets.

## 📈 Next Steps

After uploading:

1. **Test queries** in Supabase SQL Editor
2. **Update your frontend** to use `practice_questions` table
3. **Create practice sessions** with random question selection
4. **Track user progress** by creating a separate `user_practice_progress` table
5. **Add more questions** by adding new CSV files and re-running the upload

## 🎓 Best Practices

1. **Keep questions unique**: Avoid duplicates across files
2. **Write clear explanations**: Help users learn from mistakes
3. **Balance difficulty**: Mix easy and ha