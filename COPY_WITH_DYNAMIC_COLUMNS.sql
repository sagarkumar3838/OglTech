-- ========================================
-- STEP 1: First run FIND_ACTUAL_COLUMN_NAMES.sql
-- to see what columns exist in your questions table
-- ========================================

-- Common column name variations:
-- question_text OR question OR text OR question_content
-- option_a OR optiona OR option_1
-- correct_answer OR answer OR correct_option

-- ========================================
-- OPTION A: If questions table uses "question" instead of "question_text"
-- ========================================

DELETE FROM questions;

INSERT INTO questions (
  skill, 
  level, 
  question,  -- Changed from question_text
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
  question_text,  -- From practice_questions
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation
FROM practice_questions;

-- Verify
SELECT COUNT(*) as total FROM questions;
SELECT level, COUNT(*) FROM questions GROUP BY level;
SELECT level, COUNT(*) FROM questions WHERE LOWER(skill) = 'devtools' GROUP BY level;
