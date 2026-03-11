-- Verify React Beginner Questions Upload

-- Count total React Basic questions
SELECT COUNT(*) as total_react_basic_questions
FROM practice_questions
WHERE skill = 'ReactJS' AND level = 'Basic';

-- Show sample questions
SELECT 
  id,
  question_text,
  topic,
  correct_answer,
  created_at
FROM practice_questions
WHERE skill = 'ReactJS' AND level = 'Basic'
ORDER BY created_at DESC
LIMIT 10;

-- Count by topic
SELECT 
  topic,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'ReactJS' AND level = 'Basic'
GROUP BY topic
ORDER BY question_count DESC;
