# 📤 Upload CSV Questions to Supabase

## You Have CSV Files Ready!

I can see you have CSV files for many skills in the `questions/` folder. Let's upload them to Supabase.

## Method 1: Use Upload Script (Recommended)

### Step 1: Update Upload Script

The script `scripts/upload-all-questions.ts` can upload all your CSV files.

### Step 2: Run Upload

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Install dependencies if needed
npm install

# Run the upload script
npx tsx scripts/upload-all-questions.ts
```

This will:
- Read all CSV files from `questions/` folder
- Convert to proper format
- Upload to Supabase `questions` table

## Method 2: Manual Upload via Supabase Dashboard

### Step 1: Prepare CSV Format

Your CSV should have these columns:
```
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english
```

### Step 2: Convert to SQL

Use this template for each row:

```sql
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation, mdn_link, youtube_english)
VALUES 
  (
    'SKILL-LEVEL-' || gen_random_uuid()::text,
    'SKILL',
    'LEVEL',
    'mcq',
    'QUESTION TEXT',
    '["OPTION_A", "OPTION_B", "OPTION_C", "OPTION_D"]',
    'CORRECT_INDEX',  -- 0 for A, 1 for B, 2 for C, 3 for D
    'EXPLANATION',
    'MDN_LINK',
    'YOUTUBE_LINK'
  );
```

### Step 3: Upload to Supabase

1. Go to Supabase SQL Editor
2. Paste your SQL
3. Click "Run"

## Method 3: Quick Bulk Upload

### For Each Skill:

1. Open CSV file (e.g., `questions/html-beginner.csv`)
2. Convert to SQL format
3. Upload to Supabase

### Example: HTML Beginner

```sql
-- Upload HTML Beginner Questions
INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation)
VALUES 
  ('html-easy-001', 'html', 'easy', 'mcq', 
   'What does HTML stand for?',
   '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]',
   '0',
   'HTML stands for Hyper Text Markup Language.'),
  
  ('html-easy-002', 'html', 'easy', 'mcq',
   'Which HTML element is used for the largest heading?',
   '["<h1>", "<h6>", "<head>", "<heading>"]',
   '0',
   'The <h1> element defines the most important heading.'),
  
  -- Add more questions...
;
```

## Skills You Have CSV Files For:

Based on your file list, you have questions for:
- ✅ HTML (beginner, intermediate, advanced)
- ✅ CSS (beginner, intermediate, advanced)
- ✅ JavaScript (beginner, intermediate, advanced)
- ✅ TypeScript (beginner, intermediate, advanced)
- ✅ React (beginner, intermediate, advanced)
- ✅ Angular (beginner, intermediate, advanced)
- ✅ Python (beginner, intermediate, advanced)
- ✅ Java (beginner, intermediate, advanced)
- ✅ Node.js (beginner, intermediate, advanced)
- ✅ And many more...

## Recommended Approach

### Step 1: Clean Database First

Run `cleanup-and-upload-questions.sql` to remove skills without enough questions.

### Step 2: Upload Priority Skills

Start with most popular skills:
1. HTML
2. CSS
3. JavaScript
4. Python
5. React

### Step 3: Verify Each Upload

After uploading each skill:

```sql
SELECT level, COUNT(*) 
FROM questions 
WHERE skill = 'SKILLNAME' AND type = 'mcq'
GROUP BY level;
```

Expected:
```
level  | count
-------|------
easy   | 10+
medium | 10+
hard   | 10+
```

### Step 4: Test in Practice Page

1. Refresh http://localhost:3000/practice
2. Check if skill appears in dropdown
3. Test taking a practice test

## Quick Upload Template

For each CSV file, use this pattern:

```sql
-- Skill: SKILLNAME
-- Level: LEVEL (easy/medium/hard)

INSERT INTO questions (id, skill, level, type, question, options, correct_answer, explanation)
SELECT 
  'SKILLNAME-LEVEL-' || row_number() OVER ()::text,
  'SKILLNAME',
  'LEVEL',
  'mcq',
  question_text,
  jsonb_build_array(option_a, option_b, option_c, option_d),
  correct_answer_index,
  explanation
FROM (VALUES
  ('Question 1?', 'Option A', 'Option B', 'Option C', 'Option D', '0', 'Explanation 1'),
  ('Question 2?', 'Option A', 'Option B', 'Option C', 'Option D', '1', 'Explanation 2'),
  -- Add more rows...
) AS t(question_text, option_a, option_b, option_c, option_d, correct_answer_index, explanation);
```

## Need Help?

If you want me to:
1. Convert specific CSV files to SQL
2. Create upload scripts for specific skills
3. Help with bulk upload

Just let me know which skills you want to upload first!

## Summary

**Easiest Method**: Use the TypeScript upload script
```bash
npx tsx scripts/upload-all-questions.ts
```

**Manual Method**: Convert CSV to SQL and run in Supabase SQL Editor

**Result**: Skills automatically appear in Practice page dropdown!
