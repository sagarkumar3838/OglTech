-- Check if OpenGL questions exist in the database
-- Run this in Supabase SQL Editor

-- 1. Check all OpenGL questions
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill LIKE '%opengl%' OR skill LIKE '%gl%'
GROUP BY skill, level, type
ORDER BY skill, level;

-- 2. Check exact match
SELECT skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'opengl' AND level = 'easy'
GROUP BY skill, level, type;

-- 3. Check all variations
SELECT DISTINCT skill, level, type
FROM questions
WHERE skill ILIKE '%opengl%'
ORDER BY skill, level;

-- 4. Check what skills are available
SELECT DISTINCT skill
FROM questions
ORDER BY skill;

-- 5. Sample OpenGL questions (if any)
SELECT id, skill, level, type, question
FROM questions
WHERE skill ILIKE '%opengl%'
LIMIT 5;
