-- ========================================
-- SIMPLE FIX: Remove GCP Duplicates
-- ========================================
-- Run this in Supabase SQL Editor

-- OPTION 1: Keep lowercase "gcp", delete uppercase "GCP" duplicates
-- This is the safest approach

-- First, see what will be deleted
SELECT 
  'Will DELETE these GCP (uppercase) questions' as action,
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview
FROM practice_questions
WHERE skill = 'GCP'
AND question_text IN (
  SELECT question_text
  FROM practice_questions
  WHERE skill = 'gcp'
)
ORDER BY created_at
LIMIT 20;

-- If the above looks correct, run this DELETE:
DELETE FROM practice_questions
WHERE skill = 'GCP'
AND question_text IN (
  SELECT question_text
  FROM practice_questions
  WHERE skill = 'gcp'
);

-- Then update any remaining GCP to gcp
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Verify
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level;
