# 🔧 Complete Guide: Fix Java Questions Not Showing

## Problem
Java questions are stored in a **separate table** but the Practice page only looks in the `questions` table.

---

## Solution Overview

You have 3 options:

### Option 1: Copy Questions to Main Table (RECOMMENDED) ⭐
Copy Java questions from the separate table into the main `questions` table.

### Option 2: Merge Tables
Merge the separate table into the main `questions` table.

### Option 3: Update Code
Modify the code to look in multiple tables (complex, not recommended).

---

## Option 1: Copy Questions to Main Table (EASIEST)

### Step 1: Find Your Separate Table Name

Run this in Supabase SQL Editor to find all tables:

```sql
-- List all tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Look for tables like:
- `java_questions`
- `practice_questions_java`
- `questions_java`
- Or any table with "java" in the name

### Step 2: Check the Separate Table Structure

Replace `YOUR_TABLE_NAME` with the actual table name:

```sql
-- Check what columns exist in your Java table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'YOUR_TABLE_NAME'
ORDER BY ordinal_position;
```

### Step 3: Copy Questions to Main Table

**If your separate table has the SAME structure as `questions` table:**

```sql
-- Copy all Java questions to main questions table
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  'java' as skill,  -- Force skill to be 'java'
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,  -- Normalize level
  COALESCE(type, 'mcq') as type,  -- Default to 'mcq'
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM YOUR_TABLE_NAME
WHERE NOT EXISTS (
  -- Avoid duplicates
  SELECT 1 FROM questions q 
  WHERE q.question = YOUR_TABLE_NAME.question
);
```

**If your separate table has DIFFERENT column names:**

First, check what columns it has:

```sql
-- See sample data from your Java table
SELECT * FROM YOUR_TABLE_NAME LIMIT 3;
```

Then map the columns correctly:

```sql
-- Example: If your table has different column names
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  'java' as skill,
  CASE 
    WHEN difficulty = 'beginner' THEN 'easy'
    WHEN difficulty = 'intermediate' THEN 'medium'
    WHEN difficulty = 'advanced' THEN 'hard'
    ELSE 'easy'
  END as level,
  'mcq' as type,
  question_text as question,  -- Map your column name
  answer_options as options,   -- Map your column name
  correct_option as correct_answer,  -- Map your column name
  explanation_text as explanation,  -- Map your column name
  category as topic  -- Map your column name
FROM YOUR_TABLE_NAME;
```

### Step 4: Verify Questions Were Copied

```sql
-- Check if Java questions are now in main table
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'java'
GROUP BY skill, level, type;
```

Expected result:
```
skill | level  | type | count
------|--------|------|------
java  | easy   | mcq  | 10+
java  | medium | mcq  | 10+
java  | hard   | mcq  | 10+
```

---

## Option 2: Merge Tables (If You Want to Clean Up)

### Step 1: Backup Your Data First!

```sql
-- Create a backup of your Java questions
CREATE TABLE java_questions_backup AS 
SELECT * FROM YOUR_TABLE_NAME;
```

### Step 2: Copy Questions (Same as Option 1, Step 3)

```sql
-- Copy questions to main table
INSERT INTO questions (...)
SELECT ... FROM YOUR_TABLE_NAME;
```

### Step 3: Verify Everything Works

Test in the Practice page first!

### Step 4: Delete the Separate Table (OPTIONAL)

**⚠️ ONLY DO THIS AFTER VERIFYING EVERYTHING WORKS!**

```sql
-- Drop the separate table (CAREFUL!)
DROP TABLE YOUR_TABLE_NAME;
```

---

## Option 3: Update Code (Advanced, Not Recommended)

This requires modifying the application code to check multiple tables. Not recommended because:
- More complex
- Slower performance
- Harder to maintain

---

## Quick Fix Script (Copy-Paste Ready)

### Script 1: Find Your Java Table

```sql
-- Find tables with 'java' in the name
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name ILIKE '%java%'
ORDER BY table_name;
```

### Script 2: Check Java Table Structure

```sql
-- Replace 'YOUR_TABLE_NAME' with actual table name
SELECT * FROM YOUR_TABLE_NAME LIMIT 5;
```

### Script 3: Copy to Main Table (Generic)

```sql
-- STEP 1: Check what you're about to copy
SELECT 
  'java' as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  type,
  question,
  COUNT(*) as count
FROM YOUR_TABLE_NAME
GROUP BY skill, level, type, question
LIMIT 10;

-- STEP 2: If it looks good, copy everything
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  'java' as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  COALESCE(type, 'mcq') as type,
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM YOUR_TABLE_NAME
ON CONFLICT (question) DO NOTHING;  -- Avoid duplicates if question is unique
```

### Script 4: Verify

```sql
-- Check if Java questions are now visible
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'java'
GROUP BY skill, level, type
ORDER BY level;
```

---

## Common Issues & Solutions

### Issue 1: "Column doesn't exist"

**Problem**: Your separate table has different column names.

**Solution**: Check column names first:

```sql
-- See all columns in your Java table
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'YOUR_TABLE_NAME';
```

Then map them correctly in the INSERT statement.

### Issue 2: "Duplicate key violation"

**Problem**: Questions already exist in main table.

**Solution**: Add `ON CONFLICT DO NOTHING`:

```sql
INSERT INTO questions (...)
SELECT ... FROM YOUR_TABLE_NAME
ON CONFLICT (id) DO NOTHING;
```

Or skip duplicates:

```sql
INSERT INTO questions (...)
SELECT ... FROM YOUR_TABLE_NAME
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = YOUR_TABLE_NAME.question
);
```

### Issue 3: "Options format is wrong"

**Problem**: Options might be stored as text instead of JSON.

**Solution**: Convert to proper format:

```sql
-- If options are stored as comma-separated text
INSERT INTO questions (...)
SELECT 
  'java' as skill,
  level,
  'mcq' as type,
  question,
  -- Convert "A,B,C,D" to ["A","B","C","D"]
  ('["' || REPLACE(options, ',', '","') || '"]')::jsonb as options,
  correct_answer,
  explanation,
  topic
FROM YOUR_TABLE_NAME;
```

---

## Testing Checklist

After copying questions:

- [ ] Run verification query (Script 4)
- [ ] Go to Practice page: http://localhost:3000/practice
- [ ] Select "Java" from dropdown
- [ ] Select "Beginner" level
- [ ] Questions should load
- [ ] Try answering a question
- [ ] Submit test
- [ ] Check scorecard displays

---

## Rollback (If Something Goes Wrong)

If you need to undo:

```sql
-- Delete Java questions from main table
DELETE FROM questions WHERE skill = 'java';

-- Restore from backup (if you created one)
INSERT INTO YOUR_TABLE_NAME
SELECT * FROM java_questions_backup;
```

---

## Summary

### Quick Steps:

1. **Find your Java table name**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name ILIKE '%java%';
   ```

2. **Check its structure**
   ```sql
   SELECT * FROM YOUR_TABLE_NAME LIMIT 3;
   ```

3. **Copy to main table**
   ```sql
   INSERT INTO questions (...) SELECT ... FROM YOUR_TABLE_NAME;
   ```

4. **Verify**
   ```sql
   SELECT COUNT(*) FROM questions WHERE skill = 'java';
   ```

5. **Test in app**
   - Go to Practice page
   - Select Java → Beginner
   - Questions should load

---

## Need Help?

If you're stuck:

1. Run Script 1 to find your table name
2. Share the table name with me
3. Run `SELECT * FROM YOUR_TABLE_NAME LIMIT 3;`
4. Share the output
5. I'll give you the exact SQL to copy questions

---

**Time Required**: 5-10 minutes
**Difficulty**: Easy (just copy-paste SQL)
**Risk**: Low (we can rollback if needed)
