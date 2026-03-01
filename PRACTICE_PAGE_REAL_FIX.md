# Practice Page - REAL FIX (Schema Mismatch)

## Problem Identified ✅

Your database has **9,208 questions** but they're not showing because of a **SCHEMA MISMATCH**.

### What's Wrong:

**Database has:**
- Column: `question_text` 
- Columns: `option_a`, `option_b`, `option_c`, `option_d` (separate)
- Level values: "Basic", "Intermediate", "Advanced"

**Practice page expects:**
- Column: `question`
- Column: `options` (as JSON array)
- Level values: "easy", "medium", "hard"

## Solution: Run Schema Fix

### Step 1: Run This SQL

Open Supabase SQL Editor and run: **`FIX_QUESTIONS_SCHEMA.sql`**

This will:
1. Add missing `question` column
2. Copy `question_text` → `question`
3. Combine `option_a`, `option_b`, `option_c`, `option_d` → `options` JSON array
4. Map level values: Basic→easy, Intermediate→medium, Advanced→hard
5. Set `type` to 'mcq'

### Step 2: Verify

After running the SQL, check:

```sql
-- Should show all questions have proper format
SELECT 
  COUNT(*) as total,
  COUNT(question) as has_question,
  COUNT(options) as has_options
FROM questions;

-- Test JavaScript easy questions
SELECT id, skill, level, question, options
FROM questions
WHERE skill = 'javascript' AND level = 'easy'
LIMIT 3;
```

### Step 3: Test Practice Page

1. Go to: http://localhost:3001/practice
2. Select: JavaScript + Beginner
3. Questions should now appear!

## Why This Happened

Your CSV files were uploaded with column names like `question_text`, `option_a`, etc., but the Practice page code expects `question` and `options` (as JSON).

The fix script transforms the data to match what the code expects.

## Alternative: Update Practice Page Code

If you prefer to keep the current schema, you could update Practice.tsx to use:
- `question_text` instead of `question`
- Build options array from `option_a`, `option_b`, etc.

But running the SQL fix is faster and cleaner.

## Files Created

- `FIX_QUESTIONS_SCHEMA.sql` - Run this to fix the schema
- `CHECK_QUESTIONS_SCHEMA.sql` - Check current schema
- `PRACTICE_PAGE_REAL_FIX.md` - This guide

## Summary

**Problem**: Schema mismatch (column names don't match)
**Solution**: Run `FIX_QUESTIONS_SCHEMA.sql`
**Result**: 9,208 questions will work with Practice page
