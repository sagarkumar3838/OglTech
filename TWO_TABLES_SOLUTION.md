# You Have TWO Question Tables!

## The Situation

You have TWO different tables in your database:

### 1. `practice_questions` table
- Levels: **Basic**, **Intermediate**, **Advanced**
- This is where we uploaded the 9,464 questions
- Has 453 questions currently

### 2. `questions` table  
- Levels: **basic**, **medium**, **hard** (lowercase)
- This is what your SQL query is checking
- Different naming convention

## Why You See Different Results

When you run:
```sql
SELECT * FROM questions WHERE skill = 'devtools' AND level = 'basic';
```

It checks the `questions` table (lowercase levels), not `practice_questions` table!

## Quick Fix

Run this SQL to copy all data from `practice_questions` to `questions`:

```sql
-- Clear questions table
DELETE FROM questions;

-- Copy with level conversion
INSERT INTO questions (
  skill, level, question_text, option_a, option_b, option_c, option_d,
  correct_answer, explanation, topic, mdn_link, 
  youtube_english, youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu
)
SELECT 
  skill,
  CASE level
    WHEN 'Basic' THEN 'basic'
    WHEN 'Intermediate' THEN 'medium'
    WHEN 'Advanced' THEN 'hard'
  END as level,
  question_text, option_a, option_b, option_c, option_d,
  correct_answer, explanation, topic, mdn_link,
  youtube_english, youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu
FROM practice_questions;

-- Verify
SELECT COUNT(*) FROM questions;
-- Should show: 9464

SELECT level, COUNT(*) FROM questions 
WHERE skill = 'Devtools' 
GROUP BY level;
-- Should show:
-- basic: 95
-- medium: 248
-- hard: 110
```

## Or Use the File

Run this SQL file: `COPY_PRACTICE_TO_QUESTIONS.sql`

It will:
1. Clear the `questions` table
2. Copy all 9,464 questions from `practice_questions`
3. Convert levels: Basic→basic, Intermediate→medium, Advanced→hard
4. Verify the copy worked

## After Running

Your `questions` table will have:
- 9,464 total questions
- Levels: basic, medium, hard
- Devtools: 95 basic, 248 medium, 110 hard

## Files

- `CHECK_BOTH_TABLES.sql` - Check both tables
- `COPY_PRACTICE_TO_QUESTIONS.sql` - Copy data (RUN THIS!)
- `SYNC_TABLES_EXPLANATION.md` - Detailed explanation
- `TWO_TABLES_SOLUTION.md` - This file
