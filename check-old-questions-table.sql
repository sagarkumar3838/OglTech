-- Check if old questions table has data and what format it uses
SELECT 
  skill,
  level,
  COUNT(*) as question_count,
  COUNT(CASE WHEN options IS NOT NULL THEN 1 END) as mcq_count,
  COUNT(CASE WHEN options IS NULL THEN 1 END) as non_mcq_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- Sample a few questions to see the format
SELECT 
  id,
  skill,
  level,
  question_text,
  options,
  correct_answer
FROM questions
WHERE skill = 'javascript' AND level = 'beginner'
LIMIT 5;
