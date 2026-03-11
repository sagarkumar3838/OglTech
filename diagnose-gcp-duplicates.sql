-- Diagnose GCP Duplicate Questions Issue
-- Run this FIRST to understand the problem

-- 1. Count questions by skill case
SELECT 
  'Questions by Case' as check_name,
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level
ORDER BY skill, level;

-- 2. Find duplicate question texts
SELECT 
  'Duplicate Question Texts' as check_name,
  question_text,
  STRING_AGG(DISTINCT skill, ', ') as skill_variations,
  COUNT(*) as duplicate_count,
  STRING_AGG(DISTINCT id::text, ', ') as ids
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY question_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 3. Count total duplicates
SELECT 
  'Total Duplicate Questions' as check_name,
  COUNT(*) as duplicate_question_count
FROM (
  SELECT question_text
  FROM practice_questions
  WHERE LOWER(skill) = 'gcp'
  GROUP BY question_text
  HAVING COUNT(*) > 1
) duplicates;

-- 4. Show sample of each case
SELECT 
  'Sample GCP (uppercase)' as type,
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'GCP'
ORDER BY created_at DESC
LIMIT 5;

SELECT 
  'Sample gcp (lowercase)' as type,
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'gcp'
ORDER BY created_at DESC
LIMIT 5;

-- 5. Summary
SELECT 
  'Summary' as report,
  SUM(CASE WHEN skill = 'GCP' THEN 1 ELSE 0 END) as uppercase_count,
  SUM(CASE WHEN skill = 'gcp' THEN 1 ELSE 0 END) as lowercase_count,
  COUNT(*) as total_count
FROM practice_questions
WHERE LOWER(skill) = 'gcp';
