-- ============================================
-- QUICK FIX - Run this if cleanup SQL is too slow
-- ============================================

-- Check current state
SELECT 'BEFORE FIX' as status, COUNT(*) as total FROM questions;
SELECT skill, level, COUNT(*) FROM questions GROUP BY skill, level ORDER BY skill, level LIMIT 20;

-- Fix levels (BASIC -> easy, etc.)
UPDATE questions SET level = 'easy' WHERE UPPER(level) = 'BASIC';
UPDATE questions SET level = 'medium' WHERE UPPER(level) = 'INTERMEDIATE';
UPDATE questions SET level = 'hard' WHERE UPPER(level) = 'ADVANCED';

-- Fix skills (lowercase and remove spaces)
UPDATE questions SET skill = LOWER(REPLACE(skill, ' ', ''));

-- Check after fix
SELECT 'AFTER FIX' as status, COUNT(*) as total FROM questions;
SELECT skill, level, COUNT(*) FROM questions GROUP BY skill, level ORDER BY skill, level LIMIT 20;

-- Test query for HTML easy
SELECT COUNT(*) as html_easy_count FROM questions WHERE skill = 'html' AND level = 'easy';
