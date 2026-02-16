-- ========================================
-- DIAGNOSE LEVEL CONSTRAINT ISSUE
-- ========================================

-- 1. Check what constraint exists on the level column
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'practice_questions'::regclass
  AND conname LIKE '%level%';

-- 2. Check what level values currently exist in the database
SELECT DISTINCT level, COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- 3. Show the table definition
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'practice_questions'
  AND column_name = 'level';

-- ========================================
-- SOLUTION: Drop the constraint or change CSV files
-- ========================================

-- Option 1: Drop the constraint (if it exists)
-- ALTER TABLE practice_questions DROP CONSTRAINT IF EXISTS practice_questions_level_check;

-- Option 2: Check what values the constraint allows
-- Then we'll fix the CSV files to match
