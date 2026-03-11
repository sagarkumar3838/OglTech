-- ============================================
-- FIX ALL CASE SENSITIVITY ISSUES IN DATABASE
-- ============================================

-- This will standardize ALL skills and levels to lowercase
-- to prevent duplicate entries due to case differences

-- Step 1: Show current case sensitivity issues
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY LOWER(skill), LOWER(level);

-- Step 2: Standardize ALL skills and levels to lowercase
UPDATE practice_questions
SET 
  skill = LOWER(skill),
  level = LOWER(level);

-- Step 3: Verify standardization
SELECT 
  'After Standardization' as status,
  COUNT(DISTINCT skill) as unique_skills,
  COUNT(DISTINCT level) as unique_levels,
  COUNT(*) as total_questions
FROM practice_questions;

-- Step 4: Check for duplicates created by the merge
WITH duplicates AS (
  SELECT 
    skill,
    level,
    question_text,
    COUNT(*) as duplicate_count
  FROM practice_questions
  GROUP BY skill, level, question_text
  HAVING COUNT(*) > 1
)
SELECT 
  skill,
  level,
  COUNT(*) as questions_with_duplicates,
  SUM(duplicate_count) as total_duplicate_rows
FROM duplicates
GROUP BY skill, level
ORDER BY total_duplicate_rows DESC;

-- Step 5: Remove ALL duplicates (keeps the most recent one)
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY skill, level, question_text 
             ORDER BY created_at DESC
           ) as rn
    FROM practice_questions
  ) t
  WHERE rn > 1
);

-- Step 6: Final summary by skill and level
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Step 7: Total count
SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(*) as total_questions
FROM practice_questions;
