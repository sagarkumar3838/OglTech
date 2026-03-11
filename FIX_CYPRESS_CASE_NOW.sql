-- ============================================================
-- FIX CYPRESS CASE SENSITIVITY - Merge all to lowercase
-- ============================================================
-- This will convert "Cypress" to "cypress" to merge all questions
-- ============================================================

-- Step 1: Check current state
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'cypress'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Update all "Cypress" to "cypress" (lowercase)
UPDATE practice_questions
SET skill = 'cypress'
WHERE skill = 'Cypress';

-- Step 3: Verify the fix - should only show "cypress" now
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'cypress'
GROUP BY skill, level
ORDER BY level;

-- Expected result after fix:
-- cypress | beginner     | 258
-- cypress | intermediate | 275
-- cypress | advanced     | 184
-- Total: 717 questions
