# Diagnose Upload Issue

## Quick Answer

**"java-beginner.csv: 0 questions"** means the upload failed, most likely due to duplicate questions already in the database.

## Check Current Database State

Run this SQL in Supabase SQL Editor:

```sql
-- How many Java Basic questions are currently in database?
SELECT COUNT(*) as current_count 
FROM practice_questions 
WHERE skill = 'Java' AND level = 'Basic';

-- Show the first 3 questions
SELECT id, LEFT(question_text, 50) as question_preview, correct_answer
FROM practice_questions 
WHERE skill = 'Java' AND level = 'Basic'
LIMIT 3;
```

## Expected Results

If you see **10 questions**, that's from your earlier SQL upload (`UPLOAD_JAVA_BEGINNER_CORRECT.sql`).

The upload script failed because it tried to insert duplicates.

## Fix It Now

**Run this batch file:**
```
UPLOAD_JAVA_BEGINNER_FRESH.bat
```

This will:
1. Delete the 10 old questions
2. Upload all 102 questions from CSV
3. Show you the results

## Verify Success

After running the batch file, check again:

```sql
SELECT COUNT(*) FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
```

Should show: **102 questions** ✅

## Why This Happened

1. You first uploaded 10 questions via SQL
2. Then tried to upload all 102 via script
3. Script hit duplicate key errors on first 10 questions
4. Script reported "0 questions" because none were successfully inserted

## The Solution

The `upload-java-beginner-fresh.ts` script:
- Deletes existing Java Basic questions FIRST
- Then uploads all 102 questions fresh
- No duplicates = no errors = success!
