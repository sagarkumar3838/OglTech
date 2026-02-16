-- ========================================
-- CHECK ALL SKILLS AND THEIR LEVELS
-- ========================================

-- 1. Total count in questions table
SELECT 'Total Questions' as info, COUNT(*) as count FROM questions;

-- 2. All unique levels (to see what naming we have)
SELECT DISTINCT level as unique_levels FROM questions ORDER BY level;

-- 3. Count by level
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- 4. ALL SKILLS with their levels - COMPLETE VIEW
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'easy' THEN 1
    WHEN 'basic' THEN 1
    WHEN 'Basic' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'Intermediate' THEN 2
    WHEN 'intermediate' THEN 2
    WHEN 'hard' THEN 3
    WHEN 'Advanced' THEN 3
    WHEN 'advanced' THEN 3
  END;

-- 5. Skills with mixed level naming (PROBLEM DETECTION)
SELECT 
  skill,
  STRING_AGG(DISTINCT level, ', ') as different_levels,
  COUNT(*) as total_questions
FROM questions
GROUP BY skill
HAVING COUNT(DISTINCT level) > 1
ORDER BY skill;

-- 6. Devtools specific check
SELECT 'DEVTOOLS BREAKDOWN' as info;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level
ORDER BY level;
