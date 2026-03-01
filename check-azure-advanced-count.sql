-- Quick check of Azure Advanced questions



-- Show first 5 questions
SELECT 
  id,
  LEFT(question_text, 80) as question,
  correct_answer,
  topic
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
ORDER BY id
LIMIT 5;
