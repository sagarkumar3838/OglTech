-- Check React questions in database with different capitalizations

-- Check with 'React'
SELECT 'React' as test, COUNT(*) as count
FROM practice_questions
WHERE skill = 'React';

-- Check with 'react'
SELECT 'react' as test, COUNT(*) as count
FROM practice_questions
WHERE skill = 'react';

-- Check with 'ReactJS'
SELECT 'ReactJS' as test, COUNT(*) as count
FROM practice_questions
WHERE skill = 'ReactJS';

-- Show all skills that contain 'react' (case insensitive)
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%react%'
GROUP BY skill, level
ORDER BY skill, level;

-- Show ALL distinct skills to see exact names
SELECT DISTINCT skill
FROM practice_questions
ORDER BY skill;
