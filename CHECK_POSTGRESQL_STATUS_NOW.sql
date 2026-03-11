-- ============================================================================
-- CHECK POSTGRESQL QUESTIONS STATUS
-- ============================================================================

-- STEP 1: Check total count by level
-- ============================================================================
SELECT 
    level,
    COUNT(*) as total_questions,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid_answers,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid_answers
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY level
ORDER BY 
    CASE level
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
    END;


-- STEP 2: Show sample invalid answers
-- ============================================================================
SELECT 
    id,
    LEFT(question_text, 50) as question_preview,
    correct_answer,
    level
FROM practice_questions
WHERE skill = 'postgresql' 
  AND correct_answer NOT IN ('A', 'B', 'C', 'D')
ORDER BY level, id
LIMIT 20;


-- STEP 3: Check if there are questions with BOTH valid and invalid answers
-- ============================================================================
SELECT 
    'Valid (A/B/C/D)' as answer_type,
    level,
    COUNT(*) as count
FROM practice_questions
WHERE skill = 'postgresql' 
  AND correct_answer IN ('A', 'B', 'C', 'D')
GROUP BY level

UNION ALL

SELECT 
    'Invalid (not A/B/C/D)' as answer_type,
    level,
    COUNT(*) as count
FROM practice_questions
WHERE skill = 'postgresql' 
  AND correct_answer NOT IN ('A', 'B', 'C', 'D')
GROUP BY level

ORDER BY level, answer_type;


-- STEP 4: What are the actual correct_answer values?
-- ============================================================================
SELECT 
    correct_answer,
    COUNT(*) as count,
    level
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY correct_answer, level
ORDER BY level, count DESC;
