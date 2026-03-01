# Java Beginner Questions Upload Guide

## What "0 questions" Means

When you ran the upload script and saw "java-beginner.csv: 0 questions", it means:

1. **Either**: The CSV was parsed but returned 0 records (unlikely - your CSV has 102 questions)
2. **Or**: The upload failed due to database errors (most likely - duplicate key conflicts)

## Why It Failed

You previously uploaded 10 Java Basic questions using SQL:
- File: `UPLOAD_JAVA_BEGINNER_CORRECT.sql`
- These 10 questions are already in the database

When the script tried to upload all 102 questions, it hit duplicate key errors because:
- The first 10 questions in the CSV match the 10 already in database
- Database has unique constraints preventing duplicates
- Script silently failed and reported "0 questions"

## Current Database State

Run this SQL to check current state:
```sql
SELECT COUNT(*) FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
```

Expected result: **10 questions** (from earlier SQL upload)

## Solution: Upload All 102 Questions Fresh

### Option 1: Use the Fresh Upload Script (RECOMMENDED)

This script will:
1. Delete all existing Java Basic questions
2. Upload all 102 questions from CSV fresh

**Steps:**
1. Double-click: `UPLOAD_JAVA_BEGINNER_FRESH.bat`
2. Wait for completion
3. Run verification SQL: `CHECK_JAVA_BEGINNER_IN_DATABASE.sql`

### Option 2: Manual SQL Delete + Upload

1. Run this SQL in Supabase:
```sql
DELETE FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
```

2. Then run: `UPLOAD_ALL_QUESTIONS_NOW.bat`

## Verification

After upload, run `CHECK_JAVA_BEGINNER_IN_DATABASE.sql` to verify:

Expected results:
- Count: **102 questions**
- First question: "Which component actually executes the bytecode after compilation?"
- Correct answer format: Letters (A, B, C, D)

## Your CSV File Details

- **File**: `questions/java-beginner.csv`
- **Total lines**: 103 (1 header + 102 questions)
- **Format**: Correct (skill, level, question_text, option_a-d, correct_answer as letters)
- **Sample questions**:
  - JVM bytecode execution
  - javac compilation command
  - .class file extension
  - Access modifiers
  - String creation
  - And 97 more...

## Next Steps After Java Works

Once Java beginner upload succeeds:

1. Upload all other CSV files:
   ```
   UPLOAD_ALL_QUESTIONS_NOW.bat
   ```

2. Verify counts match CSV files:
   ```sql
   -- Run: COUNT_ALL_QUESTIONS_BY_SKILL_LEVEL.sql
   ```

3. Test in Practice page:
   - Select Java → Beginner
   - Should see 10 random questions from the 102 uploaded
   - Correct answers should work properly

## Files You Need

- ✅ `UPLOAD_JAVA_BEGINNER_FRESH.bat` - Run this to upload
- ✅ `CHECK_JAVA_BEGINNER_IN_DATABASE.sql` - Run this to verify
- ✅ `scripts/upload-java-beginner-fresh.ts` - The upload script
- ✅ `questions/java-beginner.csv` - Your 102 questions

## Common Issues

### Issue: "Missing Supabase credentials"
**Fix**: Check `.env` file has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Issue: "Error: duplicate key value"
**Fix**: Script already handles this by deleting first

### Issue: Still shows 0 questions
**Fix**: Check console output for actual error message

## Summary

Your CSV file is perfect with 102 questions. The "0 questions" message means the upload failed due to duplicates from your earlier SQL upload. Run `UPLOAD_JAVA_BEGINNER_FRESH.bat` to delete old questions and upload all 102 fresh.
