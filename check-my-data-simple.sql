-- ============================================
-- SIMPLE DATA CHECK
-- Just run this to see what you have
-- ============================================

-- 1. Your user ID
SELECT 
  'Your User ID' as info,
  auth.uid() as user_id;

-- 2. Check user_progress table
SELECT 
  'user_progress records' as info,
  COUNT(*) as total_records
FROM user_progress;

-- 3. Your specific progress (using UUID)
SELECT 
  'Your Progress' as info,
  user_id,
  career_id,
  overall_completion,
  created_at
FROM user_progress
WHERE user_id = auth.uid()
LIMIT 1;

-- 4. Your skill progress details
SELECT 
  'Your Skills' as info,
  jsonb_array_length(skill_progress) as number_of_skills,
  skill_progress
FROM user_progress
WHERE user_id = auth.uid();

-- 5. Available careers
SELECT 
  'Available Careers' as info,
  id,
  name
FROM careers
ORDER BY name;

-- 6. Check if new tables exist
SELECT 
  'Table Status' as info,
  table_name,
  'exists' as status
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN (
    'user_career_selections',
    'user_skill_progress', 
    'user_test_results',
    'career_skill_requirements'
  );
