-- ========================================
-- FIX GCP DUPLICATES - PROPER SOLUTION
-- ========================================
-- This handles the duplicate question issue properly

-- Step 1: Diagnose the situation
SELECT 
  'Current State' as status,
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Find exact duplicates (same question text in both GCP and gcp)
SELECT 
  'Duplicate Questions' as status,
  question_text,
  STRING_AGG(DISTINCT skill, ' + ') as skills,
  COUNT(*) as duplicate_count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY question_text
HAVING COUNT(*) > 1
LIMIT 10;

-- Step 3: Delete the uppercase "GCP" versions (keep lowercase "gcp")
-- This removes duplicates and keeps the correct case
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM practice_questions
  WHERE skill = 'GCP'
  AND question_text IN (
    -- Only delete if the same question exists in lowercase
    SELECT question_text
    FROM practice_questions
    WHERE skill = 'gcp'
  )
);

-- Step 4: Now update any remaining "GCP" to "gcp" (non-duplicates)
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Step 5: Verify the fix
SELECT 
  '✅ Final Result' as status,
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'gcp'
GROUP BY skill, level;

-- Step 6: Check for any remaining uppercase
SELECT 
  'Remaining Uppercase' as status,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'GCP';
