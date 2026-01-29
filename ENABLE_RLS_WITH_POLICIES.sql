-- ============================================
-- RE-ENABLE RLS WITH PROPER POLICIES
-- Run this after testing with RLS disabled
-- ============================================

-- Step 1: Remove the temporary "allow all" policy
DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_progress;

-- Step 2: Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 3: Create proper policies (UUID version)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 4: Verify
SELECT 
  '✅ RLS re-enabled with proper policies' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress';

-- Show policies
SELECT 
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_progress'
ORDER BY policyname;

SELECT '🎉 Done! Your data is now secure.' as message;
SELECT 'Refresh browser and test - should still work!' as next_step;
