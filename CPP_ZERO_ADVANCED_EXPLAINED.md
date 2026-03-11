# Why C++ Advanced Shows 0 Questions

## The Problem

Your database shows **0 advanced C++ questions** even though you have a CSV file with 240 questions.

## Root Cause: Database Case Sensitivity Split

Your database has **TWO separate C++ entries** due to case sensitivity:

### Current Database State:

| Skill | Beginner | Intermediate | Advanced | Total |
|-------|----------|--------------|----------|-------|
| `c++` | 91       | 98           | 0        | 189   |
| `cpp` | 122      | 133          | 240      | 495   |

**Total C++ questions: 684** (but split across two skill names!)

## Why This Happened

### CSV File Format:
```csv
skill,level,question_text,...
C++,Advanced,When should you implement move constructors...
```

### Database Expected Format:
```csv
skill,level,question_text,...
cpp,advanced,When should you implement move constructors...
```

**The mismatch:**
- CSV uses: `C++,Advanced,` (uppercase with ++)
- Database expects: `cpp,advanced` (lowercase, no ++)

When you uploaded the CSV, Supabase created a NEW skill entry `C++` instead of adding to the existing `cpp` entry.

## This is Part of a Bigger Issue

This same case sensitivity problem affects your ENTIRE database:
- `angular` vs `Angular`
- `aws` vs `Aws`
- `c++` vs `cpp`
- And potentially many more skills

## The Solution

### Option 1: Fix Everything at Once (RECOMMENDED)

Run the comprehensive fix that handles ALL skills:

```bash
# In Supabase SQL Editor, run:
FIX_COMPLETE_WITH_CONSTRAINT.sql
```

This will:
1. Delete duplicate questions
2. Merge all case variations (angular + Angular → angular)
3. Merge all C++ variations (c++ + cpp → cpp)
4. Standardize all levels to lowercase
5. Map invalid levels (basic→beginner, easy→beginner, etc.)

### Option 2: Fix Just C++ Now

Run the C++-specific fix:

```bash
# In Supabase SQL Editor, run:
FIX_CPP_MERGE_NOW.sql
```

Expected result after merge:
- Skill: `cpp`
- Beginner: 213 questions
- Intermediate: 231 questions
- Advanced: 240 questions
- **Total: 684 questions**

## Fix Your CSV Files for Future Uploads

To prevent this from happening again, update your CSV files:

### Before (WRONG):
```csv
C++,Advanced,question text...
```

### After (CORRECT):
```csv
cpp,advanced,question text...
```

You can use PowerShell to fix the CSV:

```powershell
# Fix cpp-advanced.csv
(Get-Content questions/cpp-advanced.csv) -replace '^C\+\+,Advanced,', 'cpp,advanced,' | Set-Content questions/cpp-advanced.csv

# Fix cpp-beginner.csv
(Get-Content questions/cpp-beginner.csv) -replace '^C\+\+,Beginner,', 'cpp,beginner,' | Set-Content questions/cpp-beginner.csv

# Fix cpp-intermediate.csv
(Get-Content questions/cpp-intermediate.csv) -replace '^C\+\+,Intermediate,', 'cpp,intermediate,' | Set-Content questions/cpp-intermediate.csv
```

## Verification

After running the fix, verify with:

```sql
-- Check C++ questions
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'cpp'
GROUP BY skill, level
ORDER BY level;
```

You should see:
- cpp, beginner: 213
- cpp, intermediate: 231
- cpp, advanced: 240

## Summary

The C++ advanced questions ARE in your database, but they're under the `cpp` skill name, not `c++`. The split happened because of case sensitivity. Run the fix SQL to merge them into a single `cpp` entry.
