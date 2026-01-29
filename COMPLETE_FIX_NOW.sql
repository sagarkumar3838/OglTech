-- ============================================
-- COMPLETE FIX FOR ALL ERRORS
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing RLS policies that are causing issues
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can delete own enrollments" ON user_course_enrollments;

-- Step 2: Disable RLS temporarily for testing (RECOMMENDED FOR DEVELOPMENT)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollments DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop and recreate storage policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads to user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all updates to user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes from user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all reads from user-avatars" ON storage.objects;

-- Create simple storage policies
CREATE POLICY "Public can read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Anyone can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-avatars');

CREATE POLICY "Anyone can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-avatars');

CREATE POLICY "Anyone can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-avatars');

-- Step 4: Verify tables exist
SELECT 'user_profiles table exists' as status, COUNT(*) as row_count FROM user_profiles;
SELECT 'user_course_enrollments table exists' as status, COUNT(*) as row_count FROM user_course_enrollments;
SELECT 'scorecards table exists' as status, COUNT(*) as row_count FROM scorecards;

-- Step 5: Show current user_id types
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('user_profiles', 'scorecards', 'submissions')
  AND column_name = 'user_id';

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. RLS is DISABLED for user_profiles and user_course_enrollments
--    This allows your Firebase Auth to work without Supabase Auth
-- 2. Storage policies are PUBLIC for development
-- 3. For PRODUCTION, you should:
--    - Re-enable RLS with proper policies
--    - Use service role key for backend operations
--    - Implement proper authentication middleware
-- ============================================
