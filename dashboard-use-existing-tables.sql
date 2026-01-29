-- ============================================
-- DASHBOARD FIX - Use Existing Tables
-- This makes the dashboard work with your current system
-- ============================================

-- First, let's check what tables you actually have
SELECT 
  table_name,
  'exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_progress',
    'careers',
    'user_career_selections',
    'user_skill_progress',
    'user_test_results',
    'career_skill_requirements'
  )
ORDER BY table_name;

-- Check your user_progress structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- Check if you have any progress data
SELECT 
  user_id,
  career_id,
  created_at
FROM user_progress
LIMIT 5;

-- Check careers table
SELECT 
  id,
  name,
  experience_level
FROM careers
ORDER BY name;
