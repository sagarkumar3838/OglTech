-- ============================================
-- ONE-CLICK FIX FOR ALL QUESTIONS
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- This will fix all common issues with questions not showing

-- 1. NORMALIZE ALL SKILL NAMES
-- ============================================
-- Convert to lowercase and remove spaces
-- Example: "Open GL" → "opengl", "JavaScript" → "javascript"
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')))
WHERE skill != LOWER(TRIM(REPLACE(skill, ' ', '')));

-- 2. NORMALIZE ALL LEVEL NAMES
-- ============================================
-- Convert beginner→easy, intermediate→medium, advanced→hard
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  WHEN level ILIKE 'expert' THEN 'hard'
  ELSE LOWER(TRIM(level))
END
WHERE level NOT IN ('easy', 'medium', 'hard');

-- 3. SET TYPE TO MCQ
-- ============================================
-- Ensure all questions have type = 'mcq'
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL OR type = '' OR type != 'mcq';

-- 4. VERIFY THE FIX
-- ============================================
-- This will show you all skills and their question counts
SELECT 
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- 5. CHECK OPENGL SPECIFICALLY
-- ============================================
SELECT 
  'OpenGL Questions' as check,
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
WHERE skill = 'opengl'
GROUP BY skill, level, type;

-- 6. SAMPLE QUESTIONS
-- ============================================
-- Show a few questions to verify format
SELECT 
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  jsonb_typeof(options) as options_format,
  correct_answer
FROM questions
WHERE skill = 'opengl'
LIMIT 5;

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- After running this script, you should see:
-- 1. All skills in lowercase without spaces
-- 2. All levels as 'easy', 'medium', or 'hard'
-- 3. All types as 'mcq'
-- 4. Question counts for each skill/level combination
--
-- If OpenGL shows 0 questions, you need to upload them first
-- Run: UPLOAD_OPENGL_QUESTIONS.bat
-- ============================================
