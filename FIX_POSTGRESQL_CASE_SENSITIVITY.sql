-- ============================================================================
-- FIX POSTGRESQL CASE SENSITIVITY ISSUE
-- ============================================================================
-- Problem: Questions are split between "postgresql" and "PostgreSQL"
-- Solution: Merge all under lowercase "postgresql"
-- ============================================================================

-- STEP 1: See the current split
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE '%postgre%'
GROUP BY skill, level
ORDER BY skill, level;

-- Current state:
-- postgresql  | intermediate | 75
-- PostgreSQL  | advanced     | 10
-- PostgreSQL  | beginner     | 6
-- PostgreSQL  | intermediate | 43


-- STEP 2: Update all to lowercase "postgresql"
-- ============================================================================
UPDATE practice_questions
SET skill = 'postgresql'
WHERE skill ILIKE '%postgre%'
  AND skill != 'postgresql';

-- This will change "PostgreSQL" → "postgresql"


-- STEP 3: Verify the merge
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as count
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY skill, level
ORDER BY 
    CASE level
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
    END;

-- Expected result:
-- postgresql | beginner     | 6
-- postgresql | intermediate | 118 (75 + 43)
-- postgresql | advanced     | 10


-- STEP 4: Check for invalid answers
-- ============================================================================
SELECT 
    level,
    COUNT(*) as total,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY level
ORDER BY level;


-- STEP 5: Delete questions with invalid answers (OPTIONAL)
-- ============================================================================
-- If you want to remove questions with invalid correct_answer values:

/*
DELETE FROM practice_questions
WHERE skill = 'postgresql'
  AND correct_answer NOT IN ('A', 'B', 'C', 'D');
*/


-- ============================================================================
-- FINAL STATUS
-- ============================================================================
-- After running this, your UI should show:
-- Beginner: 6 (need 94 more)
-- Intermediate: 118 (18 MORE than target of 100!)
-- Advanced: 10 (need 90 more)
-- ============================================================================
