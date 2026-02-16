-- ========================================
-- ABSOLUTELY FINAL FIX - ONE SOLUTION
-- ========================================
-- Problem: All data is in practice_questions table
-- Solution: Copy to questions table with level conversion
-- ========================================

-- STEP 1: Check what we have
SELECT '=== BEFORE FIX ===' as status;
SELECT 'practice_questions' as table_name, COUNT(*) as count FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as count FROM questions;

-- STEP 2: Clear questions table
TRUNCATE TABLE questions;

-- STEP 3: Copy ALL data from practice_questions to questions
-- This uses ONLY the columns that exist in questions table
INSERT INTO questions (skill, level)
SELECT 
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level
FROM practice_questions;

-- STEP 4: Verify
SELECT '=== AFTER FIX ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

SELECT '=== LEVELS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

SELECT '=== DEVTOOLS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level;

SELECT '=== ALL SKILLS (sample) ===' as status;
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level
LIMIT 30;

-- ========================================
-- If you get an error about missing columns,
-- run FIND_ACTUAL_COLUMN_NAMES.sql first
-- to see what columns questions table actually has
-- ========================================
