# Fix Cypress Duplicate Upload Error

## What Happened

You uploaded cypress-beginner.csv and got:
- ✅ 207 questions uploaded successfully
- ❌ 150 questions failed (duplicates)

This means you already have 207 cypress beginner questions in the database from a previous upload.

## The Problem

The database has a unique constraint that prevents duplicate questions:
```
unique_question_per_skill_level (skill, level, question_text)
```

When you try to upload the same questions again, it blocks them.

## Solution Options

### Option 1: Keep What You Have (Recommended)
If the 207 questions already in the database are correct, you don't need to do anything. The upload script correctly prevented duplicates.

### Option 2: Replace All Questions
If you want to replace ALL cypress beginner questions with the new CSV:

1. Run the SQL to delete existing questions:
   ```sql
   DELETE FROM practice_questions
   WHERE skill = 'cypress' AND level = 'beginner';
   ```

2. Re-upload the CSV:
   ```bash
   npx tsx scripts/upload-csv-no-duplicates.ts questions/cypress-beginner.csv
   ```

### Option 3: Use the Batch File (Easiest)
Double-click: `FIX_CYPRESS_DUPLICATES_NOW.bat`

This will:
1. Open Supabase SQL Editor
2. Guide you to delete existing questions
3. Automatically re-upload the CSV

## Important Notes

1. The 150 failed questions are NOT errors - they're duplicates being correctly blocked
2. Your database now has 207 cypress beginner questions
3. If those 207 questions are correct, you're done!
4. Only delete and re-upload if you need to replace the questions

## Check Your Database

Run this SQL to see what you have:
```sql
SELECT COUNT(*) as total, skill, level
FROM practice_questions
WHERE skill = 'cypress'
GROUP BY skill, level
ORDER BY level;
```

Expected result:
- cypress | beginner | 207 (or 357 if you re-upload after deletion)
