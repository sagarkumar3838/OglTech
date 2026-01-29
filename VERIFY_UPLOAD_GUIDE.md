# 🔍 Verify Upload - Quick Guide

## 📊 Quick Check Queries

### 1. Total Questions Count
```sql
SELECT COUNT(*) as total_questions
FROM questions;
```

### 2. Count by Skill
```sql
SELECT 
  skill,
  COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;
```

**Expected Result:**
```
skill       | count
------------|-------
CSS         | 65
HTML        | 120
JavaScript  | 120
jQuery      | 80
OGL         | 150
```

### 3. Count by Skill and Level
```sql
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

**Expected Result:**
```
skill       | level    | count
------------|----------|-------
CSS         | BASIC    | 65
HTML        | BASIC    | 120
JavaScript  | BASIC    | 120
jQuery      | BASIC    | 80
OGL         | BASIC    | 150
```

### 4. Count by Question Type
```sql
SELECT 
  type,
  COUNT(*) as count
FROM questions
GROUP BY type
ORDER BY type;
```

**Expected Result:**
```
type       | count
-----------|-------
mcq        | 500
fill_blank | 35
```

### 5. Detailed Breakdown (Skill + Level + Type)
```sql
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level, type;
```

---

## 🎯 How to Run These Queries

### Method 1: Supabase Dashboard (Easiest)
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste any query from above
5. Click **Run** or press `Ctrl+Enter`

### Method 2: Supabase Table Editor
1. Go to your Supabase Dashboard
2. Click on **Table Editor** in the left sidebar
3. Select the **questions** table
4. Use the filter and search features to explore data

---

## 📋 Complete SQL File

All verification queries are saved in:
```
CHECK_UPLOADED_QUESTIONS.sql
```

This file contains 15 different queries to check:
1. Total count
2. Count by skill
3. Count by skill and level
4. Count by question type
5. Detailed breakdown
6. Recent uploads
7. Sample questions
8. Check for duplicates
9. Fill-in-the-blank questions
10. MCQ questions
11. Questions without options
12. Summary report
13. Data quality check
14. Questions by creation date
15. Search specific questions

---

## ✅ What to Verify After Upload

### Check 1: Total Count
Run Query #1 to see total questions uploaded.

**Expected:** ~535 questions (if you uploaded all 6 CSV files)

### Check 2: Skills Present
Run Query #2 to see all skills.

**Expected:** HTML, CSS, JavaScript, jQuery, OGL

### Check 3: Question Types
Run Query #4 to see question types.

**Expected:** 
- mcq (Multiple Choice)
- fill_blank (Fill in the Blank)

### Check 4: No Duplicates
Run Query #8 to check for duplicates.

**Expected:** No results (or very few)

### Check 5: Data Quality
Run Query #13 to check for missing data.

**Expected:** All counts should be 0

---

## 🔍 Quick Verification Steps

### Step 1: Open Supabase Dashboard
Go to: https://app.supabase.com

### Step 2: Select Your Project
Click on your project

### Step 3: Open SQL Editor
Click **SQL Editor** in the left sidebar

### Step 4: Run Quick Check
Copy and paste this query:
```sql
-- Quick Summary
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level, type;
```

### Step 5: Verify Results
You should see rows like:
```
CSS | BASIC | mcq        | 65
HTML | BASIC | fill_blank | 20
HTML | BASIC | mcq        | 100
...
```

---

## 📊 Expected Results (After Uploading All Files)

| Skill | Level | Type | Count |
|-------|-------|------|-------|
| CSS | BASIC | mcq | ~65 |
| HTML | BASIC | mcq | ~100 |
| HTML | BASIC | fill_blank | ~20 |
| JavaScript | BASIC | mcq | ~120 |
| jQuery | BASIC | mcq | ~80 |
| OGL | BASIC | mcq | ~150 |
| **TOTAL** | | | **~535** |

---

## 🛠️ Troubleshooting

### No questions found?
- Check if upload script ran successfully
- Verify `.env` file has correct Supabase credentials
- Check for error messages in upload script output

### Fewer questions than expected?
- Check Query #8 for duplicates (they were removed)
- Review the JSON backup file created during upload
- Verify CSV files have correct format

### Wrong question types?
- Check if CSV has correct type column
- Verify "Multiple Choice" was converted to "mcq"
- Verify "Fill in the Blank" was converted to "fill_blank"

### Missing data?
- Run Query #13 to check data quality
- Look for questions with NULL or empty fields

---

## 💡 Pro Tips

### View Sample Questions
```sql
SELECT * FROM questions LIMIT 10;
```

### Search for Specific Topic
```sql
SELECT * FROM questions 
WHERE question ILIKE '%flexbox%'
LIMIT 10;
```

### Count Questions Added Today
```sql
SELECT COUNT(*) 
FROM questions 
WHERE DATE(created_at) = CURRENT_DATE;
```

### View Fill-in-the-Blank Questions Only
```sql
SELECT skill, question, correct_answer 
FROM questions 
WHERE type = 'fill_blank'
LIMIT 20;
```

---

## ✅ Quick Checklist

After upload, verify:
- [ ] Total count matches expected (~535)
- [ ] All 5 skills present (HTML, CSS, JavaScript, jQuery, OGL)
- [ ] Both question types present (mcq, fill_blank)
- [ ] No duplicate questions
- [ ] No missing data (NULL values)
- [ ] Questions have explanations
- [ ] MCQ questions have 4 options
- [ ] Fill-in-the-blank questions have no options

---

## 🎉 All Good?

If all checks pass, your questions are successfully uploaded and ready to use in your evaluation platform!
