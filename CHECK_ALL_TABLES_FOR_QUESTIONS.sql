-- Check ALL possible tables that might contain questions
-- Run this in Supabase SQL Editor

-- Check questions table
SELECT 'questions' as table_name, COUNT(*) as total_rows
FROM questions
UNION ALL
-- Check practice_questions table
SELECT 'practice_questions' as table_name, COUNT(*) as total_rows
FROM practice_questions;

-- Show what's in practice_questions
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level
LIMIT 50;

-- Show sample data from practice_questions
SELECT 
  id,
  skill,
  level,
  question,
  CASE 
    WHEN options IS NOT NULL THEN 'Has options'
    ELSE 'No options'
  END as options_status,
  correct_answer
FROM practice_questions
LIMIT 5;
