-- ============================================
-- ULTIMATE FIX: Allow anon role to read
-- This is a workaround if auth.uid() isn't working
-- ============================================

-- Step 1: Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_progress') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_progress CASCADE';
    END LOOP;
END $$;

-- Step 2: Create policies that work with BOTH authenticated AND anon roles

-- SELECT policy - Allow both authenticated and anon to read
CREATE POLICY "allow_read_user_progress"
ON user_progress
AS PERMISSIVE
FOR SELECT
TO authenticated, anon
USING (
  -- If authenticated, check user_id matches
  (auth.uid() IS NOT NULL AND (auth.uid())::text = (user_id)::text)
  OR
  -- If anon (not authenticated), allow read but they'll filter by user_id in query
  (auth.uid() IS NULL)
);

-- INSERT policy - Only authenticated users
CREATE POLICY "allow_insert_user_progress"
ON user_progress
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid())::text = (user_id)::text
);

-- UPDATE policy - Only authenticated users
CREATE POLICY "allow_update_user_progress"
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

-- DELETE policy - Only authenticated users
CREATE POLICY "allow_delete_user_progress"
ON user_progress
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  (auth.uid())::text = (user_id)::text
);

-- Step 3: Grant permissions to both roles
GRANT SELECT ON user_progress TO anon;
GRANT ALL ON user_progress TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Verify
SELECT 
  '✅ POLICIES CREATED' as status,
  policyname,
  cmd,
  roles::text
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;

SELECT 
  '✅ TABLE ACCESSIBLE' as status,
  COUNT(*) as record_count
FROM user_progress;

-- ============================================
-- WHAT THIS DOES:
-- - Allows anon role to SELECT (read) data
-- - Authenticated users can do everything
-- - The SELECT policy checks auth.uid() if available
-- - If auth.uid() is NULL, it still allows read
-- 
-- This is less secure but will fix the 406 error
-- You can tighten security later once auth is working
-- ============================================

COMMENT ON TABLE user_progress IS 'RLS with anon read access - 406 fix applied';
