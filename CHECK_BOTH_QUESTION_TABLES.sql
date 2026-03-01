-- Check both question tables to see which has data

-- Check practice_questions table
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills,
  COUNT(DISTINCT level) as unique_levels
FROM practice_questions;

-- Check questions table
SELECT 
  'questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills,
  COUNT(DISTINCT level) as unique_levels
FROM questions;

-- Show sample from practice_questions
SELECT 
  'practice_questions SAMPLE' as info,
  skill, 
  level, 
  question_text,
  option_a,
  correct_answer
FROM practice_questions 
LIMIT 3;

-- Show sample from questions
SELECT 
  'questions SAMPLE' as info,
  skill, 
  level, 
  question,
  options
FROM questions 
LIMIT 3;

-- Show column names for practice_questions
SELECT 
  'practice_questions COLUMNS' as info,
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- Show column names for questions
SELECT 
  'questions COLUMNS' as info,
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;
