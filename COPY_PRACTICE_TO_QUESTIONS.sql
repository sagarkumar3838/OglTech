-- ========================================
-- COPY DATA FROM practice_questions TO questions
-- WITH LEVEL NAME CONVERSION
-- ========================================

-- This copies all questions from practice_questions to questions table
-- and converts level names:
-- Basic → basic
-- Intermediate → medium
-- Advanced → hard

-- Step 1: Check current state
SELECT 'BEFORE COPY' as status;

SELECT 'practice_questions' as table_name, COUNT(*) as total FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as total FROM questions;

-- Step 2: Clear questions table (optional - comment out if you want to keep existing data)
DELETE FROM questions;

-- Step 3: Copy data with level conversion
INSERT INTO questions (
  skill, 
  level, 
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation, 
  topic, 
  mdn_link, 
  youtube_english, 
  youtube_hindi, 
  youtube_kannada, 
  youtube_tamil, 
  youtube_telugu
)
SELECT 
  skill,
  CASE level
    WHEN 'Basic' THEN 'basic'
    WHEN 'Intermediate' THEN 'medium'
    WHEN 'Advanced' THEN 'hard'
    ELSE LOWER(level)  -- Convert any other levels to lowercase
  END as level,
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation, 
  topic, 
  mdn_link,
  youtube_english, 
  youtube_hindi, 
  youtube_kannada, 
  youtube_tamil, 
  youtube_telugu
FROM practice_questions;

-- Step 4: Verify the copy
SELECT 'AFTER COPY' as status;

SELECT 'practice_questions' as table_name, COUNT(*) as total FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as total FROM questions;

-- Step 5: Check levels in questions table
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- Step 6: Check devtools specifically
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY level;

-- ========================================
-- RESULT: questions table now has all data with lowercase levels
-- ========================================

-- Expected results:
-- questions table should have 9,464 questions
-- Levels should be: basic, medium, hard
-- Devtools should have: basic (95), medium (248), hard (110)
