-- ========================================
-- COPY ONLY MATCHING COLUMNS
-- This copies only the columns that exist in BOTH tables
-- ========================================

-- STEP 1: Clear questions table
DELETE FROM questions;

-- STEP 2: Copy data (only common columns)
-- This will work even if practice_questions has extra columns
INSERT INTO questions (
  skill, 
  level, 
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation
)
SELECT 
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation
FROM practice_questions;

-- STEP 3: Verify
SELECT '=== TOTAL QUESTIONS ===' as status;
SELECT COUNT(*) as total FROM questions;

SELECT '=== LEVELS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

SELECT '=== DEVTOOLS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level;

-- ========================================
-- NOTE: This copies only the basic columns
-- If questions table has extra columns (topic, mdn_link, youtube links)
-- they will be NULL - you can add them later if needed
-- ========================================
