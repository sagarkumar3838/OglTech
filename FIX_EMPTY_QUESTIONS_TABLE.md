# Fix: Empty Questions Table

## Problem
Your `questions` table has **0 rows** - that's why no questions show up in the Practice page!

## Solution
Copy all questions from `practice_questions` table to `questions` table.

## Steps

### 1. First, check both tables
Run in Supabase SQL Editor:
```sql
-- File: CHECK_ALL_TABLES_FOR_QUESTIONS.sql
```

This will show you:
- How many questions are in `practice_questions`
- What skills and levels are available
- Sample question data

### 2. Copy all questions
Run in Supabase SQL Editor:
```sql
-- File: COPY_ALL_QUESTIONS_FROM_PRACTICE.sql
```

This will:
- ✅ Copy ALL questions from `practice_questions` to `questions`
- ✅ Convert level names (beginner→easy, intermediate→medium, advanced→hard)
- ✅ Set type='mcq' for all questions
- ✅ Enable RLS with public read policy
- ✅ Grant permissions to anon and authenticated users
- ✅ Show you a summary of what was copied

### 3. Refresh your Practice page
1. Go to your Practice page
2. Press Ctrl+Shift+R (hard refresh)
3. Select any skill + level
4. Questions should now appear!

## What This Does

The script will:
1. Check how many questions are in each table
2. Clear the `questions` table
3. Copy ALL questions from `practice_questions`
4. Fix level names automatically
5. Set up proper permissions
6. Show you a summary

## Expected Output

After running the script, you should see:
```
AFTER COPY:
questions table: 1500 rows (or however many you have)
practice_questions table: 1500 rows
✅ SUCCESS! Questions copied successfully!
```

Then a breakdown by skill and level:
```
skill        | level  | question_count
-------------|--------|---------------
javascript   | easy   | 50
javascript   | medium | 50
javascript   | hard   | 50
java         | easy   | 50
java         | medium | 50
java         | hard   | 50
...
```

## Troubleshooting

### If practice_questions is also empty
You need to upload questions first. Use one of these:
- `UPLOAD_ALL_CSV_NOW.bat` - Upload from CSV files
- `scripts/upload-all-questions.ts` - Upload script

### If you get permission errors
The script handles this automatically by:
- Disabling RLS temporarily
- Creating public read policy
- Granting permissions

### If levels are wrong
The script automatically converts:
- beginner → easy
- intermediate → medium
- advanced → hard

## Quick Test

After running the fix, test with this SQL:
```sql
-- Should return 10 questions
SELECT * FROM questions 
WHERE skill = 'javascript' 
  AND level = 'easy' 
  AND type = 'mcq' 
LIMIT 10;
```

If you see 10 questions, it worked! 🎉
