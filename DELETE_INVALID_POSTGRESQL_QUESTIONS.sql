-- ============================================================================
-- DELETE INVALID POSTGRESQL INTERMEDIATE QUESTIONS
-- ============================================================================
-- This script removes 45 questions with invalid correct_answer values
-- (they have text like "Comparison", "Features" instead of A, B, C, or D)
-- ============================================================================

-- STEP 1: Preview what will be deleted (RUN THIS FIRST!)
-- ============================================================================
SELECT 
    id,
    question_text,
    correct_answer,
    created_at
FROM practice_questions
WHERE skill = 'postgresql' 
  AND level = 'intermediate'
  AND correct_answer NOT IN ('A', 'B', 'C', 'D')
ORDER BY id;

-- Expected: 45 rows


-- STEP 2: Delete the invalid questions (RUN THIS AFTER REVIEWING)
-- ============================================================================
-- UNCOMMENT THE LINES BELOW TO DELETE:

/*
DELETE FROM practice_questions
WHERE skill = 'postgresql' 
  AND level = 'intermediate'
  AND correct_answer NOT IN ('A', 'B', 'C', 'D');
*/

-- Expected result: 45 rows deleted


-- STEP 3: Verify deletion
-- ============================================================================
SELECT 
    COUNT(*) as total_questions,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid_answers,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid_answers
FROM practice_questions
WHERE skill = 'postgresql' 
  AND level = 'intermediate';

-- Expected: 
-- total_questions: 118 (163 - 45)
-- valid_answers: 118
-- invalid_answers: 0


-- STEP 4: Check final count
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY skill, level
ORDER BY level;

-- Expected:
-- postgresql | beginner     | 6
-- postgresql | intermediate | 118
-- postgresql | advanced     | 10
