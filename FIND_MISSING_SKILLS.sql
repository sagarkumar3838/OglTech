-- Find which skills are missing questions or have wrong names

-- Get all unique skills from database
SELECT DISTINCT skill, COUNT(*) as total_questions
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Check specific skills that might be problematic
SELECT 
  CASE 
    WHEN skill ILIKE 'react' THEN 'React found'
    WHEN skill ILIKE 'node%' THEN 'Node found'
    WHEN skill ILIKE 'c++' THEN 'C++ found'
    WHEN skill ILIKE 'c#' THEN 'C# found'
    ELSE skill
  END as skill_check,
  skill as actual_name,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE 'react'
   OR skill ILIKE 'node%'
   OR skill ILIKE 'c++' 
   OR skill ILIKE 'c#'
   OR skill ILIKE 'vue'
   OR skill ILIKE 'angular'
GROUP BY skill, level
ORDER BY skill, level;
