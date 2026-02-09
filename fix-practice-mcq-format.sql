-- Check current state of questions table
SELECT 
  'questions table' as table_name,
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level
LIMIT 10;

-- Check practice_questions table
SELECT 
  'practice_questions table' as table_name,
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level
LIMIT 10;

-- Sample question from questions table to see format
SELECT 
  id,
  skill,
  level,
  question_text,
  options,
  correct_answer,
  explanation
FROM questions
WHERE skill = 'javascript' AND level = 'beginner'
LIMIT 1;

-- Sample question from practice_questions to see format
SELECT 
  id,
  skill,
  level,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer,
  explanation
FROM practice_questions
WHERE skill ILIKE '%javascript%' AND level = 'Basic'
LIMIT 1;
