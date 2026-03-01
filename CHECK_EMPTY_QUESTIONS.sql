-- Check for questions with missing or empty question text

-- Count questions with NULL or empty question field
SELECT 
  'Questions with NULL question' as issue,
  COUNT(*) as count
FROM practice_questions
WHERE question IS NULL;

SELECT 
  'Questions with empty question' as issue,
  COUNT(*) as count
FROM practice_questions
WHERE question = '';

-- Show sample questions for HTML Intermediate
SELECT 
  id,
  skill,
  level,
  CASE 
    WHEN question IS NULL THEN 'NULL'
    WHEN question = '' THEN 'EMPTY'
    WHEN LENGTH(question) < 10 THEN 'TOO SHORT: ' || question
    ELSE SUBSTRING(question, 1, 50) || '...'
  END as question_status,
  topic,
  options
FROM practice_questions
WHERE skill ILIKE 'html'
  AND level = 'Intermediate'
LIMIT 5;
