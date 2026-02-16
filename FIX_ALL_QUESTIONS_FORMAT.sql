-- ============================================
-- FIX ALL QUESTIONS FORMAT
-- ============================================
-- This script normalizes all questions in the database
-- to match the format expected by the Practice page

-- 1. NORMALIZE SKILL NAMES (lowercase, no spaces)
-- ============================================
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')))
WHERE skill != LOWER(TRIM(REPLACE(skill, ' ', '')));

-- 2. NORMALIZE LEVEL NAMES (easy/medium/hard)
-- ============================================
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  WHEN level ILIKE 'expert' THEN 'hard'
  ELSE LOWER(level)
END
WHERE level NOT IN ('easy', 'medium', 'hard');

-- 3. SET TYPE TO MCQ IF NOT SET
-- ============================================
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL OR type = '' OR type = 'multiple_choice';

-- 4. VERIFY THE FIXES
-- ============================================
-- Check all skills and their question counts
SELECT skill, level, type, COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- 5. CHECK SPECIFIC SKILLS
-- ============================================
-- OpenGL
SELECT 'OpenGL' as check_name, skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'opengl'
GROUP BY skill, level, type;

-- HTML
SELECT 'HTML' as check_name, skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'html'
GROUP BY skill, level, type;

-- CSS
SELECT 'CSS' as check_name, skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'css'
GROUP BY skill, level, type;

-- JavaScript
SELECT 'JavaScript' as check_name, skill, level, type, COUNT(*) as count
FROM questions
WHERE skill = 'javascript'
GROUP BY skill, level, type;

-- 6. CHECK FOR MISSING QUESTIONS
-- ============================================
-- List all unique skills
SELECT DISTINCT skill, COUNT(*) as total_questions
FROM questions
GROUP BY skill
ORDER BY skill;

-- 7. SAMPLE QUESTIONS TO VERIFY FORMAT
-- ============================================
SELECT skill, level, type, question, 
       jsonb_typeof(options) as options_type,
       correct_answer
FROM questions
WHERE skill = 'opengl'
LIMIT 3;
