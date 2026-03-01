-- Check if Java Basic questions are in the database

-- Count Java Basic questions in practice_questions table
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'Java' AND level = 'Basic';

-- Show first 5 Java Basic questions
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview,
  correct_answer
FROM practice_questions
WHERE skill = 'Java' AND level = 'Basic'
ORDER BY id
LIMIT 5;

-- Count all Java questions by level
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Java'
GROUP BY level
ORDER BY level;
