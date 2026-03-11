-- ============================================
-- FIX CASE SENSITIVITY - SAFE VERSION
-- ============================================
-- This removes duplicates FIRST, then standardizes case

-- Step 1: Identify duplicates that will conflict
SELECT 
  LOWER(skill) as skill_lower,
  LOWER(level) as level_lower,
  LOWER(question_text) as question_lower,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as all_ids
FROM practice_questions
GROUP BY LOWER(skill), LOWER(level), LOWER(question_text)
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- Step 2: Delete duplicates BEFORE updating case
-- Keep the most recent one (highest created_at)
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY LOWER(skill), LOWER(level), LOWER(question_text)
             ORDER BY created_at DESC NULLS LAST, id DESC
           ) as rn
    FROM practice_questions
  ) t
  WHERE rn > 1
);

-- Step 3: Now safely standardize to lowercase
UPDATE practice_questions
SET 
  skill = LOWER(skill),
  level = LOWER(level);

-- Step 4: Verify the fix
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY skill, level;

-- Step 5: Check total Angular questions
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'angular'
GROUP BY level
ORDER BY level;

-- Step 6: Overall summary
SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(*) as total_questions
FROM practice_questions;
