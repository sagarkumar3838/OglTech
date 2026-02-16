# Fix: No Questions Showing in Practice Page

## Problem
You're seeing "No questions available for this combination" because the `questions` table is empty or doesn't have the right data.

## Root Cause
The CSV files in `questions/` folder haven't been uploaded to the `practice_questions` table yet, OR they were uploaded but not copied to the `questions` table.

## Solution - Follow These Steps:

### Step 1: Check What's in Database
Run `DIAGNOSE_MISSING_QUESTIONS.sql` in Supabase SQL Editor.

This will show you:
- How many questions are in `questions` table
- How many questions are in `practice_questions` table
- What skills and levels exist

### Step 2A: If practice_questions is EMPTY
You need to upload the CSV files first!

**Option 1: Use Supabase Table Editor (Easiest)**
1. Go to Supabase Dashboard
2. Click "Table Editor" → Select `practice_questions` table
3. Click "Insert" → "Import data from CSV"
4. Upload each CSV file from `questions/` folder
5. Map the columns correctly
6. Repeat for all CSV files you want

**Option 2: Use the upload script**
```bash
cd scripts
npm install
node upload-all-questions.ts
```

### Step 2B: If practice_questions HAS DATA
Run `CHECK_AND_FIX_QUESTIONS.sql` in Supabase SQL Editor.

This will:
1. Check both tables
2. Copy data from `practice_questions` to `questions`
3. Map levels correctly (Basic→easy, Intermediate→medium, Advanced→hard)
4. Include all video links
5. Verify it worked

### Step 3: Test in Frontend
1. Refresh your browser (Ctrl+F5)
2. Go to Practice page
3. Select Python + Beginner
4. Questions should now appear!

## Quick Test
Run this SQL to see if you have Python questions:

```sql
-- Check practice_questions
SELECT COUNT(*) FROM practice_questions WHERE LOWER(skill) = 'python';

-- Check questions
SELECT COUNT(*) FROM questions WHERE skill = 'python' AND level = 'easy';
```

If first query returns 0: Upload CSV files
If first query returns >0 but second returns 0: Run the copy SQL

## Note About Levels
- CSV files use: "Basic", "Intermediate", "Advanced"
- Database needs: "easy", "medium", "hard"
- The SQL script handles this mapping automatically
