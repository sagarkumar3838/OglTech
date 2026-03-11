-- Diagnose Skill Name Case Sensitivity Issues
-- This helps identify mismatches between database and frontend expectations

-- 1. Show all unique skill names (case-sensitive)
SELECT 
  'All Unique Skills' as check_name,
  skill,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- 2. Find skills with mixed case
SELECT 
  'Skills with Case Variations' as check_name,
  LOWER(skill) as skill_lowercase,
  STRING_AGG(DISTINCT skill, ', ') as variations,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY LOWER(skill)
HAVING COUNT(DISTINCT skill) > 1;

-- 3. Check GCP specifically
SELECT 
  'GCP Case Analysis' as check_name,
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level
ORDER BY skill, level;

-- 4. Show skills that might have case issues (contain uppercase)
SELECT 
  'Skills with Uppercase Letters' as check_name,
  skill,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill != LOWER(skill)
GROUP BY skill
ORDER BY skill;

-- 5. Recommended standard format (all lowercase)
SELECT 
  'Recommended Format' as check_name,
  LOWER(skill) as skill_lowercase,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY LOWER(skill)
ORDER BY LOWER(skill);
