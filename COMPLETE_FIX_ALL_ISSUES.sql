-- ============================================================================
-- COMPLETE FIX FOR ALL SKILLS - CASE SENSITIVITY + INVALID ANSWERS
-- ============================================================================
-- This script fixes BOTH issues at once:
-- 1. Case sensitivity (TypeScript vs typescript)
-- 2. Invalid correct_answer values (text instead of A/B/C/D)
-- ============================================================================

-- STEP 1: Normalize all skill names to lowercase
-- ============================================================================
UPDATE practice_questions
SET skill = LOWER(skill);

-- This fixes: "TypeScript" → "typescript", "ReactJS" → "react", etc.


-- STEP 2: Check current status (before cleaning)
-- ============================================================================
SELECT 
    skill,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_total,
    COUNT(CASE WHEN level = 'beginner' AND correct_answer IN ('A','B','C','D') THEN 1 END) as beginner_valid,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_total,
    COUNT(CASE WHEN level = 'intermediate' AND correct_answer IN ('A','B','C','D') THEN 1 END) as intermediate_valid,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_total,
    COUNT(CASE WHEN level = 'advanced' AND correct_answer IN ('A','B','C','D') THEN 1 END) as advanced_valid,
    COUNT(*) as total,
    COUNT(CASE WHEN correct_answer IN ('A','B','C','D') THEN 1 END) as valid,
    COUNT(CASE WHEN correct_answer NOT IN ('A','B','C','D') THEN 1 END) as invalid
FROM practice_questions
GROUP BY skill
ORDER BY skill;


-- STEP 3: DELETE ALL INVALID QUESTIONS
-- ============================================================================
-- Uncomment to execute:

/*
DELETE FROM practice_questions
WHERE correct_answer NOT IN ('A', 'B', 'C', 'D');
*/


-- STEP 4: Final status check
-- ============================================================================
SELECT 
    skill,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
    COUNT(*) as total,
    CASE 
        WHEN COUNT(*) >= 300 THEN '✅ COMPLETE'
        WHEN COUNT(*) >= 200 THEN '⚠️ NEEDS MORE'
        ELSE '❌ INCOMPLETE'
    END as status
FROM practice_questions
GROUP BY skill
ORDER BY skill;


-- STEP 5: Summary of what needs to be added
-- ============================================================================
SELECT 
    skill,
    100 - COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_needed,
    100 - COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_needed,
    100 - COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_needed,
    300 - COUNT(*) as total_needed
FROM practice_questions
GROUP BY skill
HAVING COUNT(*) < 300
ORDER BY COUNT(*) ASC;


-- ============================================================================
-- WHAT THIS DOES:
-- ============================================================================
-- ✅ Fixes case sensitivity (all skills lowercase)
-- ✅ Removes invalid questions (only A/B/C/D answers remain)
-- ✅ Shows you exactly what's needed for each skill
-- ============================================================================
