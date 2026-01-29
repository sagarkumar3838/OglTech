-- ============================================
-- VERIFY 406 FIX IS WORKING
-- Run this after applying FIX_406_ERRORS_COMPLETE.sql
-- ============================================

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_progress';
-- Expected: rowsecurity = true

-- 2. Check all policies exist
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;
-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- 3. Check user_id column type
SELECT 
  column_name,
  data_type,
  udt_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_progress' 
  AND column_name = 'user_id';
-- Expected: data_type should be 'text' or 'uuid'

-- 4. Check table permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'user_progress'
  AND grantee IN ('authenticated', 'anon');
-- Expected: authenticated should have permissions

-- 5. Test query (replace with your actual user_id)
-- This simulates what the app does
SELECT COUNT(*) as total_records
FROM user_progress;
-- If this returns a number, the table is accessible

-- 6. Check for any conflicting policies
SELECT 
  policyname,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_progress';
-- Review the qual and with_check columns for any issues

-- ============================================
-- SUMMARY
-- ============================================
-- If all queries above return expected results:
-- ✅ RLS is enabled
-- ✅ Policies are created
-- ✅ Permissions are granted
-- ✅ 406 errors should be fixed!
-- 
-- If you still get 406 errors:
-- 1. Check browser console for the exact error
-- 2. Verify user is authenticated (auth.uid() returns a value)
-- 3. Check if user_id in database matches auth.uid()
-- ============================================
