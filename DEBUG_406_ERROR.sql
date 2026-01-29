-- ============================================
-- DEBUG 406 ERROR - Find the exact problem
-- ============================================

-- 1. Check if table exists
SELECT 
  '1. Table exists?' as check,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user_progress'
  ) THEN '✅ YES' ELSE '❌ NO' END as result;

-- 2. Check RLS status
SELECT 
  '2. RLS enabled?' as check,
  CASE WHEN rowsecurity THEN '✅ YES' ELSE '❌ NO' END as result
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- 3. Check policies exist
SELECT 
  '3. Policies exist?' as check,
  CASE WHEN COUNT(*) > 0 THEN '✅ YES (' || COUNT(*) || ' policies)' ELSE '❌ NO' END as result
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- 4. Show all policies
SELECT 
  '4. Policy details:' as info,
  policyname,
  cmd,
  roles,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- 5. Check user_id column type
SELECT 
  '5. user_id type:' as info,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_progress'
  AND column_name = 'user_id';

-- 6. Check if user is authenticated
SELECT 
  '6. Current user:' as info,
  auth.uid() as user_id,
  CASE WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN' ELSE '✅ LOGGED IN' END as status;

-- 7. Test query (this might fail with 406)
SELECT 
  '7. Test query:' as info,
  'Attempting to query user_progress...' as status;

-- Try to select (will fail if RLS blocks it)
SELECT 
  '7. Query result:' as info,
  COUNT(*) as row_count
FROM user_progress
WHERE user_id = auth.uid();

-- ============================================
-- SOLUTION BASED ON FINDINGS
-- ============================================
SELECT '
📋 SOLUTION:

If RLS is enabled but no policies exist:
  → Run FIX_406_PERMANENT.sql

If policies exist but still getting 406:
  → User might not be authenticated
  → Clear browser cache and re-login

If user_id type is TEXT:
  → Policies need: auth.uid()::text = user_id

If user_id type is UUID:
  → Policies need: auth.uid() = user_id
' as solution;
