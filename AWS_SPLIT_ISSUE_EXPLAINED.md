# AWS Showing Less Questions - Same Case Sensitivity Issue

## The Problem

Your AWS intermediate shows only 95 questions, but you likely have MORE questions split across different case variations.

## Root Cause

Your CSV files use:
```csv
Aws,Intermediate,What is an AWS Transit Gateway?...
```

But the database expects:
```csv
aws,intermediate,What is an AWS Transit Gateway?...
```

## Current Database State (Likely)

Your AWS questions are probably split like this:

| Skill | Beginner | Intermediate | Advanced | Total |
|-------|----------|--------------|----------|-------|
| `aws` | X        | 95           | Y        | ?     |
| `Aws` | X        | Z            | Y        | ?     |

The 95 you see is only ONE of the entries!

## This Affects ALL Your Skills

Same issue as C++ and Angular:
- `aws` vs `Aws` vs `AWS`
- `angular` vs `Angular`
- `c++` vs `cpp`
- And potentially ALL 54 skills!

## The Solution

### Option 1: Fix Everything at Once (STRONGLY RECOMMENDED)

Run the comprehensive fix that handles ALL skills:

```sql
-- In Supabase SQL Editor:
FIX_COMPLETE_WITH_CONSTRAINT.sql
```

This will:
1. Merge ALL case variations for ALL skills
2. Standardize everything to lowercase
3. Fix invalid levels (basic→beginner, etc.)
4. Remove duplicates

### Option 2: Fix Just AWS Now

Run the AWS-specific fix (see FIX_AWS_NOW.sql below)

### Option 3: Fix CSV Files for Future Uploads

Run the batch file to fix all AWS CSV files (see FIX_AWS_CSV_FILES.bat below)

## Verification

After running the fix, check with:

```sql
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'aws'
GROUP BY skill, level
ORDER BY level;
```

You should see all AWS questions merged under single `aws` skill name.
