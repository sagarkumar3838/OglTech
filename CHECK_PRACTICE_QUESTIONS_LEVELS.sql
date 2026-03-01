-- Check what levels exist in practice_questions table
-- This will help us understand the level naming

SELECT DISTINCT level
FROM practice_questions
ORDER BY level;

-- Check skill + level combinations
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check if Java + Advanced exists
SELECT COUNT(*) as java_advanced_count
FROM practice_questions
WHERE skill = 'java' AND level = 'Advanced';

-- Check if Java + hard exists
SELECT COUNT(*) as java_hard_count
FROM practice_questions
WHERE skill = 'java' AND level = 'hard';
