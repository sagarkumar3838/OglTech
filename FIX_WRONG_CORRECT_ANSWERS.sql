-- Fix wrong correct_answer values in practice_questions table
-- The correct_answer should match the actual correct option text or letter

-- First, let's see which questions have "Basics" as an option but it's marked as correct answer
SELECT 
  id,
  skill,
  level,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer
FROM practice_questions
WHERE skill = 'Java' AND level = 'Basic'
ORDER BY id
LIMIT 20;

-- Example fixes (you'll need to run these after checking the data):

-- Fix "What is Java?" - correct answer should be "Programming language" (option d)
-- UPDATE practice_questions 
-- SET correct_answer = 'd'
-- WHERE question_text ILIKE '%What is Java%' 
-- AND skill = 'Java';

-- Fix "Who developed Java?" - correct answer should be "Sun Microsystems" (option d)
-- UPDATE practice_questions 
-- SET correct_answer = 'd'
-- WHERE question_text ILIKE '%Who developed Java%' 
-- AND skill = 'Java';

-- BETTER APPROACH: Update correct_answer to match the actual answer text
-- This is more reliable than using letters

-- For "What is Java?" question
-- UPDATE practice_questions 
-- SET correct_answer = 'Programming language'
-- WHERE question_text ILIKE '%What is Java%' 
-- AND skill = 'Java'
-- AND option_d = 'Programming language';

-- For "Who developed Java?" question  
-- UPDATE practice_questions 
-- SET correct_answer = 'Sun Microsystems'
-- WHERE question_text ILIKE '%Who developed Java%' 
-- AND skill = 'Java'
-- AND option_d = 'Sun Microsystems';

-- Check all Java Basic questions to see if there are more issues
SELECT 
  id,
  LEFT(question_text, 60) as question,
  option_a,
  option_b, 
  option_c,
  option_d,
  correct_answer,
  CASE 
    WHEN correct_answer = option_a THEN 'A matches'
    WHEN correct_answer = option_b THEN 'B matches'
    WHEN correct_answer = option_c THEN 'C matches'
    WHEN correct_answer = option_d THEN 'D matches'
    WHEN correct_answer IN ('a', 'b', 'c', 'd') THEN 'Letter format'
    ELSE 'NO MATCH!'
  END as match_status
FROM practice_questions
WHERE skill = 'Java' AND level = 'Basic'
ORDER BY id;
