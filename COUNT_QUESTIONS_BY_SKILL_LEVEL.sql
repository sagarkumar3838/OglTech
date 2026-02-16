-- ============================================
-- COUNT QUESTIONS BY SKILL AND LEVEL
-- ============================================

-- Show count for each skill at each level (easy, medium, hard)
SELECT 
  skill,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy_count,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium_count,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard_count,
  COUNT(*) as total_count
FROM questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- DETAILED VIEW - Show each skill+level combination
-- ============================================

SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'easy' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'hard' THEN 3 
  END;

-- ============================================
-- FIND MISSING LEVELS - Which skills don't have all 3 levels?
-- ============================================

WITH skill_levels AS (
  SELECT 
    skill,
    COUNT(DISTINCT level) as level_count,
    STRING_AGG(DISTINCT level, ', ' ORDER BY level) as available_levels
  FROM questions
  GROUP BY skill
)
SELECT 
  skill,
  level_count,
  available_levels,
  CASE 
    WHEN level_count < 3 THEN '⚠️ INCOMPLETE'
    ELSE '✅ COMPLETE'
  END as status
FROM skill_levels
ORDER BY level_count ASC, skill;

-- ============================================
-- SUMMARY STATISTICS
-- ============================================

SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT CASE WHEN level = 'easy' THEN skill END) as skills_with_easy,
  COUNT(DISTINCT CASE WHEN level = 'medium' THEN skill END) as skills_with_medium,
  COUNT(DISTINCT CASE WHEN level = 'hard' THEN skill END) as skills_with_hard,
  COUNT(*) as total_questions
FROM questions;
