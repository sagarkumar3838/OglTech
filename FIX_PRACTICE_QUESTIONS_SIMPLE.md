# ⚡ Simple Fix: Copy practice_questions to questions

## Problem
- Your questions are in `practice_questions` table
- The app looks in `questions` table
- Result: "No questions available"

## Solution (2 Steps - 3 Minutes)

### Step 1: Copy Questions (1 minute)

1. Go to Supabase: https://ksjgsgebjnpwyycnptom.supabase.co
2. Click "SQL Editor"
3. Copy this SQL:

```sql
-- Copy ALL questions from practice_questions to questions
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  COALESCE(type, 'mcq') as type,
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

4. Paste into SQL Editor
5. Click "Run"

### Step 2: Verify (1 minute)

Run this to check:

```sql
-- Should show all your skills
SELECT skill, COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;
```

### Step 3: Test (1 minute)

1. Go to: https://skillevaluate.web.app/practice
2. Select any skill (Java, Python, etc.)
3. Select "Beginner"
4. Questions should load! 🎉

---

## What This Does

1. ✅ Copies ALL questions from `practice_questions` to `questions`
2. ✅ Fixes skill names (Java → java)
3. ✅ Fixes level names (beginner → easy)
4. ✅ Sets type to 'mcq'
5. ✅ Avoids duplicates

---

## After It Works

You have 2 options:

### Option 1: Keep Both Tables (Recommended)
- Keep `practice_questions` as backup
- App uses `questions` table
- Safe approach

### Option 2: Delete practice_questions (Optional)
Only after verifying everything works:

```sql
-- Backup first
CREATE TABLE practice_questions_backup AS 
SELECT * FROM practice_questions;

-- Then drop
DROP TABLE practice_questions;
```

---

## Troubleshooting

### Issue: "Column doesn't exist"

Your `practice_questions` table might have different column names.

**Check columns:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'practice_questions';
```

**Then modify the INSERT statement** to match your column names.

### Issue: "Duplicate key violation"

Questions already exist in `questions` table.

**Solution:** The script already handles this with `WHERE NOT EXISTS`.

If still issues, run:
```sql
-- Delete existing questions first
TRUNCATE questions;

-- Then run the copy script again
```

---

## Quick Commands

### Check practice_questions
```sql
SELECT skill, COUNT(*) FROM practice_questions GROUP BY skill;
```

### Check questions
```sql
SELECT skill, COUNT(*) FROM questions GROUP BY skill;
```

### Copy everything
```sql
-- Run: COPY_PRACTICE_QUESTIONS_TO_MAIN.sql
```

---

## Summary

**Problem**: Questions in wrong table
**Solution**: Copy to correct table
**Time**: 3 minutes
**Result**: All skills working! 🚀

---

## Files for You

1. **FIX_PRACTICE_QUESTIONS_SIMPLE.md** ← You are here
2. **COPY_PRACTICE_QUESTIONS_TO_MAIN.sql** ← Complete SQL script

---

**Just run the SQL and you're done!** ✨
