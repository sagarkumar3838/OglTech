-- Verify Azure Advanced Questions Upload

-- 1. Count Azure Advanced questions
SELECT 
  'Total Azure Advanced Questions' as check_name,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';

-- 2. Show sample questions
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview,
  correct_answer,
  topic
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
ORDER BY id DESC
LIMIT 10;

-- 3. Check topics distribution
SELECT 
  topic,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
GROUP BY topic
ORDER BY question_count DESC;

-- 4. Verify all required fields are populated
SELECT 
  'Questions with missing fields' as check_name,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
  AND (
    question_text IS NULL OR question_text = '' OR
    option_a IS NULL OR option_a = '' OR
    option_b IS NULL OR option_b = '' OR
    option_c IS NULL OR option_c = '' OR
    option_d IS NULL OR option_d = '' OR
    correct_answer IS NULL OR correct_answer = '' OR
    explanation IS NULL OR explanation = ''
  );

-- 5. Check correct_answer values
SELECT 
  correct_answer,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
GROUP BY correct_answer
ORDER BY correct_answer;

-- 6. Show all Azure levels
SELECT 
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'Azure'
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
    ELSE 4
  END;
