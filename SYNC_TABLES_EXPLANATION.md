# Understanding Your Two Tables

## You Have TWO Question Tables!

### Table 1: `practice_questions`
- Uses levels: **Basic**, **Intermediate**, **Advanced** (capital first letter)
- This is where we've been uploading CSV data
- Has CHECK constraint that accepts these level names

### Table 2: `questions`
- Uses levels: **basic**, **medium**, **hard** (all lowercase)
- This might be your OLD table or a different table
- Different level naming convention

## The Problem

Your SQL query shows you're checking the `questions` table which uses:
- basic (not Basic)
- medium (not Intermediate)
- hard (not Advanced)

But we've been uploading to `practice_questions` table which uses:
- Basic
- Intermediate
- Advanced

## Solution Options

### Option 1: Use practice_questions Table (Recommended)

Update your app to read from `practice_questions` instead of `questions`:

```typescript
// Change this:
const { data } = await supabase.from('questions').select('*');

// To this:
const { data } = await supabase.from('practice_questions').select('*');
```

### Option 2: Copy Data from practice_questions to questions

Run this SQL to copy data and convert level names:

```sql
-- Clear old data
DELETE FROM questions;

-- Copy from practice_questions with level conversion
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
    ELSE level
  END as level,
  question_text, option_a, option_b, option_c, option_d,
  correct_answer, explanation, topic, mdn_link,
  youtube_english, youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu
FROM practice_questions;

-- Verify
SELECT level, COUNT(*) FROM questions GROUP BY level;
```

### Option 3: Upload to questions Table Instead

Change the upload script to use `questions` table and convert levels:

```typescript
// In upload script, change level names:
const question = {
  ...data,
  level: data.level === 'Basic' ? 'basic' 
       : data.level === 'Intermediate' ? 'medium'
       : data.level === 'Advanced' ? 'hard'
       : data.level
};

await supabase.from('questions').insert(question);
```

## Check Which Table Your App Uses

Run this to see which table has data:

```sql
SELECT 'practice_questions' as table_name, COUNT(*) as total 
FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as total 
FROM questions;
```

Then check your app code to see which table it queries!

## Recommendation

1. Check which table your app currently uses
2. If it uses `questions`, run Option 2 to copy data with level conversion
3. If it uses `practice_questions`, you're all set!
4. Make sure both tables use the same level naming convention going forward

## Files

- `CHECK_BOTH_TABLES.sql` - Check both tables
- `COPY_PRACTICE_TO_QUESTIONS.sql` - Copy data between tables
- `SYNC_TABLES_EXPLANATION.md` - This file
