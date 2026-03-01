-- Count all questions in practice_questions table grouped by skill and level

SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Total count across all skills and levels
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT level) as total_levels
FROM practice_questions;

-- Count by skill only (all levels combined)
SELECT 
  skill,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY skill
ORDER BY total_questions DESC;

-- Count by level only (all skills combined)
SELECT 
  level,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY level
ORDER BY 
  CASE 
    WHEN level = 'Basic' THEN 1
    WHEN level = 'Intermediate' THEN 2
    WHEN level = 'Advanced' THEN 3
    ELSE 4
  END;

-- Show which skill-level combinations are missing or have few questions
SELECT 
  skill,
  level,
  COUNT(*) as question_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ No questions'
    WHEN COUNT(*) < 10 THEN '⚠️ Less than 10'
    WHEN COUNT(*) < 20 THEN '✓ 10-19 questions'
    ELSE '✅ 20+ questions'
  END as status
FROM practice_questions
GROUP BY skill, level
ORDER BY question_count ASC, skill, level;
