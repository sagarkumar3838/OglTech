-- ============================================================
-- FIX CYPRESS DUPLICATES - Remove existing cypress questions
-- ============================================================
-- This will remove ALL cypress beginner questions so you can
-- re-upload the corrected CSV file
-- ============================================================

-- Step 1: Check how many cypress beginner questions exist
SELECT COUNT(*) as total_cypress_beginner
FROM practice_questions
WHERE skill = 'cypress' AND level = 'beginner';

-- Step 2: Delete ALL cypress beginner questions
DELETE FROM practice_questions
WHERE skill = 'cypress' AND level = 'beginner';

-- Step 3: Verify deletion
SELECT COUNT(*) as remaining_cypress_beginner
FROM practice_questions
WHERE skill = 'cypress' AND level = 'beginner';

-- Expected result: 0 questions remaining
