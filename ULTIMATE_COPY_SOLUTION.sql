-- ========================================
-- ULTIMATE COPY SOLUTION
-- Run FIND_ACTUAL_COLUMN_NAMES.sql first, then uncomment the matching version below
-- ========================================

-- ========================================
-- VERSION 1: questions table uses "question" (not "question_text")
-- ========================================
/*
DELETE FROM questions;

INSERT INTO questions (
  skill, level, question, option_a, option_b, option_c, option_d, correct_answer, explanation
)
SELECT 
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END,
  question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
FROM practice_questions;
*/

-- ========================================
-- VERSION 2: questions table uses "text" (not "question_text")
-- ========================================
/*
DELETE FROM questions;

INSERT INTO questions (
  skill, level, text, option_a, option_b, option_c, option_d, correct_answer, explanation
)
SELECT 
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END,
  question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
FROM practice_questions;
*/

-- ========================================
-- VERSION 3: questions table uses different option names (optiona, optionb, etc.)
-- ========================================
/*
DELETE FROM questions;

INSERT INTO questions (
  skill, level, question, optiona, optionb, optionc, optiond, answer, explanation
)
SELECT 
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END,
  question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
FROM practice_questions;
*/

-- ========================================
-- VERIFICATION (run after any version above)
-- ========================================

SELECT '=== TOTAL ===' as status;
SELECT COUNT(*) as total FROM questions;

SELECT '=== LEVELS ===' as status;
SELECT level, COUNT(*) as count FROM questions GROUP BY level;

SELECT '=== DEVTOOLS ===' as status;
SELECT level, COUNT(*) as count FROM questions WHERE LOWER(skill) = 'devtools' GROUP BY level;

-- ========================================
-- INSTRUCTIONS:
-- 1. Run FIND_ACTUAL_COLUMN_NAMES.sql
-- 2. Look at the column names in questions table
-- 3. Uncomment the matching VERSION above
-- 4. Run it!
-- ========================================
