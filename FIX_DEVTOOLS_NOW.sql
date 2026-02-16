-- ========================================
-- FIX DEVTOOLS QUESTIONS IN questions TABLE
-- ========================================

-- Problem: questions table has devtools with medium/hard but NO easy level
-- Solution: Copy from practice_questions table with level conversion

-- Step 1: Check current state
SELECT 'BEFORE FIX' as status;

SELECT skill, level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Delete old devtools questions
DELETE FROM questions WHERE LOWER(skill) LIKE '%devtools%';

-- Step 3: Copy devtools from practice_questions with level conversion
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
    WHEN 'Basic' THEN 'easy'
    WHEN 'Intermediate' THEN 'medium'
    WHEN 'Advanced' THEN 'hard'
    ELSE LOWER(level)
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
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%';

-- Step 4: Verify the fix
SELECT 'AFTER FIX' as status;

SELECT skill, level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level
ORDER BY skill, level;

-- ========================================
-- EXPECTED RESULT:
-- ========================================
-- Devtools easy: 95
-- Devtools medium: 248
-- Devtools hard: 110
-- Total: 453 devtools questions

-- ========================================
-- DONE! Now your questions table has all devtools questions
-- ========================================
