-- ============================================
-- DIAGNOSE WHY 406 ERRORS ARE STILL HAPPENING
-- Run this to see what's wrong
-- ============================================

-- 1. Check current policies
SELECT 
  '1. Current Policies' as check_name,
  policyname,
  cmd,
  qual::text as using_condition,
  with_check::text as with_check_condition
FROM pg_policies 
WHERE tablename = 'user_progress';

-- 2. Check RLS status
SELECT 
  '2. RLS Status' as check_name,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'user_progress';

-- 3. Test if auth.uid() works
SELECT 
  '3. Auth UID Test' as check_name,
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NULL - User not authenticated in SQL context'
    ELSE '✅ User ID found'
  END as status;

-- 4. Check table structure
SELECT 
  '4. Table Structure' as check_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- 5. Check if there are any records
SELECT 
  '5. Record Count' as check_name,
  COUNT(*) as total_records
FROM user_progress;

-- 6. Check permissions
SELECT 
  '6. Table Permissions' as check_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'user_progress'
  AND grantee IN ('authenticated', 'anon', 'postgres');

-- ============================================
-- ANALYSIS
-- ============================================
-- If policies show NULL in qual or with_check, they're broken
-- If RLS is disabled, that's the problem
-- If auth.uid() is NULL, the context isn't set properly
-- If user_id type doesn't match auth.uid() type, that's the issue
