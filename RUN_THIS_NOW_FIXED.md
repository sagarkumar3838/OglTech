# ✅ FIX PRACTICE PAGE - CORRECTED VERSION

## Problem
Your questions are in `practice_questions` table, but the Practice page looks in `questions` table.

## Solution (2 minutes) - FIXED VERSION

### Step 1: Open Supabase SQL Editor
1. Go to: https://ksjgsgebjnpwyycnptom.supabase.co
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

### Step 2: Copy & Run This SQL (CORRECTED)

```sql
-- Copy ALL questions from practice_questions to questions table
INSERT INTO questions (
  skill, 
  level, 
  type, 
  question, 
  options, 
  correct_answer, 
  explanation, 
  topic
)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,  -- Fixed: Always set to 'mcq'
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = practice_questions.question
);
```

**What was fixed**: Changed `COALESCE(NULLIF(type, ''), 'mcq')` to just `'mcq'` because your `practice_questions` table doesn't have a `type` column.

### Step 3: Verify It Worked

Run this to see all your skills:

```sql
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

You should see ALL your skills (Java, Python, HTML, CSS, OpenGL, etc.) with question counts.

### Step 4: Test in App

1. Go to: https://skillevaluate.web.app/practice
2. Select any skill (Java, Python, etc.)
3. Select "Beginner" level
4. Questions should load! 🎉

## What This Does

- Copies ALL questions from `practice_questions` → `questions`
- Fixes skill names (Java → java, Python → python)
- Fixes level names (beginner → easy, intermediate → medium, advanced → hard)
- Sets type to 'mcq' for all questions (doesn't try to read from practice_questions)
- Avoids duplicates

## Expected Result

After running, you'll have:
- All skills visible in Practice page
- All difficulty levels working
- Questions loading properly

## Troubleshooting

### If you see "No questions available"

Check if questions were copied:
```sql
SELECT COUNT(*) FROM questions;
```

If count is 0, check if `practice_questions` table has data:
```sql
SELECT COUNT(*) FROM practice_questions;
```

### If some skills work but others don't

Check which skills are in each table:
```sql
-- See what's in practice_questions
SELECT DISTINCT skill FROM practice_questions ORDER BY skill;

-- See what's in questions
SELECT DISTINCT skill FROM questions ORDER BY skill;
```

## Alternative Files

If you want more details:
- `COPY_QUESTIONS_SIMPLE_FIX.sql` - Simple version with checks
- `FIX_PRACTICE_QUESTIONS_WORKING.sql` - Version with diagnostics
- `COPY_PRACTICE_QUESTIONS_TO_MAIN.sql` - Full version (now corrected)

## Summary

1. Open Supabase SQL Editor
2. Copy the SQL from Step 2 above
3. Click "Run" (or Ctrl+Enter)
4. Test in Practice page
5. Done! ✅

Time: 2 minutes
Result: All skills working! 🚀
