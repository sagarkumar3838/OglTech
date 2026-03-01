-- Diagnose HTML Beginner questions to see what data exists

-- Show first 3 HTML Basic questions with ALL fields
SELECT 
  id,
  skill,
  level,
  question,
  options,
  correct_answer,
  topic,
  type
FROM practice_questions
WHERE skill ILIKE 'html'
  AND level = 'Basic'
LIMIT 3;

-- Check if question field is NULL or empty
SELECT 
  'Questions with NULL question' as issue,
  COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE 'html'
  AND level = 'Basic'
  AND question IS NULL;

SELECT 
  'Questions with empty question' as issue,
  COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE 'html'
  AND level = 'Basic'
  AND question = '';

-- Check options format
SELECT 
  'Questions with NULL options' as issue,
  COUNT(*) as count
FROM practice_questions
WHERE skill ILIKE 'html'
  AND level = 'Basic'
  AND options IS NULL;
