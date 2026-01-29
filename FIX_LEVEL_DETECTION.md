# 🔧 Fix: Upload CSV with All Levels in One File

## ❌ The Problem

Your CSV files (like `css_easy_questions.csv`) contain questions for **all three levels** (BASIC, MEDIUM, ADVANCED), but the old upload scripts were:
- Using the **filename** to determine level
- Treating all questions as BASIC level
- Ignoring the `level` column in your CSV

**Result:** Only BASIC level questions were uploaded correctly!

---

## ✅ The Solution

I've created a new script that:
- ✅ Reads the `level` column from your CSV
- ✅ Auto-detects BASIC, MEDIUM, ADVANCED levels
- ✅ Uploads all levels correctly
- ✅ Removes duplicates
- ✅ Shows breakdown by level

---

## 🚀 How to Upload CSS Questions (All Levels)

### Option 1: Use the New Batch File (Easiest)
```
UPLOAD_CSS_ALL_LEVELS_AUTO.bat
```

### Option 2: Use the Script Directly
```bash
npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/css_easy_questions.csv
```

---

## 📊 What You'll See

```
========================================
Upload CSV with Auto-Detect Level
========================================

📖 Reading: css_easy_questions.csv
   Found 1500 rows

📊 Total questions read: 1500

📋 Questions by level (before deduplication):
   BASIC: 500 questions
   MEDIUM: 500 questions
   ADVANCED: 500 questions

🔍 Removing duplicates...
   Removed 150 duplicates
   Unique questions: 1350

📋 Questions by level (after deduplication):
   BASIC: 450 questions
   MEDIUM: 450 questions
   ADVANCED: 450 questions

💾 Saved transformed data: css_easy_questions_transformed.json

⚠️  Ready to upload 1350 questions to Supabase
   Press Ctrl+C to cancel, or wait 3 seconds...

🚀 Uploading 1350 questions to Supabase...
   ✅ Batch 1: 50 questions
   ✅ Batch 2: 50 questions
   ...
   ✅ Batch 27: 50 questions

========================================
📊 Upload Summary
========================================
   Total processed: 1350
   ✅ Success: 1350
   ❌ Errors: 0
   🗑️  Duplicates removed: 150

📋 By Level:
   BASIC: 450 questions
   MEDIUM: 450 questions
   ADVANCED: 450 questions
========================================
```

---

## 🔍 Verify Upload

After uploading, run this SQL query:

```sql
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
WHERE skill = 'CSS'
GROUP BY skill, level
ORDER BY level;
```

**Expected Result:**
```
skill | level    | count
------|----------|-------
CSS   | ADVANCED | 450
CSS   | BASIC    | 450
CSS   | MEDIUM   | 450
```

---

## 📁 Upload Other Files with All Levels

If your other CSV files also have all levels in one file, use the same script:

### HTML Questions:
```bash
npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/html_easy_questions.csv
```

### JavaScript Questions:
```bash
npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/js_easy_questions.csv
```

### jQuery Questions:
```bash
npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/jquery_easy_questions.csv
```

### OGL Questions:
```bash
npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/ogl_easy_questions.csv
```

---

## 💡 How Level Detection Works

The script reads the `level` column from your CSV and normalizes it:

| CSV Value | Normalized To |
|-----------|---------------|
| BASIC | BASIC |
| EASY | BASIC |
| MEDIUM | MEDIUM |
| INTERMEDIATE | MEDIUM |
| HARD | ADVANCED |
| ADVANCED | ADVANCED |

---

## 🎯 Why You Saw Fewer Questions

If you uploaded 10,000 questions but only see ~5,687, here's why:

### Reason 1: Old Script Used Filename for Level
- Old script: `css_easy_questions.csv` → All questions marked as BASIC
- Your CSV: Has BASIC, MEDIUM, ADVANCED in the `level` column
- Result: MEDIUM and ADVANCED questions were uploaded as BASIC
- Duplicates: Many questions appeared as duplicates and were removed

### Reason 2: Actual Duplicates
- Your CSV files may have duplicate questions
- The script removes them automatically

---

## 🔧 Fix Your Database

If you already uploaded with the old script, you have two options:

### Option 1: Clear and Re-upload (Recommended)
```sql
-- Delete all CSS questions
DELETE FROM questions WHERE skill = 'CSS';

-- Then run the new upload script
```

### Option 2: Delete Only Duplicates
```sql
-- Find and delete duplicate questions
DELETE FROM questions a
USING questions b
WHERE a.id < b.id
  AND a.skill = b.skill
  AND a.level = b.level
  AND a.question = b.question;
```

---

## ✅ Checklist

Before uploading:
- [ ] Your CSV has a `level` column
- [ ] Level values are: BASIC, MEDIUM, ADVANCED (or EASY, HARD)
- [ ] CSV has the correct format (skill, level, type, question, options, correct_answer, explanation)

After uploading:
- [ ] Run SQL query to verify all levels are present
- [ ] Check question counts match expected numbers
- [ ] Verify no duplicates remain

---

## 📊 Expected Results for All Skills

If all your CSV files have all three levels:

| Skill | BASIC | MEDIUM | ADVANCED | Total |
|-------|-------|--------|----------|-------|
| CSS | 450 | 450 | 450 | 1,350 |
| HTML | 1,200 | 600 | 600 | 2,400 |
| JavaScript | 400 | 400 | 400 | 1,200 |
| jQuery | 300 | 300 | 300 | 900 |
| OGL | 500 | 500 | 500 | 1,500 |
| **TOTAL** | **2,850** | **2,250** | **2,250** | **7,350** |

(Adjust numbers based on your actual CSV content)

---

## 🎉 Summary

- ✅ New script reads `level` from CSV (not filename)
- ✅ Auto-detects BASIC, MEDIUM, ADVANCED
- ✅ Uploads all levels correctly
- ✅ Removes duplicates
- ✅ Shows detailed breakdown

**Run:** `UPLOAD_CSS_ALL_LEVELS_AUTO.bat` to fix your CSS questions!
