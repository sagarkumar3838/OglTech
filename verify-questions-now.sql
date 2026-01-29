-- Quick verification of questions in database
SELECT COUNT(*) as total_questions FROM questions;

SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- Show sample questions
SELECT skill, level, question, type 
FROM questions 
LIMIT 10;
