-- ============================================
-- FIX 406 ERROR ON user_progress TABLE
-- The issue: RLS policies are blocking queries
-- ============================================

-- First, check if table exists and what type user_id is
SELECT 
  'user_progress table check' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_progress'
  AND column_name = 'user_id';

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

-- ============================================
-- CREATE CORRECT RLS POLICIES
-- Assuming user_id is TEXT (Firebase UID)
-- ============================================

-- Allow users to view their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow users to insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Allow users to delete their own progress
CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid()::text = user_id);

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEST THE POLICIES
-- ============================================
SELECT 
  'RLS Policies Created' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_progress';

-- Show all policies
SELECT 
  'Policy Details' as info,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_progress';

SELECT '✅ user_progress RLS policies fixed!' as message;
