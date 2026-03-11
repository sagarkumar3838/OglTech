-- ============================================================================
-- CLEAN ALL INVALID ANSWERS FROM DATABASE
-- ============================================================================
-- This removes ALL questions with invalid correct_answer values
-- (anything that's not A, B, C, or D)
-- ============================================================================

-- STEP 1: See how many invalid questions exist
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as total_questions,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid
FROM practice_questions
GROUP BY skill, level
HAVING COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) > 0
ORDER BY skill, level;


-- STEP 2: See what the invalid values are
-- ============================================================================
SELECT 
    skill,
    correct_answer,
    COUNT(*) as count
FROM practice_questions
WHERE correct_answer NOT IN ('A', 'B', 'C', 'D')
GROUP BY skill, correct_answer
ORDER BY skill, count DESC
LIMIT 50;


-- STEP 3: DELETE ALL INVALID QUESTIONS
-- ============================================================================
-- WARNING: This will delete ALL questions with invalid correct_answer!
-- Uncomment to run:

/*
DELETE FROM practice_questions
WHERE correct_answer NOT IN ('A', 'B', 'C', 'D');
*/


-- STEP 4: Verify deletion
-- ============================================================================
SELECT 
    skill,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
    COUNT(*) as total,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as still_invalid
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Expected: still_invalid = 0 for all skills


-- ============================================================================
-- AFTER RUNNING THIS:
-- ============================================================================
-- 1. All invalid questions will be removed
-- 2. Only questions with A/B/C/D answers remain
-- 3. Your UI will show correct counts
-- 4. You'll need to generate NEW questions to fill gaps
-- ============================================================================
