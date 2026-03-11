-- Check all skills and their question counts by level
-- This will show which skills need more questions to reach 100+

SELECT 
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total_count,
  CASE 
    WHEN COUNT(*) < 100 THEN '❌ NEEDS MORE (' || (100 - COUNT(*))::text || ' needed)'
    ELSE '✅ COMPLETE'
  END as status
FROM practice_questions
GROUP BY skill
ORDER BY total_count ASC, skill;

-- Show skills missing entire difficulty levels
SELECT 
  skill,
  CASE WHEN COUNT(CASE WHEN level = 'beginner' THEN 1 END) = 0 THEN '❌ Missing Beginner' ELSE '✅' END as has_beginner,
  CASE WHEN COUNT(CASE WHEN level = 'intermediate' THEN 1 END) = 0 THEN '❌ Missing Intermediate' ELSE '✅' END as has_intermediate,
  CASE WHEN COUNT(CASE WHEN level = 'advanced' THEN 1 END) = 0 THEN '❌ Missing Advanced' ELSE '✅' END as has_advanced
FROM practice_questions
GROUP BY skill
HAVING 
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) = 0 OR
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) = 0 OR
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) = 0
ORDER BY skill;

-- Summary statistics
SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT CASE WHEN total >= 100 THEN skill END) as skills_with_100_plus,
  COUNT(DISTINCT CASE WHEN total < 100 THEN skill END) as skills_needing_more
FROM (
  SELECT skill, COUNT(*) as total
  FROM practice_questions
  GROUP BY skill
) subquery;
