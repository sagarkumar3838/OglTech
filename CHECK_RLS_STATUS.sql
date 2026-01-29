-- Check if RLS is actually disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '❌ RLS IS STILL ENABLED - This is the problem!'
    WHEN rowsecurity = false THEN '✅ RLS is disabled'
  END as status
FROM pg_tables
WHERE tablename = 'user_progress';

-- Check what policies exist (should be none if RLS is disabled)
SELECT 
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ Policies still exist (but inactive if RLS disabled)'
    ELSE '✅ No policies'
  END as status
FROM pg_policies
WHERE tablename = 'user_progress';

-- Try direct access
SELECT 
  'Direct Access Test' as test,
  COUNT(*) as records
FROM user_progress;
