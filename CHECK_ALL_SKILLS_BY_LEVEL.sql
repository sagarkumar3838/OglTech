-- ============================================
-- CHECK ALL SKILLS BY LEVEL - COMPREHENSIVE VIEW
-- ============================================

-- View 1: Matrix view - Each skill with beginner/intermediate/advanced counts
SELECT
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total_count
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- View 2: Detailed list - Each skill+level combination
SELECT
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
    ELSE 4
  END;

-- View 3: Skills with incomplete levels (missing beginner/intermediate/advanced)
WITH skill_levels AS (
  SELECT
    skill,
    COUNT(DISTINCT level) as level_count,
    STRING_AGG(DISTINCT level, ', ' ORDER BY level) as available_levels,
    COUNT(*) as total_questions
  FROM practice_questions
  GROUP BY skill
)
SELECT
  skill,
  level_count,
  available_levels,
  total_questions,
  CASE
    WHEN level_count < 3 THEN '⚠️ INCOMPLETE'
    ELSE '✅ COMPLETE'
  END as status
FROM skill_levels
ORDER BY level_count ASC, skill;

-- View 4: Summary statistics
SELECT
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT CASE WHEN level = 'beginner' THEN skill END) as skills_with_beginner,
  COUNT(DISTINCT CASE WHEN level = 'intermediate' THEN skill END) as skills_with_intermediate,
  COUNT(DISTINCT CASE WHEN level = 'advanced' THEN skill END) as skills_with_advanced,
  COUNT(*) as total_questions
FROM practice_questions;

-- View 5: Level distribution across all skills
SELECT
  level,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as skills_count,
  ROUND(AVG(cnt), 2) as avg_questions_per_skill
FROM (
  SELECT skill, level, COUNT(*) as cnt
  FROM practice_questions
  GROUP BY skill, level
) sub
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
    ELSE 4
  END;

-- View 6: Top 10 skills by total questions
SELECT
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
  COUNT(*) as total
FROM practice_questions
GROUP BY skill
ORDER BY COUNT(*) DESC
LIMIT 10;

-- View 7: Skills with least questions (need more content)
SELECT
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
  COUNT(*) as total
FROM practice_questions
GROUP BY skill
ORDER BY COUNT(*) ASC
LIMIT 10;
