-- ============================================
-- SIMPLE FIX FOR 406 ERRORS
-- Copy and paste this entire script into Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "media_public_read" ON public.media;
DROP POLICY IF EXISTS "media_admin_all" ON public.media;
DROP POLICY IF EXISTS "user_progress_own_read" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_own_write" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_own_update" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_admin_all" ON public.user_progress;

-- Step 2: Create PERMISSIVE policies for media (allow public read)
CREATE POLICY "media_public_read"
ON public.media
FOR SELECT
TO anon, authenticated
USING (true);  -- Allow everyone to read all media

CREATE POLICY "media_authenticated_all"
ON public.media
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);  -- Authenticated users can do everything

-- Step 3: Create PERMISSIVE policies for user_progress
CREATE POLICY "user_progress_select"
ON public.user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);  -- Users can read their own progress

CREATE POLICY "user_progress_insert"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);  -- Users can insert their own progress

CREATE POLICY "user_progress_update"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);  -- Users can update their own progress

CREATE POLICY "user_progress_delete"
ON public.user_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);  -- Users can delete their own progress

-- Step 4: Grant explicit permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.media TO anon, authenticated;
GRANT ALL ON public.media TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;

-- Step 5: Verify the setup
SELECT 'Policies on media table:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'media';

SELECT 'Policies on user_progress table:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_progress';

SELECT '✅ Fix applied successfully!' as status;
