-- ============================================
-- COMPLETE FIX FOR 406 ERRORS
-- This fixes all RLS policies for user_progress table
-- ============================================

-- Step 1: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Allow users to read their own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to update their own progress" ON user_progress;

-- Step 2: Ensure RLS is enabled
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, permissive policies
-- Allow authenticated users to SELECT their own data
CREATE POLICY "user_progress_select_policy"
ON user_progress
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Allow authenticated users to INSERT their own data
CREATE POLICY "user_progress_insert_policy"
ON user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Allow authenticated users to UPDATE their own data
CREATE POLICY "user_progress_update_policy"
ON user_progress
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

-- Allow authenticated users to DELETE their own data
CREATE POLICY "user_progress_delete_policy"
ON user_progress
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Step 4: Grant necessary permissions
GRANT ALL ON user_progress TO authenticated;
GRANT ALL ON user_progress TO anon;

-- Step 5: Verify the setup
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_progress';

-- Step 6: Check if user_id column type matches auth.uid()
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'user_progress' 
  AND column_name = 'user_id';

-- Expected output: user_id should be 'text' or 'uuid'
-- If it's uuid, the policies above will work
-- If it's text, the policies above will work

COMMENT ON TABLE user_progress IS 'User progress tracking with RLS enabled - Fixed 406 errors';
