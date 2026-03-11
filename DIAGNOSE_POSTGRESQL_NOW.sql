-- ============================================================================
-- DIAGNOSE POSTGRESQL QUESTIONS - WHY ONLY 43 SHOWING?
-- ============================================================================

-- Query 1: Check ALL skill name variations
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE '%postgre%'
GROUP BY skill, level
ORDER BY skill, level;

-- This will show if questions are under "postgresql", "Postgresql", "PostgreSQL", etc.


-- Query 2: Check exact counts
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as total,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid_answers,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid_answers
FROM practice_questions
WHERE skill ILIKE '%postgre%'
GROUP BY skill, level
ORDER BY skill, level;


-- Query 3: Show sample questions to see the data
-- ============================================================================
SELECT 
    id,
    skill,
    level,
    LEFT(question_text, 60) as question,
    correct_answer,
    created_at
FROM practice_questions
WHERE skill ILIKE '%postgre%'
ORDER BY created_at DESC
LIMIT 20;


-- Query 4: Check if there are recent uploads
-- ============================================================================
SELECT 
    DATE(created_at) as upload_date,
    skill,
    level,
    COUNT(*) as questions_uploaded
FROM practice_questions
WHERE skill ILIKE '%postgre%'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), skill, level
ORDER BY upload_date DESC, skill, level;


-- Query 5: Find the invalid correct_answer values
-- ============================================================================
SELECT 
    correct_answer,
    COUNT(*) as count,
    level
FROM practice_questions
WHERE skill ILIKE '%postgre%'
  AND correct_answer NOT IN ('A', 'B', 'C', 'D')
GROUP BY correct_answer, level
ORDER BY count DESC
LIMIT 20;
