-- Check React questions in database
SELECT 
    skill,
    level,
    COUNT(*) as total_questions
FROM practice_questions
WHERE skill = 'react'
GROUP BY skill, level
ORDER BY level;

-- Show sample questions
SELECT 
    skill,
    level,
    question_text,
    correct_answer
FROM practice_questions
WHERE skill = 'react'
LIMIT 10;
