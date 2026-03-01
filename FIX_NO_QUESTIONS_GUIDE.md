# Fix: No Questions Showing in Practice Page

## Problem
Practice page shows "No questions available for this combination" for all skill/level selections.

## Quick Fix Steps

### Step 1: Run Diagnosis
Open Supabase SQL Editor and run:
```sql
-- File: DIAGNOSE_NO_QUESTIONS_SHOWING.sql
```
This will show you:
- If questions table has data
- What skills are available
- What levels exist
- If RLS is blocking access

### Step 2: Apply Complete Fix
Run this SQL file in Supabase:
```sql
-- File: FIX_PRACTICE_PAGE_NO_QUESTIONS.sql
```

This fix will:
1. ✅ Disable RLS temporarily
2. ✅ Copy data from practice_questions if questions table is empty
3. ✅ Set type='mcq' for all questions
4. ✅ Convert level names (beginner→easy, intermediate→medium, advanced→hard)
5. ✅ Re-enable RLS with proper public read policy
6. ✅ Grant permissions to anon and authenticated users
7. ✅ Verify the fix worked

### Step 3: Check Browser Console
1. Open your Practice page
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Select a skill and level
5. Look for these logs:
   - 🔍 Loading questions with: {skill, level, dbLevel}
   - ✅ Questions loaded: X questions
   - 📝 Sample question: {...}

### Step 4: If Still Not Working

Check these common issues:

#### Issue A: RLS Blocking Access
```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'questions';

-- If rowsecurity = true, check policies
SELECT * FROM pg_policies WHERE tablename = 'questions';
```

#### Issue B: Wrong Level Names
```sql
-- Check what levels exist
SELECT DISTINCT level FROM questions;

-- Should be: easy, medium, hard
-- NOT: beginner, intermediate, advanced
```

#### Issue C: Missing type='mcq'
```sql
-- Check type column
SELECT type, COUNT(*) FROM questions GROUP BY type;

-- All should have type='mcq'
```

#### Issue D: Empty questions table
```sql
-- Check both tables
SELECT COUNT(*) FROM questions;
SELECT COUNT(*) FROM practice_questions;

-- If questions is empty, copy from practice_questions
```

## Expected Results After Fix

You should see:
- ✅ Questions load for JavaScript + Beginner
- ✅ Questions load for Java + Advanced
- ✅ Questions load for any skill + any level combination
- ✅ Console shows: "✅ Questions loaded: 10 questions"

## Level Mapping Reference

Practice Page → Database:
- Beginner → easy
- Intermediate → medium
- Advanced → hard

## Need More Help?

1. Check browser console for errors (F12)
2. Run DIAGNOSE_NO_QUESTIONS_SHOWING.sql
3. Check Supabase logs for RLS errors
4. Verify your .env has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
