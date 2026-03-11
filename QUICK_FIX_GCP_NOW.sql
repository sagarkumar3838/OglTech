-- ========================================
-- QUICK FIX: GCP Case Sensitivity
-- ========================================
-- Run this in Supabase SQL Editor NOW
-- This will make all 100 GCP questions visible

-- Fix the case sensitivity issue
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Verify the fix worked
SELECT 
  '✅ GCP Questions Fixed' as status,
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'gcp'
GROUP BY skill, level;

-- Show before/after comparison
SELECT 
  'Total gcp (lowercase)' as check_type,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'gcp'
UNION ALL
SELECT 
  'Total GCP (uppercase)' as check_type,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'GCP';
