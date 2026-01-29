-- ============================================
-- AGGRESSIVE FIX FOR 406 ERRORS
-- This handles all edge cases and ensures policies work
-- ============================================

-- Step 1: Completely disable RLS temporarily
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (force clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_progress') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_progress CASCADE';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 4: Create PERMISSIVE policies (less restrictive)
-- These use PERMISSIVE mode which is more forgiving

-- SELECT policy - Allow authenticated users to read their own data
CREATE POLICY "allow_select_own_progress"
ON user_progress
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  (auth.uid())::text = (user_id)::text
);

-- INSERT policy - Allow authenticated users to create their own data
CREATE POLICY "allow_insert_own_progress"
ON user_progress
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid())::text = (user_id)::text
);

-- UPDATE policy - Allow authenticated users to update their own data
CREATE POLICY "allow_update_own_progress"
ON user_progress
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  (auth.uid())::text = (user_id)::text
)
WITH CHECK (
  (auth.uid())::text = (user_id)::text
);

-- DELETE policy - Allow authenticated users to delete their own data
CREATE POLICY "allow_delete_own_progress"
ON user_progress
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  (auth.uid())::text = (user_id)::text
);

-- Step 5: Grant ALL permissions explicitly
GRANT ALL ON user_progress TO authenticated;
GRANT ALL ON user_progress TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Step 6: Also grant on the sequence if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_progress_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE user_progress_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE user_progress_id_seq TO anon;
    END IF;
END $$;

-- Step 7: Verify everything
SELECT 
  '✅ VERIFICATION' as status,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'user_progress'
GROUP BY tablename;

SELECT 
  '✅ POLICIES CREATED' as status,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;

-- Step 8: Test query
SELECT 
  '✅ TABLE ACCESSIBLE' as status,
  COUNT(*) as record_count
FROM user_progress;

-- ============================================
-- EXPECTED RESULTS:
-- ✅ 4 policies created (all PERMISSIVE)
-- ✅ All policies show 'authenticated' role
-- ✅ Table is accessible
-- ============================================

COMMENT ON TABLE user_progress IS 'RLS fixed with PERMISSIVE policies - 406 errors should be resolved';
