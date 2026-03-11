# Fix Constraint Error - Quick Solution

## 🚨 The Problem

You got this error:
```
ERROR: 23514: new row for relation "practice_questions" violates check constraint "practice_questions_question_type_check"
```

## ✅ The Solution (2 Steps)

### Step 1: Fix the Constraint
Run this SQL in Supabase SQL Editor:

```sql
-- Drop the old constraint
ALTER TABLE practice_questions 
DROP CONSTRAINT IF EXISTS practice_questions_question_type_check;

-- Add the correct constraint
ALTER TABLE practice_questions
ADD CONSTRAINT check_question_type 
CHECK (question_type IN ('single', 'multiple'));
```

**OR** just run this file:
```
FIX_QUESTION_TYPE_CONSTRAINT.sql
```

### Step 2: Run the Fixed Migration
Now run the corrected migration:

```
add-multiple-correct-answers-support-FIXED.sql
```

## 🔍 What Happened?

Your table already had a `question_type` column with a CHECK constraint, but the original migration tried to add it again with a different constraint name, causing a conflict.

The fixed version:
- ✅ Checks if columns exist before adding them
- ✅ Drops old constraints before adding new ones
- ✅ Handles existing data properly
- ✅ Won't cause errors if run multiple times

## 📝 After Running the Fix

1. Test with: `test-multiple-answers.sql`
2. Upload questions: `npm run upload:multiple-answers`
3. Check the results:
   ```sql
   SELECT 
     question_type,
     COUNT(*) as count
   FROM practice_questions
   GROUP BY question_type;
   ```

## 🎯 Quick Commands

```bash
# 1. Fix constraint (run in Supabase)
FIX_QUESTION_TYPE_CONSTRAINT.sql

# 2. Run fixed migration (run in Supabase)
add-multiple-correct-answers-support-FIXED.sql

# 3. Test it
test-multiple-answers.sql

# 4. Upload questions
npm run upload:multiple-answers questions/docker-beginner.csv
```

## ✅ Verification

After running both SQL files, verify success:

```sql
-- Check columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'practice_questions' 
AND column_name IN ('correct_answers', 'question_type');

-- Check constraint
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'practice_questions' 
AND constraint_name LIKE '%question_type%';

-- Check data
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE question_type = 'single') as single,
  COUNT(*) FILTER (WHERE question_type = 'multiple') as multiple
FROM practice_questions;
```

## 🚨 If You Still Get Errors

Try this nuclear option (backs up and recreates):

```sql
-- Backup your data first!
CREATE TABLE practice_questions_backup AS 
SELECT * FROM practice_questions;

-- Drop all constraints
ALTER TABLE practice_questions 
DROP CONSTRAINT IF EXISTS practice_questions_question_type_check;

ALTER TABLE practice_questions 
DROP CONSTRAINT IF EXISTS check_question_type;

-- Now run: add-multiple-correct-answers-support-FIXED.sql
```

---

**TL;DR**: Run `FIX_QUESTION_TYPE_CONSTRAINT.sql` then `add-multiple-correct-answers-support-FIXED.sql`
