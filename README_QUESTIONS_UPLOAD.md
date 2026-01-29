# 📚 Questions Upload - Master Guide

## 🎯 What You Want to Do

Upload questions for **all 5 skills** at **all 3 levels**:
- HTML, CSS, JavaScript, jQuery, OGL
- BASIC, MEDIUM, ADVANCED levels
- Total: **750 questions**

---

## ⚡ Fastest Way (3 Steps)

### 1️⃣ Generate Questions (10 min)

Open: `GENERATE_ALL_SKILLS_ALL_LEVELS.md`

Copy the mega prompt → Paste into ChatGPT → Get 750 questions

### 2️⃣ Save to CSV Files (5 min)

Create 15 CSV files in `client/dist/assets/`:
- `html_basic_questions.csv`, `html_medium_questions.csv`, `html_advanced_questions.csv`
- `css_basic_questions.csv`, `css_medium_questions.csv`, `css_advanced_questions.csv`
- `javascript_basic_questions.csv`, `javascript_medium_questions.csv`, `javascript_advanced_questions.csv`
- `jquery_basic_questions.csv`, `jquery_medium_questions.csv`, `jquery_advanced_questions.csv`
- `ogl_basic_questions.csv`, `ogl_medium_questions.csv`, `ogl_advanced_questions.csv`

Add header to each file:
```
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
```

### 3️⃣ Upload Everything (5 min)

Double-click:
```
UPLOAD_EVERYTHING.bat
```

**Done!** 750 questions uploaded.

---

## 📁 All Upload Options

### Option 1: Upload Everything at Once ⭐
```
UPLOAD_EVERYTHING.bat
```
Uploads all 5 skills, all 3 levels (750 questions)

### Option 2: Upload One Skill at a Time
```
UPLOAD_ALL_HTML_LEVELS.bat      (150 questions)
UPLOAD_ALL_CSS_LEVELS.bat       (150 questions)
UPLOAD_ALL_JS_LEVELS.bat        (150 questions)
UPLOAD_ALL_JQUERY_LEVELS.bat    (150 questions)
UPLOAD_ALL_OGL_LEVELS.bat       (150 questions)
```

### Option 3: Upload Your Existing CSV Files
```
UPLOAD_ALL_EXISTING_CSV.bat
```
Uploads: ogl_easy_questions.csv, jquery_easy_questions.csv, js_easy_questions.csv, css_easy_questions.csv, html_basic_new_batch_1_unique.csv

---

## 📖 Documentation Files

### Quick Start:
- ⭐ **README_QUESTIONS_UPLOAD.md** (this file) - Start here
- ⭐ **GENERATE_ALL_SKILLS_ALL_LEVELS.md** - ChatGPT mega prompt
- ⭐ **COMPLETE_WORKFLOW_ALL_SKILLS.md** - Step-by-step workflow

### ChatGPT Prompts:
- **QUICK_CHATGPT_COMMANDS.txt** - Ready-to-use prompts for each skill
- **CHATGPT_MEGA_PROMPT_ALL_LEVELS.md** - Advanced prompts and tips

### Guides:
- **EASIEST_WAY_TO_ADD_QUESTIONS.md** - General guide
- **ADD_MORE_QUESTIONS_GUIDE.md** - How to add more questions later
- **UPLOAD_EXISTING_CSV_GUIDE.md** - Upload existing CSV files
- **UPLOAD_SUMMARY.md** - Summary of upload process

### Technical:
- **CSV_VS_SUPABASE_FORMAT.md** - Format comparison
- **CSS_QUESTIONS_ANALYSIS.md** - Analysis of CSV issues

---

## 📊 Expected Results

After uploading, you'll have:

| Skill | BASIC | MEDIUM | ADVANCED | Total |
|-------|-------|--------|----------|-------|
| HTML | 50 | 50 | 50 | 150 |
| CSS | 50 | 50 | 50 | 150 |
| JavaScript | 50 | 50 | 50 | 150 |
| jQuery | 50 | 50 | 50 | 150 |
| OGL | 50 | 50 | 50 | 150 |
| **TOTAL** | **250** | **250** | **250** | **750** |

---

## 🔍 Verify Upload

### Method 1: Supabase Dashboard
1. Go to Supabase Dashboard
2. Table Editor → `questions` table
3. Filter by skill and level

### Method 2: SQL Query
Run in Supabase SQL Editor:
```sql
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

---

## 💡 Common Scenarios

### Scenario 1: I want to upload everything at once
✅ Use: `UPLOAD_EVERYTHING.bat`

### Scenario 2: I want to upload one skill at a time
✅ Use: `UPLOAD_ALL_HTML_LEVELS.bat` (or CSS, JS, jQuery, OGL)

### Scenario 3: I already have some CSV files
✅ Use: `UPLOAD_ALL_EXISTING_CSV.bat`

### Scenario 4: I want to add more questions later
✅ Generate with ChatGPT → Save to CSV → Run upload script again

### Scenario 5: I want questions for a specific topic
✅ Use prompts from `QUICK_CHATGPT_COMMANDS.txt`

---

## 🛠️ What the Scripts Do

All upload scripts automatically:
1. ✅ Read CSV files
2. ✅ Remove duplicate questions
3. ✅ Transform to Supabase format:
   - Convert "Multiple Choice" → "mcq"
   - Generate unique question_id
   - Convert options to JSON array
   - Normalize level names (EASY → BASIC)
4. ✅ Upload to database in batches
5. ✅ Show detailed summary

---

## ⚠️ Important Notes

### CSV Format
Your CSV must have this header:
```
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
```

### Duplicate Detection
Duplicates are detected by:
- Same skill (e.g., "CSS")
- Same level (e.g., "BASIC")
- Same question text (case-insensitive)

### Safe to Re-run
You can run upload scripts multiple times:
- Duplicates are automatically removed
- Only unique questions are uploaded
- Existing questions in database are not affected

---

## 🚀 Quick Start Commands

### Generate All Questions:
1. Open `GENERATE_ALL_SKILLS_ALL_LEVELS.md`
2. Copy mega prompt to ChatGPT
3. Save responses to 15 CSV files

### Upload All Questions:
```
UPLOAD_EVERYTHING.bat
```

### Verify Upload:
Check Supabase Dashboard → questions table

---

## 📞 Need Help?

Check these files:
- **COMPLETE_WORKFLOW_ALL_SKILLS.md** - Detailed workflow
- **UPLOAD_EXISTING_CSV_GUIDE.md** - Troubleshooting guide
- **CSV_VS_SUPABASE_FORMAT.md** - Format issues

---

## ✅ You're Ready!

Follow the 3-step process above and you'll have 750 questions in your database in about 20 minutes!

**Start here:** `GENERATE_ALL_SKILLS_ALL_LEVELS.md`
