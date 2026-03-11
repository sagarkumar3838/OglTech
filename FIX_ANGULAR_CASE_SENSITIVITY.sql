-- ============================================
-- FIX ANGULAR CASE SENSITIVITY ISSUE
-- ============================================

-- Problem: You have both 'angular'/'Advanced' and 'Angular'/'advanced'
-- This creates duplicate entries due to case sensitivity

-- Step 1: Check the current situation
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'angular' AND LOWER(level) = 'advanced'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Standardize to lowercase for both skill and level
-- This will merge all Angular advanced questions into one consistent format

UPDATE practice_questions
SET 
  skill = LOWER(skill),
  level = LOWER(level)
WHERE LOWER(skill) = 'angular' AND LOWER(level) = 'advanced';

-- Step 3: Verify the fix
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY skill, level;

-- Step 4: Check for duplicates after merge
SELECT 
  question_text,
  COUNT(*) as duplicate_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY question_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;

-- Step 5: Remove duplicates if any exist
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY skill, level, question_text ORDER BY created_at DESC) as rn
    FROM practice_questions
    WHERE skill = 'angular' AND level = 'advanced'
  ) t
  WHERE rn > 1
);

-- Step 6: Final count
SELECT 
  'Final Angular Advanced Count' as status,
  COUNT(*) as total_questions
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced';
