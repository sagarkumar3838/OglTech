-- ============================================
-- DIAGNOSE AWS SPLIT ISSUE
-- ============================================

-- View 1: Show ALL AWS variations in database
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE LOWER(skill) LIKE '%aws%'
GROUP BY skill, level
ORDER BY skill, 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
    ELSE 4
  END;

-- View 2: Summary by skill name (case-sensitive)
SELECT 
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total_count
FROM practice_questions
WHERE LOWER(skill) LIKE '%aws%'
GROUP BY skill
ORDER BY skill;

-- View 3: Show exact skill names with quotes
SELECT DISTINCT 
  skill,
  '"' || skill || '"' as quoted_skill,
  level,
  '"' || level || '"' as quoted_level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%aws%'
GROUP BY skill, level
ORDER BY skill, level;

-- View 4: Check for case variations
SELECT 
  CASE 
    WHEN skill = 'aws' THEN '✅ Correct: aws (lowercase)'
    WHEN skill = 'Aws' THEN '❌ Wrong: Aws (capital A)'
    WHEN skill = 'AWS' THEN '❌ Wrong: AWS (all caps)'
    ELSE '❓ Unknown: ' || skill
  END as skill_status,
  CASE 
    WHEN level = 'beginner' THEN '✅ Correct: beginner'
    WHEN level = 'Beginner' THEN '❌ Wrong: Beginner (capital B)'
    WHEN level = 'intermediate' THEN '✅ Correct: intermediate'
    WHEN level = 'Intermediate' THEN '❌ Wrong: Intermediate (capital I)'
    WHEN level = 'advanced' THEN '✅ Correct: advanced'
    WHEN level = 'Advanced' THEN '❌ Wrong: Advanced (capital A)'
    ELSE '❓ Unknown: ' || level
  END as level_status,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%aws%'
GROUP BY skill, level
ORDER BY skill, level;
