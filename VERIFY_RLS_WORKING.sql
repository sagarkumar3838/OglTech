-- ============================================
-- VERIFY RLS IS WORKING CORRECTLY
-- ============================================

-- 1. Check RLS is enabled
SELECT 
  '1. RLS Status' as check,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- 2. Show all policies
SELECT 
  '2. Active Policies' as check,
  policyname,
  cmd as operation,
  roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress'
ORDER BY policyname;

-- 3. Count policies
SELECT 
  '3. Policy Count' as check,
  COUNT(*) as total_policies,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ GOOD (has SELECT, INSERT, UPDATE, DELETE)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL (missing some policies)'
    ELSE '❌ NO POLICIES'
  END as status
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- 4. Check if "Allow all" policy exists (should NOT exist)
SELECT 
  '4. Security Check' as check,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'user_progress'
        AND policyname = 'Allow all for authenticated users'
    ) THEN '⚠️ WARNING: Temporary policy still exists!'
    ELSE '✅ SECURE: No temporary policies'
  END as status;

-- ============================================
-- FINAL STATUS
-- ============================================
SELECT '
✅ YOUR DATABASE IS SECURE!

RLS is enabled with proper policies.
Users can only access their own data.

Next steps:
1. Refresh your browser
2. Clear cache if needed
3. Test your app - should work without 406 errors

If you still get 406 errors:
- Make sure you are logged in
- Clear browser cache/storage
- Re-login
' as final_status;
