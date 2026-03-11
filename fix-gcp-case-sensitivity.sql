-- Fix GCP Case Sensitivity Issue
-- The database has "GCP" (uppercase) but frontend expects "gcp" (lowercase)

-- Option 1: Update database to use lowercase (RECOMMENDED)
-- This matches the pattern used by other skills
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Verify the fix
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level
ORDER BY skill, level;

-- Check all skills to ensure consistency
SELECT 
  skill,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY skill
ORDER BY skill;
