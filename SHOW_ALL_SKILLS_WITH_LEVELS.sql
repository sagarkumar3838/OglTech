-- ========================================
-- SHOW ALL SKILLS WITH LEVELS
-- ========================================

-- From practice_questions table (where your data is)
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, 
  CASE 
    WHEN LOWER(level) = 'basic' THEN 1
    WHEN LOWER(level) = 'beginner' THEN 1
    WHEN LOWER(level) = 'intermediate' THEN 2
    WHEN LOWER(level) = 'advanced' THEN 3
    WHEN LOWER(level) = 'easy' THEN 1
    WHEN LOWER(level) = 'medium' THEN 2
    WHEN LOWER(level) = 'hard' THEN 3
  END;

-- Summary by level
SELECT '=== SUMMARY BY LEVEL ===' as info;
SELECT 
  level,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Total count
SELECT '=== TOTAL ===' as info;
SELECT COUNT(*) as total_questions FROM practice_questions;
