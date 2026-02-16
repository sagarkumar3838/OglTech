# Fix OpenGL Questions Not Showing

## Problem
OpenGL Beginner questions are not showing in the Practice page.

## Root Cause
The Practice page looks for questions with:
- `skill = 'opengl'` (lowercase, no spaces)
- `level = 'easy'` (Practice "beginner" maps to database "easy")
- `type = 'mcq'`

## Diagnosis Steps

### Step 1: Check if questions exist
Run this SQL in Supabase:

```sql
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill ILIKE '%opengl%'
GROUP BY skill, level, type;
```

### Step 2: Check the exact format
```sql
SELECT skill, level, type, question
FROM questions
WHERE skill ILIKE '%opengl%'
LIMIT 5;
```

## Possible Issues & Solutions

### Issue 1: Questions don't exist
**Solution**: Upload OpenGL questions from CSV

```bash
# Check if CSV file exists
dir questions\opengl-beginner.csv

# If it exists, upload it using the upload script
npx tsx scripts/upload-all-questions.ts
```

### Issue 2: Wrong skill name format
**Problem**: Questions might be stored as "OpenGL" (capital) or "open gl" (with space)

**Solution**: Update skill names to lowercase without spaces

```sql
-- Fix skill names
UPDATE questions
SET skill = 'opengl'
WHERE skill ILIKE 'opengl' OR skill ILIKE 'open gl';
```

### Issue 3: Wrong level format
**Problem**: Questions might be stored as "beginner" instead of "easy"

**Solution**: Update level names

```sql
-- Fix level names
UPDATE questions
SET level = 'easy'
WHERE level = 'beginner' AND skill = 'opengl';

UPDATE questions
SET level = 'medium'
WHERE level = 'intermediate' AND skill = 'opengl';

UPDATE questions
SET level = 'hard'
WHERE level = 'advanced' AND skill = 'opengl';
```

### Issue 4: Wrong question type
**Problem**: Questions might be stored as something other than 'mcq'

**Solution**: Update question types

```sql
-- Fix question types
UPDATE questions
SET type = 'mcq'
WHERE skill = 'opengl' AND type IS NULL;
```

### Issue 5: Options format issue
**Problem**: MCQ questions need proper options format

**Solution**: Check and fix options format

```sql
-- Check options format
SELECT id, skill, level, type, 
       jsonb_typeof(options) as options_type,
       options
FROM questions
WHERE skill = 'opengl'
LIMIT 5;

-- Options should be either:
-- 1. Array: ["Option A", "Option B", "Option C", "Option D"]
-- 2. Object: {"a": "Option A", "b": "Option B", "c": "Option C", "d": "Option D"}
```

## Quick Fix Script

Run this in Supabase SQL Editor:

```sql
-- 1. Normalize skill names
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')))
WHERE skill ILIKE '%opengl%';

-- 2. Normalize level names
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  ELSE level
END
WHERE skill = 'opengl';

-- 3. Set type to mcq if not set
UPDATE questions
SET type = 'mcq'
WHERE skill = 'opengl' AND (type IS NULL OR type = '');

-- 4. Verify the fix
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'opengl'
GROUP BY skill, level, type;
```

## Verification

After fixing, verify questions appear:

```sql
-- Should return questions
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'opengl' AND level = 'easy' AND type = 'mcq'
GROUP BY skill, level, type;
```

Expected result:
```
skill   | level | type | count
--------|-------|------|------
opengl  | easy  | mcq  | 10+
```

## Upload New Questions (If Needed)

If no questions exist, upload from CSV:

1. Check CSV file exists: `questions/opengl-beginner.csv`
2. Verify CSV format:
   ```csv
   skill,level,type,question,options,correct_answer,explanation,topic
   opengl,easy,mcq,"What is OpenGL?","[""A graphics library"",""A database"",""A web framework"",""An OS""]",0,"OpenGL is a graphics library","Basics"
   ```
3. Upload using script:
   ```bash
   npx tsx scripts/upload-all-questions.ts
   ```

## Test in Application

1. Go to Practice page: https://skillevaluate.web.app/practice
2. Select "OpenGL" from dropdown
3. Select "Beginner" level
4. Questions should load

## Common Mistakes to Avoid

1. ❌ Don't use capital letters in skill names (use "opengl" not "OpenGL")
2. ❌ Don't use spaces in skill names (use "opengl" not "open gl")
3. ❌ Don't use "beginner/intermediate/advanced" (use "easy/medium/hard")
4. ❌ Don't forget to set type = 'mcq'
5. ❌ Don't use invalid JSON for options field

## Need Help?

If questions still don't show:
1. Check browser console for errors (F12)
2. Check Supabase logs for query errors
3. Verify RLS policies allow reading questions
4. Check if user is authenticated
