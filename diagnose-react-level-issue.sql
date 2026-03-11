-- Diagnose React Level Issue

-- Check what level values exist for ReactJS
SELECT DISTINCT level, COUNT(*) as count
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY level
ORDER BY level;

-- Check all unique level values in the entire table
SELECT DISTINCT level, COUNT(*) as total
FROM practice_questions
GROUP BY level
ORDER BY total DESC;

-- Show sample React questions with their levels
SELECT id, skill, level, question_text
FROM practice_questions
WHERE skill = 'ReactJS'
LIMIT 10;
