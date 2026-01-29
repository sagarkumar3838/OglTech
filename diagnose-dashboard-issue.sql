-- ============================================
-- DIAGNOSE DASHBOARD ISSUE
-- Run this to understand what's happening
-- ============================================

-- 1. Check your user ID
SELECT 
  'Your User ID' as info,
  auth.uid() as user_id,
  auth.email() as email;

-- 2. Check if user_progress table exists and has data
SELECT 
  'user_progress table' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT user_id) as unique_users
FROM user_progress;

-- 3. Check your specific progress
SELECT 
  'Your Progress Data' as info,
  *
FROM user_progress
WHERE user_id = auth.uid()::text
LIMIT 1;

-- 4. Check careers table
SELECT 
  'Available Careers' as info,
  id,
  name,
  experience_level
FROM careers
ORDER BY name;

-- 5. Check if new tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_career_selections',
    'user_skill_progress',
    'user_test_results',
    'career_skill_requirements'
  )
ORDER BY table_name;

-- 6. Check user_career_selections if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_career_selections') THEN
    RAISE NOTICE 'Checking user_career_selections...';
    PERFORM * FROM user_career_selections LIMIT 1;
  ELSE
    RAISE NOTICE 'user_career_selections table does not exist';
  END IF;
END $$;

-- 7. Show sample of your progress data structure
SELECT 
  'Sample Progress Structure' as info,
  jsonb_pretty(skill_progress) as skill_progress_structure
FROM user_progress
WHERE user_id = auth.uid()::text
LIMIT 1;
