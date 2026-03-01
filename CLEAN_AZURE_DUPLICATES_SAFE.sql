-- SAFE Azure Advanced Duplicate Removal
-- This script removes duplicates while keeping the first occurrence

-- ============================================================
-- STEP 1: DIAGNOSE THE PROBLEM
-- ============================================================

-- Count total vs unique
SELECT 
  'Current State' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions,
  COUNT(*) - COUNT(DISTINCT question_text) as duplicates_to_remove
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';

-- Show top duplicates
SELECT 
  LEFT(question_text, 100) as question,
  COUNT(*) as times_duplicated
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
GROUP BY question_text
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC
LIMIT 10;

-- ============================================================
-- STEP 2: DELETE DUPLICATES (KEEPS FIRST OCCURRENCE)
-- ============================================================

-- Delete all duplicate rows, keeping only the row with the smallest ID
DELETE FROM practice_questions
WHERE id IN (
  -- Select all IDs that are NOT the minimum ID for their question_text
  SELECT p1.id
  FROM practice_questions p1
  INNER JOIN (
    -- Get the minimum ID for each unique question
    SELECT question_text, MIN(id) as min_id
    FROM practice_questions
    WHERE skill = 'Azure' AND level = 'Advanced'
    GROUP BY question_text
  ) p2 ON p1.question_text = p2.question_text
  WHERE p1.skill = 'Azure' 
    AND p1.level = 'Advanced'
    AND p1.id > p2.min_id  -- Keep only the first occurrence
);

-- ============================================================
-- STEP 3: VERIFY THE CLEANUP
-- ============================================================

-- Check final count
SELECT 
  'After Cleanup' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT question_text) THEN '✅ No duplicates'
    ELSE '⚠️ Still has duplicates'
  END as result
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';

-- Show sample of remaining questions
SELECT 
  id,
  LEFT(question_text, 80) as question_preview,
  topic
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
ORDER BY id
LIMIT 10;

-- Final summary for all Azure levels
SELECT 
  level,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions
FROM practice_questions
WHERE skill = 'Azure'
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
    ELSE 4
  END;
