# Fix ALL Duplicate Questions - Complete Guide

## Problem
The database has duplicate questions across multiple skills (Azure, AWS, and possibly others). The error message shows:
```
Key (skill, level, question_text)=(Aws, Advanced, What is AWS Chime?) is duplicated.
```

This means we need to clean ALL duplicates before adding the unique constraint.

## Solution - 3 Simple Steps

### Step 1: Diagnose (See the Problem)
Run `DIAGNOSE_ALL_DUPLICATES.sql` in Supabase SQL Editor

This will show you:
- Total duplicates across the database
- Which skills have duplicates
- Top duplicated questions
- How many rows will be deleted

### Step 2: Clean (Fix the Problem)
Run `CLEAN_DUPLICATES_UUID_FIX.sql` in Supabase SQL Editor

This will:
- Remove ALL duplicate questions (keeps first occurrence based on created_at)
- Add a unique constraint to prevent future duplicates
- Verify the cleanup was successful

**Note:** Use this version instead of CLEAN_ALL_DUPLICATES_COMPLETE.sql because your database uses UUID primary keys.

### Step 3: Verify (Confirm It's Fixed)
The script automatically verifies, but you can also run:

```sql
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT (skill, level, question_text)) 
    THEN '✅ No duplicates!' 
    ELSE '⚠️ Still has duplicates' 
  END as status
FROM practice_questions;
```

## What Gets Deleted?

For each duplicate question, the script:
- Keeps the FIRST occurrence (lowest ID)
- Deletes all other copies

Example:
- Question "What is AWS Chime?" appears 5 times with IDs: 100, 250, 300, 450, 600
- Keeps: ID 100
- Deletes: IDs 250, 300, 450, 600

## Expected Results

After cleanup:
- Azure Advanced: ~72 unique questions (down from 693)
- AWS Advanced: ~50-100 unique questions
- All other skills: Only unique questions remain
- Total database: Significantly smaller, all unique

## Files Created

1. **DIAGNOSE_ALL_DUPLICATES.sql** - See the problem scope
2. **CLEAN_DUPLICATES_UUID_FIX.sql** - Fix everything (UUID compatible)
3. **CLEAN_ALL_DUPLICATES_COMPLETE.sql** - Alternative version
4. **FIX_ALL_DUPLICATES_NOW.md** - This guide

## Safety

The cleanup script:
- Only deletes exact duplicates
- Keeps the original (first) occurrence
- Adds a constraint to prevent future duplicates
- Can be run multiple times safely (idempotent)

## After Cleanup

Once the unique constraint is added, any attempt to insert a duplicate question will fail with an error, preventing duplicates automatically.

## Quick Start

1. Open Supabase SQL Editor
2. Copy and paste: `DIAGNOSE_ALL_DUPLICATES.sql`
3. Run it to see the duplicates
4. Copy and paste: `CLEAN_DUPLICATES_UUID_FIX.sql`
5. Run it to fix everything
6. Done! ✅
