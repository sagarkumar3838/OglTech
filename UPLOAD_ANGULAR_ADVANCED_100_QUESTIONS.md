# Upload Angular Advanced 100 Questions - Troubleshooting Guide

## Problem
- Database shows only 45 Angular advanced questions
- CSV file has ~244 questions (245 lines including header)
- 100 extra questions were uploaded but not showing

## Possible Causes

### 1. Duplicate Prevention
Your database might have a unique constraint that prevents duplicate questions from being inserted.

### 2. Upload Script Not Running
The upload script might have failed silently or only partially completed.

### 3. Wrong Table
Questions might have been uploaded to the wrong table (questions vs practice_questions).

### 4. RLS Policies
Row Level Security policies might be blocking inserts.

## Solution Steps

### Step 1: Diagnose the Issue
Run this SQL in Supabase:
```sql
-- Check both tables
SELECT 'practice_questions' as table_name, COUNT(*) as count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as count
FROM questions
WHERE skill = 'angular' AND level = 'advanced';
```

### Step 2: Check for Duplicates
```sql
SELECT 
  question_text,
  COUNT(*) as duplicate_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY question_text
HAVING COUNT(*) > 1;
```

### Step 3: Remove Duplicates (if any)
```sql
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY skill, level, question_text ORDER BY created_at) as rn
    FROM practice_questions
    WHERE skill = 'angular' AND level = 'advanced'
  ) t
  WHERE rn > 1
);
```

### Step 4: Re-upload Using Script

Create a new upload script or use the existing one:

```bash
# Run the upload script
npx tsx scripts/upload-csv-direct.ts questions/angular-advanced.csv
```

### Step 5: Verify Upload
```sql
SELECT 
  COUNT(*) as total_angular_advanced,
  MIN(created_at) as oldest_question,
  MAX(created_at) as newest_question
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced';
```

## Quick Fix Commands

Run these in order:

1. **Diagnose**: `diagnose-angular-advanced-upload.sql`
2. **Fix**: `fix-angular-advanced-upload.sql`
3. **Upload**: Use the batch file below

## Alternative: Direct SQL Insert

If the upload script isn't working, you can manually insert questions using SQL. However, this requires converting CSV to SQL INSERT statements.

## Need Help?

Check these files:
- `diagnose-angular-advanced-upload.sql` - Diagnostic queries
- `fix-angular-advanced-upload.sql` - Cleanup and fix queries
- `scripts/upload-csv-direct.ts` - Upload script
