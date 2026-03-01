# Upload Questions to Supabase - SOLUTION

## Problem Identified ✅
Your database is **EMPTY** (0 questions). That's why Practice page shows nothing.

You have CSV files in `questions/` folder but they're not in the database yet.

## Solution: Upload Questions

### Option 1: Use Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** > **questions** table
4. Click **Insert** > **Import data from CSV**
5. Upload one CSV file at a time from `questions/` folder
6. Start with: `questions/javascript-beginner.csv`

### Option 2: Use Upload Script

Run this command:
```bash
cd client
npm run upload-questions
```

If that doesn't work, try:
```bash
npx tsx ../scripts/upload-all-questions.ts
```

### Option 3: Manual SQL Insert (Quick Test)

To quickly test with a few questions, run this SQL in Supabase SQL Editor:

```sql
-- Insert 5 JavaScript easy MCQ questions for testing
INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation)
VALUES 
(
  'javascript',
  'easy',
  'mcq',
  'What is the correct syntax for referring to an external script called "app.js"?',
  '["<script src=\"app.js\">", "<script href=\"app.js\">", "<script name=\"app.js\">", "<script file=\"app.js\">"]',
  0,
  'The src attribute specifies the URL of an external script file.'
),
(
  'javascript',
  'easy',
  'mcq',
  'How do you create a function in JavaScript?',
  '["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"]',
  0,
  'Functions are declared using the function keyword followed by the function name and parentheses.'
),
(
  'javascript',
  'easy',
  'mcq',
  'How do you call a function named "myFunction"?',
  '["myFunction()", "call myFunction()", "call function myFunction()", "execute myFunction()"]',
  0,
  'Functions are called by writing the function name followed by parentheses.'
),
(
  'javascript',
  'easy',
  'mcq',
  'How to write an IF statement in JavaScript?',
  '["if (i == 5)", "if i = 5 then", "if i == 5 then", "if (i = 5)"]',
  0,
  'IF statements use the if keyword followed by a condition in parentheses.'
),
(
  'javascript',
  'easy',
  'mcq',
  'How does a WHILE loop start?',
  '["while (i <= 10)", "while i = 1 to 10", "while (i <= 10; i++)", "while i <= 10"]',
  0,
  'WHILE loops use the while keyword followed by a condition in parentheses.'
);
```

After running this, refresh the Practice page and you should see 5 questions!

## Verify Upload

After uploading, run this SQL to verify:

```sql
-- Check total questions
SELECT COUNT(*) FROM questions;

-- Check JavaScript easy MCQ
SELECT COUNT(*) FROM questions
WHERE skill = 'javascript' AND level = 'easy' AND type = 'mcq';

-- View sample questions
SELECT id, skill, level, question 
FROM questions 
LIMIT 5;
```

## Next Steps

1. **Quick Test**: Run the manual SQL insert above (5 questions)
2. **Verify**: Go to http://localhost:3001/practice
3. **Full Upload**: Upload all CSV files from `questions/` folder
4. **Check**: Go to http://localhost:3001/practice-debug to verify

The Practice page will work once questions are in the database!
