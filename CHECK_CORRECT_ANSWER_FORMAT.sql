-- Check the format of correct_answer field in both tables

-- Check practice_questions table
SELECT 
  'practice_questions' as table_name,
  skill,
  level,
  LEFT(question_text, 50) as question_preview,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer,
  typeof(correct_answer) as answer_type,
  LENGTH(correct_answer) as answer_length
FROM practice_questions
WHERE skill ILIKE 'Java'
LIMIT 5;

-- Check questions table
SELECT 
  'questions' as table_name,
  skill,
  level,
  LEFT(question, 50) as question_preview,
  correct_answer,
  typeof(correct_answer) as answer_type,
  LENGTH(correct_answer) as answer_length
FROM questions
WHERE skill ILIKE 'Java'
LIMIT 5;

-- Show distinct correct_answer values to understand the format
SELECT DISTINCT 
  correct_answer,
  COUNT(*) as count
FROM practice_questions
GROUP BY correct_answer
ORDER BY correct_answer;
