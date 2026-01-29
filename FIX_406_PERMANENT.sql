-- ============================================
-- PERMANENT FIX FOR 406 ERROR
-- This creates proper RLS policies
-- ============================================

-- Step 1: Check current user_id type
SELECT 
  'Current user_id type in user_progress:' as info,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_progress'
  AND column_name = 'user_id';

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_progress;

-- Step 3: Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies (UUID version - no casting)
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

-- Step 5: Verify policies were created
SELECT 
  '✅ Policies created:' as status,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_progress'
ORDER BY policyname;

SELECT '🎉 Permanent fix applied!' as message;
SELECT 'Clear browser cache and re-login' as next_step;
