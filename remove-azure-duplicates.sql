-- Remove Duplicate Azure Advanced Questions
-- This will keep only the FIRST occurrence of each unique question

-- Step 1: Show what will be deleted (RUN THIS FIRST TO VERIFY)
SELECT 
  'Questions to be deleted' as action,
  COUNT(*) as count
FROM practice_questions p1
WHERE skill = 'Azure' AND level = 'Advanced'
  AND id NOT IN (
    SELECT MIN(id)
    FROM practice_questions
    WHERE skill = 'Azure' AND level = 'Advanced'
    GROUP BY question_text
  );

-- Step 2: Show sample of questions that will be kept
SELECT 
  'Sample of questions to KEEP' as info,
  id,
  LEFT(question_text, 80) as question_preview
FROM practice_questions
WHERE id IN (
  SELECT MIN(id)
  FROM practice_questions
  WHERE skill = 'Azure' AND level = 'Advanced'
  GROUP BY question_text
)
ORDER BY id
LIMIT 10;

-- Step 3: DELETE duplicates (UNCOMMENT TO EXECUTE)
-- WARNING: This will permanently delete duplicate records!
/*
DELETE FROM practice_questions
WHERE id IN (
  SELECT id FROM (
    SELECT p1.id
    FROM practice_questions p1
    WHERE p1.skill = 'Azure' AND p1.level = 'Advanced'
      AND p1.id NOT IN (
        SELECT MIN(p2.id)
        FROM practice_questions p2
        WHERE p2.skill = 'Azure' AND p2.level = 'Advanced'
        GROUP BY p2.question_text
      )
  ) AS duplicates_to_delete
);
*/

-- Step 4: Verify after deletion (RUN AFTER STEP 3)
SELECT 
  'After cleanup' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';
