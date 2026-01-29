-- ============================================
-- VERIFY POLICIES WERE CREATED SUCCESSFULLY
-- Run this to confirm the fix worked
-- ============================================

-- 1. Check if RLS is enabled
SELECT 
  '1. RLS Status' as check_name,
  tablename,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE tablename = 'user_progress';

-- 2. List all policies created
SELECT 
  '2. Policies Created' as check_name,
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Can read data'
    WHEN cmd = 'INSERT' THEN '✅ Can create data'
    WHEN cmd = 'UPDATE' THEN '✅ Can update data'
    WHEN cmd = 'DELETE' THEN '✅ Can delete data'
  END as description
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;

-- 3. Count policies (should be 4)
SELECT 
  '3. Policy Count' as check_name,
  COUNT(*) as total_policies,
  CASE 
    WHEN COUNT(*) = 4 THEN '✅ CORRECT (4 policies)'
    ELSE '⚠️ Expected 4 policies'
  END as status
FROM pg_policies 
WHERE tablename = 'user_progress';

-- 4. Check permissions granted
SELECT 
  '4. Permissions' as check_name,
  grantee as role,
  string_agg(privilege_type, ', ') as permissions
FROM information_schema.role_table_grants
WHERE table_name = 'user_progress'
  AND grantee IN ('authenticated', 'anon', 'postgres')
GROUP BY grantee;

-- 5. Test table access (should work now)
SELECT 
  '5. Table Access Test' as check_name,
  COUNT(*) as record_count,
  '✅ Table is accessible' as status
FROM user_progress;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- 1. RLS Status: ✅ ENABLED
-- 2. Policies: 4 rows (SELECT, INSERT, UPDATE, DELETE)
-- 3. Policy Count: ✅ CORRECT (4 policies)
-- 4. Permissions: authenticated role has permissions
-- 5. Table Access: ✅ Table is accessible (count = 0 is OK)
-- ============================================

-- Final check: Show policy details
SELECT 
  'FINAL CHECK' as section,
  policyname,
  cmd,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_progress';
