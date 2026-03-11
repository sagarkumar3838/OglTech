# GCP Case Sensitivity Issue - SOLUTION

## 🔴 Problem Identified

Your database shows:
- **100 questions** with skill = `"GCP"` (uppercase)
- **41 questions** showing in frontend with skill = `"gcp"` (lowercase)

This is a **case sensitivity mismatch** between:
1. What's stored in the database: `"GCP"`
2. What the frontend is searching for: `"gcp"`

## 🎯 Root Cause

When you uploaded the GCP questions, the CSV file had:
```csv
skill,level,question_text,...
GCP,beginner,What are the main categories...
```

The skill name was `"GCP"` (uppercase), but your frontend expects lowercase skill names like:
- `"html"`, `"css"`, `"javascript"`, `"python"`, etc.

## ✅ Solution

Run this SQL command in Supabase SQL Editor:

```sql
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';
```

This will:
- Convert all 100 "GCP" questions to "gcp"
- Make them visible in the frontend
- Match the naming convention of other skills

## 📋 Step-by-Step Fix

### Option 1: Using Supabase Dashboard (EASIEST)

1. Go to Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste this SQL:
   ```sql
   UPDATE practice_questions
   SET skill = 'gcp'
   WHERE skill = 'GCP';
   ```
5. Click "Run"
6. You should see: "Success. 100 rows affected"

### Option 2: Using SQL File

1. Open `fix-gcp-case-sensitivity.sql` in your editor
2. Copy the entire content
3. Run it in Supabase SQL Editor

## 🔍 Verify the Fix

After running the update, verify with:

```sql
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'gcp'
GROUP BY skill, level;
```

You should see:
```
skill | level     | question_count
------|-----------|---------------
gcp   | beginner  | 100
```

## 🎨 Frontend Display

After the fix, your Practice page will show:
- **Skill**: gcp (lowercase)
- **Level**: beginner
- **Questions**: 100 questions available

## 🚨 Prevention for Future Uploads

When creating CSV files, always use **lowercase** skill names:

✅ **CORRECT**:
```csv
skill,level,question_text,...
gcp,beginner,What is...
aws,intermediate,How to...
azure,advanced,Which service...
```

❌ **INCORRECT**:
```csv
skill,level,question_text,...
GCP,beginner,What is...
AWS,intermediate,How to...
Azure,advanced,Which service...
```

## 📝 Update Your CSV File

Also update your source CSV file to prevent this in future uploads:

1. Open `questions/gcp-beginner.csv`
2. Find and replace: `GCP,beginner` → `gcp,beginner`
3. Save the file

## 🔧 Check Other Skills

Run this to check if other skills have the same issue:

```sql
SELECT 
  skill,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill != LOWER(skill)
GROUP BY skill
ORDER BY skill;
```

If you see any results, they also need to be fixed.

## ✅ Expected Result

After the fix:
- ✅ All 100 GCP beginner questions will be visible
- ✅ Frontend dropdown will show "gcp" with 100 questions
- ✅ Users can practice GCP questions
- ✅ Consistent with other skill names

---

**Created**: ${new Date().toISOString()}
**Status**: Ready to apply
**Impact**: Will make 100 GCP questions visible in frontend
