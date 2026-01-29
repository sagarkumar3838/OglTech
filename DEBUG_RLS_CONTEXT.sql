-- ============================================
-- DEBUG: Check RLS Context and Auth
-- This will show us WHY the policies aren't working
-- ============================================

-- 1. Check what user context Supabase sees
SELECT 
  '1. Current Auth Context' as check_name,
  current_user as postgres_user,
  current_setting('request.jwt.claims', true) as jwt_claims,
  current_setting('request.jwt.claim.sub', true) as jwt_sub;

-- 2. Try to get auth.uid() 
SELECT 
  '2. Auth UID Function' as check_name,
  auth.uid() as auth_uid,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NULL - This is the problem!'
    ELSE '✅ Has value'
  END as status;

-- 3. Check policies again
SELECT 
  '3. Current Policies' as check_name,
  policyname,
  cmd,
  permissive,
  roles::text,
  qual::text as using_clause
FROM pg_policies 
WHERE tablename = 'user_progress';

-- 4. Check if anon role can access
SELECT 
  '4. Role Check' as check_name,
  current_user as current_role,
  pg_has_role('anon', 'USAGE') as has_anon_role,
  pg_has_role('authenticated', 'USAGE') as has_authenticated_role;

-- 5. Try a direct select (this will fail with RLS)
SELECT 
  '5. Direct Select Test' as check_name,
  COUNT(*) as record_count
FROM user_progress;

-- ============================================
-- ANALYSIS:
-- If auth.uid() is NULL, the policies can't work
-- because they check: auth.uid() = user_id
-- 
-- This means the JWT token isn't being passed correctly
-- or the auth schema isn't set up properly
-- ============================================
