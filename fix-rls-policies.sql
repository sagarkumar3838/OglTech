-- ============================================
-- FIX RLS POLICIES FOR FIREBASE AUTH
-- ============================================
-- Since we're using Firebase Auth (not Supabase Auth),
-- we need to disable RLS or make policies more permissive

-- Drop existing policies
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON user_course_enrollments;

-- Create new permissive policies for Firebase Auth
-- User Profiles - Allow all authenticated operations
CREATE POLICY "Allow all authenticated users to view profiles"
ON user_profiles FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow all authenticated users to insert profiles"
ON user_profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update profiles"
ON user_profiles FOR UPDATE
TO authenticated, anon
USING (true);

CREATE POLICY "Allow all authenticated users to delete profiles"
ON user_profiles FOR DELETE
TO authenticated, anon
USING (true);

-- User Course Enrollments - Allow all authenticated operations
CREATE POLICY "Allow all authenticated users to view enrollments"
ON user_course_enrollments FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow all authenticated users to insert enrollments"
ON user_course_enrollments FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update enrollments"
ON user_course_enrollments FOR UPDATE
TO authenticated, anon
USING (true);

CREATE POLICY "Allow all authenticated users to delete enrollments"
ON user_course_enrollments FOR DELETE
TO authenticated, anon
USING (true);

-- Storage policies for avatars
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;

CREATE POLICY "Allow all uploads to user-avatars"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'user-avatars');

CREATE POLICY "Allow all updates to user-avatars"
ON storage.objects FOR UPDATE
TO authenticated, anon
USING (bucket_id = 'user-avatars');

CREATE POLICY "Allow all deletes from user-avatars"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (bucket_id = 'user-avatars');

CREATE POLICY "Allow all reads from user-avatars"
ON storage.objects FOR SELECT
TO authenticated, anon, public
USING (bucket_id = 'user-avatars');
