-- ============================================
-- FINAL FIX FOR 406 ERROR
-- Simple and direct - just disable RLS temporarily
-- ============================================

-- Option 1: Disable RLS on user_progress (TEMPORARY - for testing)
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a permissive policy that allows everything (TEMPORARY)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_progress;
CREATE POLICY "Allow all for authenticated users"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

SELECT '✅ RLS disabled on user_progress - 406 error should be gone' as message;
SELECT '⚠️ WARNING: This is temporary! Re-enable RLS after testing' as warning;
