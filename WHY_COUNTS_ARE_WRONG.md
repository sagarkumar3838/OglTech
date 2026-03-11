# Why Your Question Counts Are Wrong - Visual Explanation

## 🔍 What You're Seeing

```
Your Practice Page Shows:
┌──────────┬──────────────┐
│ Skill    │ Intermediate │
├──────────┼──────────────┤
│ aws      │     95       │ ← Only showing ONE entry!
│ C++      │      0       │ ← Shows 0 but has 240!
│ angular  │     45       │ ← Missing 100 questions!
└──────────┴──────────────┘
```

## 🤔 What's Actually in Your Database

```
Reality - Questions Are SPLIT:
┌──────────┬──────────────┬────────────────────┐
│ Skill    │ Intermediate │ Why Split?         │
├──────────┼──────────────┼────────────────────┤
│ aws      │     95       │ lowercase          │
│ Aws      │     50       │ Capital A          │ ← Hidden!
│ AWS      │     10       │ All caps           │ ← Hidden!
├──────────┼──────────────┼────────────────────┤
│ c++      │     98       │ lowercase with ++  │
│ cpp      │    133       │ lowercase no ++    │ ← Hidden!
├──────────┼──────────────┼────────────────────┤
│ angular  │     45       │ lowercase          │
│ Angular  │    100       │ Capital A          │ ← Hidden!
└──────────┴──────────────┴────────────────────┘

Your app only shows the FIRST match!
```

## 🚨 The Root Cause

### Your CSV Files Use Mixed Case:

```csv
❌ WRONG:
Aws,Intermediate,question...
C++,Advanced,question...
Angular,Advanced,question...

✅ CORRECT:
aws,intermediate,question...
cpp,advanced,question...
angular,advanced,question...
```

### Database is Case-Sensitive:

```
"Aws" ≠ "aws"  (different entries!)
"C++" ≠ "cpp"  (different entries!)
"Angular" ≠ "angular"  (different entries!)
```

## 📊 Example: AWS Intermediate

```
What You See:
┌─────┬──────────────┐
│ aws │      95      │
└─────┴──────────────┘

What's Actually There:
┌─────┬──────────────┬──────────────────┐
│ aws │      95      │ From old uploads │
│ Aws │      50      │ From new uploads │
│ AWS │      10      │ From CSV errors  │
├─────┴──────────────┴──────────────────┤
│ TOTAL: 155 questions (but split!)     │
└────────────────────────────────────────┘
```

## 🎯 The Fix

### Step 1: Fix CSV Files (For Future)

Run this batch file:
```batch
FIX_ALL_CSV_FILES_CASE.bat
```

This changes:
- `Aws,Intermediate,` → `aws,intermediate,`
- `C++,Advanced,` → `cpp,advanced,`
- `Angular,Advanced,` → `angular,advanced,`

### Step 2: Fix Database (Merge Existing)

Run this SQL in Supabase:
```sql
FIX_COMPLETE_WITH_CONSTRAINT.sql
```

This will:
1. Find all case variations
2. Delete duplicates
3. Merge into single lowercase entry
4. Standardize all levels

## ✅ After the Fix

```
Before:
┌──────────┬──────────────┐
│ aws      │      95      │
│ Aws      │      50      │
│ AWS      │      10      │
└──────────┴──────────────┘

After:
┌──────────┬──────────────┐
│ aws      │     155      │ ✅ All merged!
└──────────┴──────────────┘
```

## 🔗 Files to Use

1. **Diagnose the problem:**
   - `DIAGNOSE_AWS_SPLIT.sql` - Check AWS split
   - `CHECK_ALL_SKILLS_BY_LEVEL.sql` - Check all skills

2. **Fix CSV files:**
   - `FIX_ALL_CSV_FILES_CASE.bat` - Fix C++, AWS, Angular CSVs
   - `FIX_AWS_CSV_FILES.bat` - Fix just AWS
   - `FIX_CPP_CSV_FILES.bat` - Fix just C++

3. **Fix database:**
   - `FIX_COMPLETE_WITH_CONSTRAINT.sql` - Fix ALL skills at once (RECOMMENDED)
   - `FIX_CPP_MERGE_NOW.sql` - Fix just C++

## ⚠️ Important Notes

- This affects ALL 54 skills in your database
- You have hundreds of duplicate questions split by case
- Fix the database FIRST, then CSV files
- After fixing, re-upload any new questions with correct format

## 🎬 Quick Action

1. Run `FIX_COMPLETE_WITH_CONSTRAINT.sql` in Supabase NOW
2. Run `FIX_ALL_CSV_FILES_CASE.bat` to fix CSV files
3. Verify with `CHECK_ALL_SKILLS_BY_LEVEL.sql`
4. Celebrate! 🎉
