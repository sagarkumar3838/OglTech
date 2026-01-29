# Upload Mixed Question Types (MCQ + Fill in the Blank)

## ✅ Good News!

Your CSV files contain **two types of questions**:
1. **Multiple Choice (MCQ)** - Questions with 4 options
2. **Fill in the Blank** - Questions with a blank to fill

The upload scripts now handle **both types automatically**!

---

## 📋 CSV Format Examples

### Multiple Choice Questions:
```csv
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
HTML,BASIC,Multiple Choice,What does HTML stand for?,HyperText Markup Language,HighText Machine Language,HyperText Machine Language,HighText Markup Language,HyperText Markup Language,HTML stands for HyperText Markup Language.
```

### Fill in the Blank Questions:
```csv
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
HTML,BASIC,Fill in the Blank,HTML onseeking attribute defines _____.,,,,,onseeking,onseeking triggers when seeking begins.
```

**Note:** Fill in the blank questions have empty option columns (,,,) which is correct!

---

## 🔄 How the Script Handles Both Types

### For Multiple Choice (MCQ):
```javascript
type: "mcq"
options: ["option_a", "option_b", "option_c", "option_d"]
correct_answer: "option_a"  // The correct option text
```

### For Fill in the Blank:
```javascript
type: "fill_blank"
options: []  // Empty array (no options needed)
correct_answer: "onseeking"  // The word/phrase to fill in
```

---

## 🚀 Upload Your Questions

Your files contain both types, so just run:

```
UPLOAD_ALL_EXISTING_CSV.bat
```

This will upload:
1. ✅ `ogl_easy_questions.csv` (MCQ)
2. ✅ `jquery_easy_questions.csv` (MCQ)
3. ✅ `js_easy_questions.csv` (MCQ)
4. ✅ `css_easy_questions.csv` (MCQ)
5. ✅ `html_basic_new_batch_1_unique.csv` (MCQ + Fill in the Blank)
6. ✅ `html_fillblank_questions.csv` (Fill in the Blank)

The script automatically:
- Detects question type from the CSV
- Converts "Multiple Choice" → "mcq"
- Converts "Fill in the Blank" → "fill_blank"
- Handles empty option columns for fill-in-the-blank
- Removes duplicates
- Uploads to Supabase

---

## 📊 What Gets Uploaded

### Supabase Database Format:

**MCQ Question:**
```json
{
  "question_id": "html_basic_1769353214354_0",
  "skill": "HTML",
  "level": "BASIC",
  "type": "mcq",
  "question": "What does HTML stand for?",
  "options": [
    "HyperText Markup Language",
    "HighText Machine Language",
    "HyperText Machine Language",
    "HighText Markup Language"
  ],
  "correct_answer": "HyperText Markup Language",
  "explanation": "HTML stands for HyperText Markup Language."
}
```

**Fill in the Blank Question:**
```json
{
  "question_id": "html_basic_1769353214354_1",
  "skill": "HTML",
  "level": "BASIC",
  "type": "fill_blank",
  "question": "HTML onseeking attribute defines _____.",
  "options": [],
  "correct_answer": "onseeking",
  "explanation": "onseeking triggers when seeking begins."
}
```

---

## 🎯 Verify Upload

After uploading, check Supabase:

### SQL Query to See Question Types:
```sql
SELECT skill, level, type, COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level, type;
```

Expected result:
```
skill | level | type       | count
------|-------|------------|-------
HTML  | BASIC | mcq        | 80
HTML  | BASIC | fill_blank | 20
CSS   | BASIC | mcq        | 65
...
```

---

## 💡 Generate More Fill-in-the-Blank Questions

### ChatGPT Prompt:
```
Generate 30 HTML fill-in-the-blank questions in CSV format.

Format:
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation

Example:
HTML,BASIC,Fill in the Blank,The _____ tag is used to create a hyperlink.,,,,,a,The <a> tag creates hyperlinks in HTML.

Requirements:
- Use _____ to indicate the blank
- Leave option_a, option_b, option_c, option_d empty (,,,)
- correct_answer should be the word/phrase to fill in
- Include explanation

Generate 30 questions now.
```

Then:
1. Save to CSV file
2. Add to existing CSV or create new file
3. Run upload script

---

## 🔧 Supported Question Types

Your Supabase schema supports these types:

1. ✅ **mcq** - Multiple Choice (4 options)
2. ✅ **fill_blank** - Fill in the Blank (no options)
3. ⚠️ **multi_select** - Multiple correct answers (not yet in your CSV)
4. ⚠️ **coding** - Code writing questions (not yet in your CSV)
5. ⚠️ **matching** - Match pairs (not yet in your CSV)

---

## 📝 CSV Format Rules

### For Multiple Choice:
- type: "Multiple Choice" or "mcq"
- Must have option_a, option_b, option_c, option_d
- correct_answer must match one of the options

### For Fill in the Blank:
- type: "Fill in the Blank" or "fill_blank"
- Leave option columns empty: ,,,
- correct_answer is the word/phrase to fill in
- Use _____ in the question to show where the blank is

---

## ✅ Ready to Upload!

Your CSV files are correctly formatted with both question types. Just run:

```
UPLOAD_ALL_EXISTING_CSV.bat
```

The script will handle everything automatically!

---

## 🎉 Summary

- ✅ Scripts updated to handle MCQ + Fill in the Blank
- ✅ Your CSV files are correctly formatted
- ✅ Empty option columns for fill-in-the-blank are handled
- ✅ Both types will upload to Supabase correctly
- ✅ Ready to run: `UPLOAD_ALL_EXISTING_CSV.bat`
