# Fix Old "easy" Level in Database

## The Problem

You have 2 old devtools questions in your database with level = "easy"  
But your new CSV files use level = "Basic"  
They need to match!

## Solution (Choose One)

### Option 1: Update Old Data (Quick Fix)

Run this SQL in Supabase to change "easy" → "Basic":

```sql
-- Update old level names
UPDATE practice_questions SET level = 'Basic' WHERE level = 'easy';
UPDATE practice_questions SET level = 'Intermediate' WHERE level = 'medium';
UPDATE practice_questions SET level = 'Advanced' WHERE level = 'hard';

-- Verify
SELECT level, COUNT(*) FROM practice_questions GROUP BY level;
```

Then upload new questions:
```bash
UPLOAD_VALID_QUESTIONS.bat
```

### Option 2: Delete All and Start Fresh (Recommended)

Run this SQL in Supabase:

```sql
-- Delete all existing questions
DELETE FROM practice_questions;

-- Verify empty
SELECT COUNT(*) FROM practice_questions;
```

Then upload all 9,464 questions:
```bash
UPLOAD_VALID_QUESTIONS.bat
```

## Why This Happened

You previously uploaded questions with level = "easy"  
But your database constraint accepts: "Basic", "Intermediate", "Advanced"  
The old "easy" questions were uploaded before we fixed the level names.

## After Fix

Run this to verify:

```sql
-- Check devtools questions
SELECT level, COUNT(*) as count
FROM practice_questions
WHERE skill = 'Devtools'
GROUP BY level;
```

Should show:
- Basic: 95 (or 97 if you kept the old 2)
- Intermediate: 248
- Advanced: 110

## Files

- `UPDATE_OLD_EASY_TO_BASIC.sql` - Update old data
- `CLEAN_AND_REUPLOAD.sql` - Delete all and start fresh
- `UPLOAD_VALID_QUESTIONS.bat` - Upload script

## Recommendation

Use Option 2 (delete all and re-upload) to ensure clean data with no duplicates or inconsistencies.
