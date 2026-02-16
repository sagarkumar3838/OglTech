# 🔍 Diagnose and Fix Missing Questions

## Quick Diagnosis

### Step 1: Check Supabase Database

Go to Supabase SQL Editor and run:

```sql
-- Check if OpenGL questions exist
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill ILIKE '%opengl%'
GROUP BY skill, level, type;
```

**Expected Result:**
```
skill   | level | type | count
--------|-------|------|------
opengl  | easy  | mcq  | 10+
opengl  | medium| mcq  | 10+
opengl  | hard  | mcq  | 10+
```

**If you see NO results** → Questions don't exist, go to Step 2
**If you see different format** → Questions exist but wrong format, go to Step 3

---

### Step 2: Upload Questions (If They Don't Exist)

#### Option A: Check if CSV files exist

```bash
dir questions\opengl-beginner.csv
dir questions\opengl-intermediate.csv
dir questions\opengl-advanced.csv
```

**If files exist:**
```bash
# Run the upload script
UPLOAD_OPENGL_QUESTIONS.bat
```

**If files DON'T exist:**
You need to create them first. See `ADD_MORE_QUESTIONS_GUIDE.md`

---

### Step 3: Fix Question Format (If They Exist But Wrong Format)

Run this SQL in Supabase:

```sql
-- Fix all questions at once
-- Run: FIX_ALL_QUESTIONS_FORMAT.sql
```

Or manually fix OpenGL questions:

```sql
-- 1. Fix skill name (lowercase, no spaces)
UPDATE questions
SET skill = 'opengl'
WHERE skill ILIKE 'opengl' OR skill ILIKE 'open gl';

-- 2. Fix level names
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  ELSE level
END
WHERE skill = 'opengl';

-- 3. Fix type
UPDATE questions
SET type = 'mcq'
WHERE skill = 'opengl' AND (type IS NULL OR type != 'mcq');

-- 4. Verify
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'opengl'
GROUP BY skill, level, type;
```

---

## Common Issues & Solutions

### Issue 1: "No questions available for this combination"

**Cause**: Questions don't exist or wrong format

**Solution**:
1. Run `check-opengl-questions.sql` in Supabase
2. If no results, upload questions
3. If wrong format, run `FIX_ALL_QUESTIONS_FORMAT.sql`

---

### Issue 2: Questions exist but still not showing

**Cause**: RLS (Row Level Security) policies blocking access

**Solution**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'questions';

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Or fix the policy
DROP POLICY IF EXISTS "Allow authenticated users to read questions" ON questions;

CREATE POLICY "Allow authenticated users to read questions"
ON questions FOR SELECT
TO authenticated
USING (true);

-- Re-enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
```

---

### Issue 3: Wrong skill name in dropdown

**Cause**: Practice page uses lowercase skill names

**Solution**: The Practice page expects:
- `opengl` (not "OpenGL" or "Open GL")
- `javascript` (not "JavaScript" or "Java Script")
- `nodejs` (not "Node.js" or "NodeJS")

Update your database:
```sql
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')))
WHERE skill != LOWER(TRIM(REPLACE(skill, ' ', '')));
```

---

### Issue 4: Wrong level mapping

**Cause**: Practice page maps levels differently

**Mapping**:
- Practice "Beginner" → Database "easy"
- Practice "Intermediate" → Database "medium"
- Practice "Advanced" → Database "hard"

**Solution**:
```sql
UPDATE questions
SET level = CASE
  WHEN level = 'beginner' THEN 'easy'
  WHEN level = 'intermediate' THEN 'medium'
  WHEN level = 'advanced' THEN 'hard'
  ELSE level
END;
```

---

## Verification Checklist

After fixing, verify:

- [ ] Questions exist in database
  ```sql
  SELECT COUNT(*) FROM questions WHERE skill = 'opengl' AND level = 'easy';
  ```
  Should return > 0

- [ ] Skill name is lowercase without spaces
  ```sql
  SELECT DISTINCT skill FROM questions WHERE skill LIKE '%opengl%';
  ```
  Should return: `opengl`

- [ ] Level is easy/medium/hard
  ```sql
  SELECT DISTINCT level FROM questions WHERE skill = 'opengl';
  ```
  Should return: `easy`, `medium`, `hard`

- [ ] Type is 'mcq'
  ```sql
  SELECT DISTINCT type FROM questions WHERE skill = 'opengl';
  ```
  Should return: `mcq`

- [ ] Options format is valid
  ```sql
  SELECT jsonb_typeof(options) FROM questions WHERE skill = 'opengl' LIMIT 1;
  ```
  Should return: `array` or `object`

- [ ] RLS policies allow reading
  ```sql
  SELECT * FROM questions WHERE skill = 'opengl' LIMIT 1;
  ```
  Should return a question (not permission denied)

---

## Test in Application

1. Open: https://skillevaluate.web.app/practice
2. Select "OpenGL" from dropdown
3. Select "Beginner" level
4. Questions should load

**If still not working:**
- Open browser console (F12)
- Check for errors
- Look for failed API calls
- Check authentication status

---

## Quick Fix Commands

### Run All Fixes at Once

```bash
# 1. Check what's in database
psql -f check-opengl-questions.sql

# 2. Fix all questions format
psql -f FIX_ALL_QUESTIONS_FORMAT.sql

# 3. Upload new questions (if needed)
UPLOAD_OPENGL_QUESTIONS.bat
```

### Or use Supabase SQL Editor

1. Go to: https://ksjgsgebjnpwyycnptom.supabase.co
2. Click "SQL Editor"
3. Paste and run: `FIX_ALL_QUESTIONS_FORMAT.sql`
4. Verify with: `check-opengl-questions.sql`

---

## Need More Help?

Check these files:
- `FIX_OPENGL_QUESTIONS.md` - Detailed OpenGL fix guide
- `ADD_MORE_QUESTIONS_GUIDE.md` - How to add new questions
- `UPLOAD_JSON_QUESTIONS_GUIDE.md` - Upload questions from JSON/CSV

---

## Summary

**Most Common Fix:**
```sql
-- Run this in Supabase SQL Editor
UPDATE questions
SET 
  skill = LOWER(TRIM(REPLACE(skill, ' ', ''))),
  level = CASE
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END,
  type = COALESCE(NULLIF(type, ''), 'mcq')
WHERE skill ILIKE '%opengl%';

-- Verify
SELECT skill, level, type, COUNT(*) 
FROM questions 
WHERE skill = 'opengl' 
GROUP BY skill, level, type;
```

This should fix 90% of issues! 🎉
