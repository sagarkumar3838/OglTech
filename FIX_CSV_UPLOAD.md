# Fix CSV Upload to Supabase

## Problem
Your CSV has columns `option_a`, `option_b`, `option_c`, `option_d` but Supabase expects `options` as a JSONB array.

## Solution: Use the Upload Script (Easiest!)

### Method 1: Using TypeScript Script (RECOMMENDED - No Supabase UI Issues!)

This script automatically transforms your CSV columns and uploads to Supabase:

```bash
npm run upload-csv-options ogl_developer_questions_adjusted.csv
```

That's it! The script will:
- Read your CSV with option_a, option_b, option_c, option_d columns
- Transform them into the `options` JSONB array format
- Upload all 45 questions to Supabase
- Show you a progress report

### Method 2: Using SQL Script (If you prefer SQL)

1. **Go to Supabase Dashboard** → SQL Editor

2. **Run this SQL to create temp table:**
```sql
CREATE TEMP TABLE temp_questions_csv (
  question_id TEXT,
  skill TEXT,
  level TEXT,
  type TEXT,
  question TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT,
  explanation TEXT,
  code_snippet TEXT
);
```

3. **Import your CSV:**
   - Go to Table Editor → temp_questions_csv
   - Click "Insert" → "Import data from CSV"
   - Upload your `ogl_developer_questions_adjusted.csv`

4. **Transform and insert into questions table:**
```sql
INSERT INTO questions (
  question_id, skill, level, type, question, options, correct_answer, explanation, code_snippet, verified
)
SELECT 
  question_id, skill, level, type, question,
  jsonb_build_array(option_a, option_b, option_c, option_d) AS options,
  to_jsonb(correct_answer) AS correct_answer,
  explanation, code_snippet, TRUE
FROM temp_questions_csv
ON CONFLICT (question_id) DO UPDATE SET
  skill = EXCLUDED.skill,
  level = EXCLUDED.level,
  question = EXCLUDED.question,
  options = EXCLUDED.options;
```

5. **Verify:**
```sql
SELECT COUNT(*) FROM questions;
SELECT * FROM questions LIMIT 5;
```

### Method 2: Modify Your CSV (Alternative)

If you prefer to modify the CSV file:

1. **Add a new column** called `options`
2. **Combine option_a through option_d** into a JSON array format:
   ```
   ["option_a text", "option_b text", "option_c text", "option_d text"]
   ```
3. **Delete** the old `option_a`, `option_b`, `option_c`, `option_d` columns
4. **Upload** the modified CSV

### Expected CSV Format After Transformation

```csv
question_id,skill,level,type,question,options,correct_answer,explanation,code_snippet
q1,HTML,Beginner,mcq,"What is HTML?","[""HyperText Markup Language"",""High Tech Modern Language"",""Home Tool Markup Language"",""None""]","HyperText Markup Language","HTML stands for...",""
```

## Quick Check

After upload, verify with:
```sql
SELECT question_id, skill, level, jsonb_array_length(options) as option_count 
FROM questions 
LIMIT 10;
```

All questions should show `option_count = 4` (or however many options you have).
