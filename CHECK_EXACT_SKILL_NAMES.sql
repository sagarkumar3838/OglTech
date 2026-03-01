-- Check the EXACT skill names in practice_questions table
-- This will show us the actual capitalization

SELECT DISTINCT skill
FROM practice_questions
ORDER BY skill
LIMIT 50;

-- Check if Java exists (with different capitalizations)
SELECT 
  'Java (capital J)' as test,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Java';

SELECT 
  'java (lowercase)' as test,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'java';

SELECT 
  'JAVA (uppercase)' as test,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'JAVA';

-- Show all Java questions with their levels
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE skill LIKE '%ava%' OR skill LIKE '%AVA%'
GROUP BY skill, level;
