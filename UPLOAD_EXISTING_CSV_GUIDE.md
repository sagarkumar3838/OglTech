# Upload All Existing CSV Files - Quick Guide

## 🚀 One-Click Upload

Simply double-click:
```
UPLOAD_ALL_EXISTING_CSV.bat
```

This will automatically:
1. ✅ Read all 5 CSV files
2. ✅ Remove duplicate questions
3. ✅ Transform to Supabase format
4. ✅ Upload to database

---

## 📁 Files Being Uploaded

The script will process these CSV files:

1. **ogl_easy_questions.csv** → OGL / BASIC level
2. **jquery_easy_questions.csv** → jQuery / BASIC level
3. **js_easy_questions.csv** → JavaScript / BASIC level
4. **css_easy_questions.csv** → CSS / BASIC level
5. **html_basic_new_batch_1_unique.csv** → HTML / BASIC level

---

## 🔍 What the Script Does

### Step 1: Read CSV Files
```
📖 Reading: ogl_easy_questions.csv
   Found 150 rows

📖 Reading: jquery_easy_questions.csv
   Found 80 rows

📖 Reading: js_easy_questions.csv
   Found 120 rows

📖 Reading: css_easy_questions.csv
   Found 110 rows

📖 Reading: html_basic_new_batch_1_unique.csv
   Found 100 rows
```

### Step 2: Remove Duplicates
```
🔍 Removing duplicates...
   Removed 45 duplicates
   Unique questions: 515
```

### Step 3: Group by Skill
```
📋 Questions by skill:
   OGL: 150 questions
   jQuery: 80 questions
   JavaScript: 120 questions
   CSS: 65 questions
   HTML: 100 questions
```

### Step 4: Upload to Supabase
```
🚀 Uploading 515 questions to Supabase...
   ✅ Batch 1: 50 questions
   ✅ Batch 2: 50 questions
   ✅ Batch 3: 50 questions
   ...
   ✅ Batch 11: 15 questions
```

### Step 5: Summary
```
📊 Upload Summary
   Total processed: 515
   ✅ Success: 515
   ❌ Errors: 0
   🗑️  Duplicates removed: 45

📋 By Skill:
   OGL: 150 questions
   jQuery: 80 questions
   JavaScript: 120 questions
   CSS: 65 questions
   HTML: 100 questions
```

---

## 💾 Backup Created

Before uploading, the script saves a JSON backup:
- **Location**: `client/dist/assets/all_questions_merged_transformed.json`
- **Purpose**: Review transformed data before upload

---

## ✅ How Duplicates Are Detected

Duplicates are identified by:
- Same **skill** (e.g., CSS)
- Same **level** (e.g., BASIC)
- Same **question text** (case-insensitive)

Example:
```
Question 1: "What does CSS stand for?" (CSS, BASIC)
Question 2: "What does CSS stand for?" (CSS, BASIC)
→ Duplicate! Only one will be kept.

Question 3: "What does CSS stand for?" (CSS, MEDIUM)
→ Not a duplicate (different level)
```

---

## 🔧 What Gets Transformed

### Before (CSV):
```csv
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
CSS,BASIC,Multiple Choice,What is CSS?,Cascading Style Sheets,Computer Style,Creative Style,Color Style,Cascading Style Sheets,CSS stands for Cascading Style Sheets.
```

### After (Supabase):
```json
{
  "question_id": "css_basic_1769353214354_0",
  "skill": "CSS",
  "level": "BASIC",
  "type": "mcq",
  "question": "What is CSS?",
  "options": ["Cascading Style Sheets", "Computer Style", "Creative Style", "Color Style"],
  "correct_answer": "Cascading Style Sheets",
  "explanation": "CSS stands for Cascading Style Sheets."
}
```

---

## 📊 Expected Results

After running the script, you should have:

- **OGL questions**: ~150 (BASIC level)
- **jQuery questions**: ~80 (BASIC level)
- **JavaScript questions**: ~120 (BASIC level)
- **CSS questions**: ~65 (BASIC level, after removing duplicates)
- **HTML questions**: ~100 (BASIC level)

**Total**: ~515 unique questions

---

## 🔍 Verify Upload

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard
2. Open Table Editor → `questions` table
3. Filter by skill:
   - `skill = 'OGL'` → Should see ~150 questions
   - `skill = 'jQuery'` → Should see ~80 questions
   - `skill = 'JavaScript'` → Should see ~120 questions
   - `skill = 'CSS'` → Should see ~65 questions
   - `skill = 'HTML'` → Should see ~100 questions

### Option 2: SQL Query
Run this in Supabase SQL Editor:
```sql
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

---

## ⚠️ Troubleshooting

### "File not found" error
Make sure these files exist in `client/dist/assets/`:
- ogl_easy_questions.csv
- jquery_easy_questions.csv
- js_easy_questions.csv
- css_easy_questions.csv
- html_basic_new_batch_1_unique.csv

### "Missing Supabase credentials" error
Check your `.env` file has:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Upload errors
If you see errors during upload:
1. Check the error message
2. Common issues:
   - Duplicate question_id (very rare with timestamp-based IDs)
   - Invalid data format
   - Network connection issues
3. The script will continue uploading other batches even if one fails

### Some questions not appearing
1. Check if they were marked as duplicates
2. Review the JSON backup file: `all_questions_merged_transformed.json`
3. Verify the CSV format is correct

---

## 🎯 Next Steps

After uploading:

1. **Verify in Supabase** - Check the questions table
2. **Test in your app** - Try creating an evaluation
3. **Add more questions** - Use the ChatGPT prompts from `QUICK_CHATGPT_COMMANDS.txt`
4. **Add MEDIUM/ADVANCED levels** - Generate questions for other difficulty levels

---

## 💡 Pro Tips

### Add More Files
To upload additional CSV files, edit `scripts/upload-multiple-csv-files.ts`:

```typescript
const csvFiles = [
  // Existing files...
  { path: path.join(assetsDir, 'react_easy_questions.csv'), skill: 'React', level: 'BASIC' },
  { path: path.join(assetsDir, 'python_easy_questions.csv'), skill: 'Python', level: 'BASIC' },
];
```

### Re-run Safely
You can run the script multiple times. It will:
- Skip files that don't exist
- Remove duplicates automatically
- Only upload unique questions

### Backup First
The script automatically creates a JSON backup before uploading, so you can always review what was uploaded.

---

## ✅ Ready to Upload?

Just double-click:
```
UPLOAD_ALL_EXISTING_CSV.bat
```

The script will handle everything automatically!
