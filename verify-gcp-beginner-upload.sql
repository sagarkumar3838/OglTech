-- Verify GCP Beginner Questions Upload
-- Run this in Supabase SQL Editor after upload

-- 1. Count total GCP beginner questions
SELECT 
  'Total GCP Beginner Questions' as check_name,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner';

-- 2. Show sample questions
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview,
  correct_answer,
  topic
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check for any issues
SELECT 
  'Questions with missing data' as check_name,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'GCP' 
  AND level = 'beginner'
  AND (
    question_text IS NULL OR question_text = '' OR
    option_a IS NULL OR option_a = '' OR
    option_b IS NULL OR option_b = '' OR
    option_c IS NULL OR option_c = '' OR
    option_d IS NULL OR option_d = '' OR
    correct_answer IS NULL OR correct_answer = ''
  );

-- 4. Check topics distribution
SELECT 
  topic,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner'
GROUP BY topic
ORDER BY question_count DESC;

-- 5. Verify correct_answer values
SELECT 
  correct_answer,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner'
GROUP BY correct_answer
ORDER BY correct_answer;

-- 6. Check for duplicates
SELECT 
  question_text,
  COUNT(*) as duplicate_count
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner'
GROUP BY question_text
HAVING COUNT(*) > 1;

-- 7. Overall summary
SELECT 
  skill,
  level,
  COUNT(*) as total_questions,
  COUNT(DISTINCT topic) as unique_topics,
  MIN(created_at) as first_upload,
  MAX(created_at) as last_upload
FROM practice_questions
WHERE skill = 'GCP' AND level = 'beginner'
GROUP BY skill, level;
