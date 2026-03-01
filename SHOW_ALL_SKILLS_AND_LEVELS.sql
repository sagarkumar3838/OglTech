-- Show all skills with their 3 levels and question counts

-- Summary: Count questions by skill and level
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
    ELSE 4
  END;

-- Total questions per skill (all levels combined)
SELECT 
  skill,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic_count,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced_count
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Overall statistics
SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as total_basic,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as total_intermediate,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as total_advanced
FROM practice_questions;

-- Skills with incomplete levels (missing Basic, Intermediate, or Advanced)
SELECT 
  skill,
  CASE WHEN SUM(CASE WHEN level = 'Basic' THEN 1 ELSE 0 END) = 0 THEN 'Missing Basic' ELSE '✓' END as basic_status,
  CASE WHEN SUM(CASE WHEN level = 'Intermediate' THEN 1 ELSE 0 END) = 0 THEN 'Missing Intermediate' ELSE '✓' END as intermediate_status,
  CASE WHEN SUM(CASE WHEN level = 'Advanced' THEN 1 ELSE 0 END) = 0 THEN 'Missing Advanced' ELSE '✓' END as advanced_status
FROM practice_questions
GROUP BY skill
HAVING 
  SUM(CASE WHEN level = 'Basic' THEN 1 ELSE 0 END) = 0 OR
  SUM(CASE WHEN level = 'Intermediate' THEN 1 ELSE 0 END) = 0 OR
  SUM(CASE WHEN level = 'Advanced' THEN 1 ELSE 0 END) = 0
ORDER BY skill;
