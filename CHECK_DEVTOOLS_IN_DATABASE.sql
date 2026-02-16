-- Check what's currently in the database for DevTools

-- 1. Count all DevTools questions
SELECT COUNT(*) as total_devtools_questions
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%';

-- 2. Count by level
SELECT level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY level;

-- 3. Show all DevTools questions (first 10)
SELECT id, skill, level, question_text, created_at
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%'
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check for exact skill name variations
SELECT DISTINCT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level
ORDER BY skill, level;

-- 5. Check total questions in database
SELECT COUNT(*) as total_all_questions
FROM practice_questions;
