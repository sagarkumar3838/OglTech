-- Check what's actually in the database
SELECT DISTINCT skill, level FROM questions ORDER BY skill, level;

-- Check HTML specifically
SELECT skill, level, COUNT(*) FROM questions WHERE skill LIKE '%html%' OR skill LIKE '%HTML%' GROUP BY skill, level;

-- Check all questions
SELECT skill, level, COUNT(*) as count FROM questions GROUP BY skill, level ORDER BY skill, level;

-- Sample HTML questions
SELECT skill, level, LEFT(question, 50) as question_preview FROM questions WHERE skill LIKE '%html%' LIMIT 5;
