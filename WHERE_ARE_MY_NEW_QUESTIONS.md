# Where Are My New Questions? 🔍

## Quick Answer
Your new questions are likely in **CSV files** but may NOT be deployed to Supabase yet.

## Current Situation

### 📁 What You Have Locally
Based on your file structure, you have:
- **99 CSV files** in the `questions/` folder
- Recent CSV files (last modified Feb 26, 2026):
  - cypress-intermediate.csv
  - cypress-advanced.csv
  - css-advanced.csv
  - css-beginner.csv
  - csharp-advanced.csv
  - cpp-advanced.csv
  - And many more...

### 🗄️ What's in Supabase
You have TWO tables in Supabase:
1. **practice_questions** - Main table for practice questions
2. **questions** - Secondary table (may or may not be synced)

## How to Check What's Deployed

### Step 1: Run This SQL in Supabase
Open Supabase SQL Editor and run:
```sql
-- See file: CHECK_NEW_QUESTIONS_STATUS.sql
```

This will show you:
- Total questions in each table
- Questions by skill and level
- Recently added questions (last 24 hours)
- What's missing between tables

### Step 2: Check Your Recent Uploads
Look at your terminal/command history to see if you ran any of these:
- `UPLOAD_ALL_QUESTIONS_NOW.bat`
- `UPLOAD_ALL_FIXED_CSV.bat`
- `npx tsx scripts/upload-all-questions.ts`

## How to Deploy Your New Questions

### Option 1: Upload ALL Questions (Recommended)
```bash
# This uploads all CSV files from questions/ folder
UPLOAD_ALL_QUESTIONS_NOW.bat
```

### Option 2: Upload Only Missing Questions (Smart)
```bash
# This checks what's already uploaded and only adds new ones
UPLOAD_MISSING_ONLY.bat
```

### Option 3: Upload Specific Skill
```bash
# Example: Upload only Java questions
npx tsx scripts/upload-all-questions.ts
```

## Common Issues

### Issue 1: CSV Files Not Uploaded
**Symptom:** You created CSV files but they're not in Supabase
**Solution:** Run one of the upload batch files above

### Issue 2: Questions in practice_questions but NOT in questions
**Symptom:** Practice page shows questions but other pages don't
**Solution:** Run this SQL to copy:
```sql
-- See file: COPY_PRACTICE_TO_QUESTIONS_WITH_LEVELS.sql
```

### Issue 3: Duplicate Questions
**Symptom:** Same questions appearing multiple times
**Solution:** Run:
```bash
npx tsx scripts/remove-duplicate-questions.ts
```

## Verification Steps

After uploading, verify with these SQL queries:

```sql
-- 1. Count total questions
SELECT COUNT(*) FROM practice_questions;

-- 2. Count by skill
SELECT skill, COUNT(*) as count 
FROM practice_questions 
GROUP BY skill 
ORDER BY count DESC;

-- 3. Check recent additions
SELECT skill, level, COUNT(*) as count, MAX(created_at) as last_added
FROM practice_questions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY skill, level
ORDER BY last_added DESC;
```

## Quick Action Plan

1. ✅ Run `CHECK_NEW_QUESTIONS_STATUS.sql` in Supabase
2. ✅ Check the results to see what's missing
3. ✅ Run `UPLOAD_ALL_QUESTIONS_NOW.bat` to upload everything
4. ✅ Wait 2-5 minutes for upload to complete
5. ✅ Run verification queries to confirm

## Need Help?

If questions still don't show up after uploading:
1. Check RLS (Row Level Security) policies in Supabase
2. Verify your `.env` file has correct Supabase credentials
3. Check browser console for errors
4. Run `DIAGNOSE_MISSING_QUESTIONS.sql`

---

**Last Updated:** March 1, 2026
**Your CSV Files:** 99 files ready to upload
**Recommended Action:** Run `UPLOAD_ALL_QUESTIONS_NOW.bat`
