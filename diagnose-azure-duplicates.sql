-- Comprehensive Azure Advanced Duplicate Check

-- 1. Count total Azure Advanced questions
SELECT 
  'Total Azure Advanced Questions' as check_name,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';

-- 2. Check for exact duplicate questions (same question_text)
SELECT 
  'Duplicate Questions (same text)' as check_name,
  COUNT(*) as duplicate_count
FROM (
  SELECT question_text, COUNT(*) as cnt
  FROM practice_questions
  WHERE skill = 'Azure' AND level = 'Advanced'
  GROUP BY question_text
  HAVING COUNT(*) > 1
) duplicates;

-- 3. Show duplicate questions with their counts
SELECT 
  LEFT(question_text, 80) as question_preview,
  COUNT(*) as duplicate_count,
  MIN(id) as first_id,
  MAX(id) as last_id
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
GROUP BY question_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 4. Count unique questions
SELECT 
  'Unique Questions' as check_name,
  COUNT(DISTINCT question_text) as unique_count
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced';

-- 5. Check all Azure levels
SELECT 
  level,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions
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

-- 6. Show IDs of all Azure Advanced questions (to see the pattern)
SELECT 
  id,
  LEFT(question_text, 60) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
ORDER BY id
LIMIT 50;

-- 7. Check if there are multiple uploads (by created_at timestamp)
SELECT 
  DATE(created_at) as upload_date,
  COUNT(*) as questions_uploaded
FROM practice_questions
WHERE skill = 'Azure' AND level = 'Advanced'
GROUP BY DATE(created_at)
ORDER BY upload_date DESC;
