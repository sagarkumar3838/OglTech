-- Check what Java questions exist in the database
-- Run this in Supabase SQL Editor

-- 1. Check questions table for Java
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
WHERE skill = 'java'
GROUP BY skill, level, type
ORDER BY level, type;

-- 2. Check practice_questions table for Java
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'java'
GROUP BY skill, level, type
ORDER BY level, type;

-- 3. Show sample Java questions from questions table
SELECT 
  id,
  skill,
  level,
  type,
  question,
  CASE 
    WHEN options IS NOT NULL THEN 'Has options'
    ELSE 'No options'
  END as options_status
FROM questions
WHERE skill = 'java'
LIMIT 5;

-- 4. Check if there are any Java questions at all
SELECT COUNT(*) as total_java_questions
FROM questions
WHERE skill = 'java';

-- 5. Check what levels exist for Java
SELECT DISTINCT level
FROM questions
WHERE skill = 'java';
