-- ============================================
-- QUICK DATABASE CHECK
-- Run this in Supabase SQL Editor to see what you have
-- ============================================

-- 1. Total questions count
SELECT COUNT(*) as total_questions FROM questions;

-- 2. What skills exist?
SELECT DISTINCT skill, COUNT(*) as count 
FROM questions 
GROUP BY skill 
ORDER BY skill;

-- 3. What levels exist?
SELECT DISTINCT level, COUNT(*) as count 
FROM questions 
GROUP BY level 
ORDER BY level;

-- 4. Breakdown by skill and level
SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- 5. Sample of first 5 questions (to see the format)
SELECT id, skill, level, LEFT(question, 50) as question_preview 
FROM questions 
LIMIT 5;

-- 6. Check for HTML questions specifically
SELECT level, COUNT(*) as count 
FROM questions 
WHERE skill = 'html' OR skill = 'HTML'
GROUP BY level;

-- 7. Check for questions with spaces in skill names
SELECT DISTINCT skill 
FROM questions 
WHERE skill LIKE '% %'
ORDER BY skill;
