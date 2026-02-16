-- ========================================
-- CHECK BOTH TABLES: practice_questions AND questions
-- ========================================

-- 1. Count total in each table
SELECT 'practice_questions' as table_name, COUNT(*) as total FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as total FROM questions;

-- 2. Check what levels exist in practice_questions
SELECT 'practice_questions' as table_name, level, COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- 3. Check what levels exist in questions table
SELECT 'questions' as table_name, level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- 4. Check skills and levels in questions table (lowercase levels)
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'basic' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'hard' THEN 3 
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
  END;

-- 5. Check devtools in questions table
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY level;

-- 6. Check devtools in practice_questions table
SELECT level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY level;

-- ========================================
-- UNDERSTANDING YOUR DATABASE
-- ========================================

-- It looks like you have TWO tables:
-- 1. practice_questions - Uses: Basic, Intermediate, Advanced
-- 2. questions - Uses: basic, medium, hard (lowercase)

-- You need to decide which table to use for your app!
