# 🔧 Fix Column Names Issue

## Problem
The SQL is failing because the column names in your `practice_questions` table don't match what we expected.

## Solution (3 steps)

### Step 1: Find Your Column Names

Run this in Supabase SQL Editor:

```sql
-- See what columns you have
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;
```

### Step 2: See Sample Data

```sql
-- See actual data
SELECT * FROM practice_questions LIMIT 2;
```

### Step 3: Tell Me Your Column Names

After running the above, you'll see column names like:
- `id`
- `skill`
- `level`
- `question_text` (or `question`?)
- `options` (or `choices`?)
- `answer` (or `correct_answer`?)
- `explanation`
- `topic`

**Share the column names you see**, and I'll create the exact SQL for you!

---

## Quick Diagnostic

Or run this complete diagnostic:

```sql
-- Run this in Supabase
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;
```

Then:

```sql
-- See sample data
SELECT * FROM practice_questions LIMIT 1;
```

---

## Common Column Name Variations

Your table might have:

| Expected | Actual Might Be |
|----------|----------------|
| `question` | `question_text`, `text`, `q_text` |
| `correct_answer` | `answer`, `correct`, `solution` |
| `explanation` | `explain`, `description` |
| `topic` | `subject`, `category` |
| `options` | `choices`, `answers` |

---

## Alternative: Use File

Run this file to see everything:

```
AUTO_GENERATE_COPY_SQL.sql
```

Or this simpler one:

```
FIND_COLUMN_NAMES.sql
```

---

## What I Need From You

After running the diagnostic SQL above, share:

1. **Column names** from `practice_questions` table
2. **Sample row** of data (just one row)

Then I'll create the exact SQL that will work!

---

## Files Created

- `FIND_COLUMN_NAMES.sql` - Simple diagnostic
- `AUTO_GENERATE_COPY_SQL.sql` - Complete diagnostic
- `UNIVERSAL_COPY_QUESTIONS.sql` - Template with different versions
- `FIX_COLUMN_NAMES_ISSUE.md` - This guide

---

## Quick Example

If your columns are:
- `question_text` instead of `question`
- `answer` instead of `correct_answer`

Then the SQL would be:

```sql
INSERT INTO questions (skill, level, type, question, options, correct_answer)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,
  pq.question_text as question,  -- ← Changed
  pq.options,
  pq.answer as correct_answer    -- ← Changed
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question_text
);
```

---

## Next Steps

1. Run `FIND_COLUMN_NAMES.sql` in Supabase
2. Share the output
3. I'll create the correct SQL
4. You run it
5. Done! ✅
