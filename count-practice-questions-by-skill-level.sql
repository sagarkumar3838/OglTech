-- ============================================
-- COUNT QUESTIONS IN PRACTICE TABLE BY SKILL AND LEVEL
-- ============================================

-- Count for each skill at each level
SELECT
  skill,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy_count,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium_count,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard_count,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total_count
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- DETAILED VIEW - Each skill+level combination
-- ============================================

SELECT
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- SUMMARY STATISTICS
-- ============================================

SELECT
  COUNT(DISTINCT skill) as total_skills,
  COUNT(*) as total_questions,
  COUNT(DISTINCT level) as unique_levels,
  STRING_AGG(DISTINCT level, ', ' ORDER BY level) as all_levels
FROM practice_questions;

-- ============================================
-- LEVEL DISTRIBUTION
-- ============================================

SELECT
  level,
  COUNT(*) as question_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM practice_questions
GROUP BY level
ORDER BY question_count DESC;
