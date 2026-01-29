-- ============================================
-- OPTIMIZED FIX FOR 406 ERRORS (UUID VERSION)
-- Based on your screenshot: user_id is UUID type
-- ============================================

-- Step 1: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_progress') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_progress';
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 3: Create optimized policies for UUID type
-- SELECT policy - users can read their own progress
CREATE POLICY "user_progress_select_own"
ON user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT policy - users can create their own progress
CREATE POLICY "user_progress_insert_own"
ON user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE policy - users can update their own progress
CREATE POLICY "user_progress_update_own"
ON user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE policy - users can delete their own progress
CREATE POLICY "user_progress_delete_own"
ON user_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 4: Grant permissions
GRANT ALL ON user_progress TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 5: Verify the setup
SELECT 
  '✅ RLS Enabled' as status,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_progress';

SELECT 
  '✅ Policies Created' as status,
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;

-- Step 6: Test query (should work now)
SELECT 
  '✅ Table Accessible' as status,
  COUNT(*) as total_records
FROM user_progress;

-- ============================================
-- EXPECTED OUTPUT:
-- ✅ 4 policies created (SELECT, INSERT, UPDATE, DELETE)
-- ✅ RLS enabled = true
-- ✅ Table accessible (returns count)
-- 
-- After running this:
-- 1. Refresh your application
-- 2. 406 errors should be GONE
-- 3. Dashboard should load user progress
-- ============================================

COMMENT ON TABLE user_progress IS 'Fixed 406 errors - UUID optimized RLS policies applied';
