-- Check what level names are actually in the database

SELECT 
  level,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM practice_questions
GROUP BY level
ORDER BY count DESC;

-- Show which skills have which levels
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;
