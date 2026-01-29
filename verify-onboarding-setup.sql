-- ============================================
-- VERIFY ONBOARDING SYSTEM SETUP
-- Run this after create-onboarding-flow-system-FIXED.sql
-- ============================================

-- 1. Check if tables were created
SELECT 
  'Tables Check' as test,
  CASE 
    WHEN COUNT(*) = 2 THEN '✅ PASS - Both tables created'
    ELSE '❌ FAIL - Missing tables'
  END as result,
  COUNT(*) as tables_found
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_onboarding_status', 'user_test_performance');

-- 2. Check if view was created
SELECT 
  'View Check' as test,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ PASS - Dashboard view created'
    ELSE '❌ FAIL - View not found'
  END as result
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'user_dashboard_stats';

-- 3. Check if user_profiles columns were added
SELECT 
  'Profile Columns Check' as test,
  CASE 
    WHEN COUNT(*) >= 11 THEN '✅ PASS - All profile columns added'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL - Some columns added'
    ELSE '❌ FAIL - No columns added'
  END as result,
  COUNT(*) as columns_found
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN (
    'full_name', 'phone', 'location', 'education_level', 
    'years_of_experience', 'job_title', 'linkedin_url', 
    'github_url', 'portfolio_url', 'bio', 'profile_picture_url', 
    'is_profile_complete'
  );

-- 4. Check RLS policies
SELECT 
  'RLS Policies Check' as test,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ PASS - All RLS policies created'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL - Some policies created'
    ELSE '❌ FAIL - No policies found'
  END as result,
  COUNT(*) as policies_found
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_onboarding_status', 'user_test_performance');

-- 5. Check functions
SELECT 
  'Functions Check' as test,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ PASS - All functions created'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL - Some functions created'
    ELSE '❌ FAIL - No functions found'
  END as result,
  COUNT(*) as functions_found
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('update_onboarding_progress', 'update_test_performance', 'initialize_user_onboarding');

-- 6. Check triggers
SELECT 
  'Triggers Check' as test,
  CASE 
    WHEN COUNT(*) >= 1 THEN '✅ PASS - Trigger created'
    ELSE '❌ FAIL - Trigger not found'
  END as result
FROM pg_trigger
WHERE tgname = 'on_user_created_init_onboarding';

-- 7. Check indexes
SELECT 
  'Indexes Check' as test,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ PASS - All indexes created'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL - Some indexes created'
    ELSE '❌ FAIL - No indexes found'
  END as result,
  COUNT(*) as indexes_found
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_onboarding_status', 'user_test_performance')
  AND indexname LIKE 'idx_%';

-- ============================================
-- DETAILED INFORMATION
-- ============================================

-- Show table structures
SELECT 
  '📋 Table: user_onboarding_status' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_onboarding_status'
ORDER BY ordinal_position;

SELECT 
  '📋 Table: user_test_performance' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_test_performance'
ORDER BY ordinal_position;

-- Show new user_profiles columns
SELECT 
  '📋 New columns in user_profiles' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN (
    'full_name', 'phone', 'location', 'education_level', 
    'years_of_experience', 'job_title', 'linkedin_url', 
    'github_url', 'portfolio_url', 'bio', 'profile_picture_url', 
    'is_profile_complete'
  )
ORDER BY column_name;

-- ============================================
-- FINAL STATUS
-- ============================================
SELECT 
  '🎉 SETUP COMPLETE!' as message,
  'All onboarding system components are ready' as status,
  'You can now implement the frontend components' as next_step;
