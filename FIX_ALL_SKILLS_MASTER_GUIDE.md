# 🎯 Master Guide: Fix ALL Skills in Practice Page

## Problem
You have questions for many skills (Java, Python, HTML, CSS, etc.) but they're not showing in the Practice page.

## Root Causes

### Cause 1: Questions in Separate Tables
Questions might be stored in separate tables like:
- `java_questions`
- `python_questions`
- `html_questions`
- etc.

**Solution**: Copy all questions to the main `questions` table.

### Cause 2: Wrong Format
Questions might have:
- Wrong skill names (e.g., "Java" instead of "java")
- Wrong level names (e.g., "beginner" instead of "easy")
- Wrong type (e.g., missing or not "mcq")

**Solution**: Normalize all question formats.

### Cause 3: Questions Not Uploaded
CSV files exist but haven't been uploaded to Supabase.

**Solution**: Upload all CSV files at once.

---

## Complete Solution (3 Steps)

### Step 1: Check Current State (2 minutes)

Run this in Supabase SQL Editor:

```sql
-- See what skills are currently available
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

**What to look for:**
- ✅ If you see many skills with questions → Go to Step 2
- ❌ If you see few or no skills → Go to Step 3 first

---

### Step 2: Fix Format of Existing Questions (1 minute)

Run this in Supabase SQL Editor:

```sql
-- Copy from: FIX_ALL_SKILLS_COMPLETE.sql
-- Or run these commands:

-- Fix skill names
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')));

-- Fix level names
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  ELSE LOWER(level)
END;

-- Fix type
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL OR type != 'mcq';

-- Verify
SELECT skill, level, type, COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;
```

---

### Step 3: Upload Missing Skills (5-10 minutes)

#### Option A: Upload from CSV Files (Recommended)

1. **Check if CSV files exist:**
   ```bash
   dir questions\*.csv
   ```

2. **If you have CSV files, upload them:**
   ```bash
   UPLOAD_ALL_SKILLS.bat
   ```
   
   Or manually:
   ```bash
   npx tsx scripts/upload-all-questions.ts
   ```

3. **Wait for upload to complete** (may take a few minutes)

4. **Verify in Supabase:**
   ```sql
   SELECT skill, COUNT(*) as count
   FROM questions
   GROUP BY skill
   ORDER BY skill;
   ```

#### Option B: Copy from Separate Tables

1. **Find separate tables:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name ILIKE '%question%'
   ORDER BY table_name;
   ```

2. **For each separate table, copy to main table:**
   ```sql
   -- Example for java_questions table
   INSERT INTO questions (
     skill, level, type, question, options, 
     correct_answer, explanation, topic
   )
   SELECT 
     'java' as skill,
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
   FROM java_questions
   WHERE NOT EXISTS (
     SELECT 1 FROM questions q 
     WHERE q.question = java_questions.question
   );
   ```

3. **Repeat for each skill table**

---

## Quick Fix Script (All-in-One)

### Script 1: Diagnose Everything

```sql
-- Run this in Supabase SQL Editor

-- 1. Check main questions table
SELECT 'Main Table' as source, skill, COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;

-- 2. Find separate tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND (table_name ILIKE '%question%' OR table_name ILIKE '%practice%')
ORDER BY table_name;

-- 3. Check for format issues
SELECT 
  'Format Issues' as check_type,
  COUNT(*) FILTER (WHERE skill != LOWER(TRIM(REPLACE(skill, ' ', '')))) as wrong_skill_format,
  COUNT(*) FILTER (WHERE level NOT IN ('easy', 'medium', 'hard')) as wrong_level_format,
  COUNT(*) FILTER (WHERE type IS NULL OR type != 'mcq') as wrong_type_format
FROM questions;
```

### Script 2: Fix Everything

```sql
-- Run this in Supabase SQL Editor
-- Copy entire content from: FIX_ALL_SKILLS_COMPLETE.sql
```

---

## Verification Checklist

After running the fixes, verify:

### ✅ Database Check

```sql
-- Should show all skills with questions
SELECT 
  skill,
  COUNT(DISTINCT level) as levels,
  COUNT(*) as total_questions
FROM questions
GROUP BY skill
ORDER BY skill;
```

Expected: 40+ skills with 3 levels each (easy, medium, hard)

### ✅ Format Check

```sql
-- Should return 0 for all
SELECT 
  COUNT(*) FILTER (WHERE skill != LOWER(skill)) as uppercase_skills,
  COUNT(*) FILTER (WHERE level NOT IN ('easy', 'medium', 'hard')) as wrong_levels,
  COUNT(*) FILTER (WHERE type != 'mcq') as wrong_types
FROM questions;
```

Expected: All counts should be 0

### ✅ Sample Check

```sql
-- Should show properly formatted questions
SELECT skill, level, type, question
FROM questions
WHERE skill IN ('java', 'python', 'javascript')
LIMIT 10;
```

Expected: All skills lowercase, levels as easy/medium/hard, type as mcq

### ✅ Application Check

1. Go to: https://skillevaluate.web.app/practice
2. Open skill dropdown
3. Should see all skills listed
4. Select any skill (e.g., Java)
5. Select any level (e.g., Beginner)
6. Questions should load

---

## Expected Skills List

After fixing, you should have questions for:

### Web Development (7)
- html, css, javascript, typescript, react, angular, vue

### Backend (8)
- java, python, nodejs, csharp, php, ruby, go, rust

### Database (5)
- sql, oracle, postgresql, mongodb, redis

### Mobile (4)
- kotlin, swift, flutter, reactnative

### DevOps & Cloud (8)
- docker, kubernetes, linux, aws, azure, gcp, terraform, ansible

### Graphics & Game Dev (5)
- opengl, glsl, cpp, unity, unreal

### DevTools (4)
- devtools, webpack, git, vscode

### Testing (3)
- selenium, jest, cypress

**Total: 44 skills**

---

## Troubleshooting

### Issue 1: "No questions available" for specific skill

**Check if questions exist:**
```sql
SELECT COUNT(*) FROM questions WHERE skill = 'java' AND level = 'easy';
```

**If count = 0:**
- Upload CSV file: `questions/java-beginner.csv`
- Or copy from separate table

**If count > 0:**
- Check format: `SELECT * FROM questions WHERE skill = 'java' LIMIT 1;`
- Run format fix: `FIX_ALL_SKILLS_COMPLETE.sql`

### Issue 2: Some skills work, others don't

**Find which skills are missing:**
```sql
-- Run this to see missing skills
SELECT skill, COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;
```

**Upload missing skills:**
```bash
# Check which CSV files you have
dir questions\*.csv

# Upload all at once
npx tsx scripts/upload-all-questions.ts
```

### Issue 3: Questions exist but wrong format

**Fix format:**
```sql
-- Run FIX_ALL_SKILLS_COMPLETE.sql
-- Or run these quick fixes:

UPDATE questions SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')));
UPDATE questions SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  ELSE LOWER(level)
END;
UPDATE questions SET type = 'mcq';
```

---

## Files Created for You

1. **FIX_ALL_SKILLS_COMPLETE.sql** - Complete SQL fix for all skills
2. **UPLOAD_ALL_SKILLS.bat** - Upload all CSV files at once
3. **FIX_ALL_SKILLS_MASTER_GUIDE.md** - This guide
4. **FIND_JAVA_TABLE.sql** - Find separate tables
5. **COPY_JAVA_QUESTIONS.sql** - Copy from separate tables

---

## Quick Commands

### Check Status
```sql
SELECT skill, COUNT(*) FROM questions GROUP BY skill ORDER BY skill;
```

### Fix Format
```bash
# Run in Supabase SQL Editor
FIX_ALL_SKILLS_COMPLETE.sql
```

### Upload All
```bash
UPLOAD_ALL_SKILLS.bat
```

### Verify
```sql
SELECT skill, level, type, COUNT(*) 
FROM questions 
GROUP BY skill, level, type 
ORDER BY skill, level;
```

---

## Summary

### To fix ALL skills at once:

1. **Run** `FIX_ALL_SKILLS_COMPLETE.sql` in Supabase (fixes format)
2. **Run** `UPLOAD_ALL_SKILLS.bat` (uploads missing questions)
3. **Verify** in Practice page (test a few skills)

**Time Required**: 10-15 minutes
**Difficulty**: Easy (mostly copy-paste)
**Result**: All 44 skills working in Practice page

---

## Need Help?

If you're still stuck:

1. Run diagnostic script (Script 1 above)
2. Share the output
3. I'll give you exact commands to fix your specific issue

---

**Let's get all your skills working! 🚀**
