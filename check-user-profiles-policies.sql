-- ============================================
-- CHECK USER PROFILES RLS POLICIES
-- Run this to see current policies without modifying
-- ============================================

-- 1. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- 2. List all current policies
SELECT 
  policyname,
  cmd as operation,
  roles,
  permissive,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 3. Test if you can query the table
SELECT COUNT(*) as total_profiles FROM user_profiles;

-- 4. Test if you can see your own profile (replace with your user_id)
-- SELECT * FROM user_profiles WHERE user_id = 'your-user-id-here' LIMIT 1;

-- 5. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
