-- ============================================
-- ENABLE RLS WITH SUPABASE AUTH
-- Run this after migrating to Supabase Auth
-- ============================================

-- Step 1: Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop old policies
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to delete profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can delete own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Allow all authenticated users to view enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Allow all authenticated users to insert enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Allow all authenticated users to update enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Allow all authenticated users to delete enrollments" ON user_course_enrollments;

-- Step 3: Create new RLS policies for Supabase Auth
-- User Profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON user_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own profile"
ON user_profiles FOR DELETE
USING (auth.uid()::text = user_id);

-- User Course Enrollments
CREATE POLICY "Users can view own enrollments"
ON user_course_enrollments FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own enrollments"
ON user_course_enrollments FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own enrollments"
ON user_course_enrollments FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own enrollments"
ON user_course_enrollments FOR DELETE
USING (auth.uid()::text = user_id);

-- Step 4: Update storage policies
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete avatars" ON storage.objects;

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-avatars');

CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-avatars');

-- Step 5: Verify setup
SELECT 'RLS enabled on user_profiles' as status, 
       relrowsecurity as enabled 
FROM pg_class 
WHERE relname = 'user_profiles';

SELECT 'RLS enabled on user_course_enrollments' as status, 
       relrowsecurity as enabled 
FROM pg_class 
WHERE relname = 'user_course_enrollments';

-- Show all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_profiles', 'user_course_enrollments')
ORDER BY tablename, policyname;
