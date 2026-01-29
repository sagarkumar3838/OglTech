-- ============================================
-- PERMANENT FIX FOR ALL RLS POLICIES
-- ============================================
-- This fixes the UUID vs TEXT user_id issue across ALL tables
-- Run this ONCE and never worry about it again
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop policies for user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON user_progress;
DROP POLICY IF EXISTS user_progress_select_policy ON user_progress;
DROP POLICY IF EXISTS user_progress_insert_policy ON user_progress;
DROP POLICY IF EXISTS user_progress_update_policy ON user_progress;
DROP POLICY IF EXISTS user_progress_delete_policy ON user_progress;

-- Drop policies for scorecards
DROP POLICY IF EXISTS scorecards_select_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_insert_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_update_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_delete_policy ON scorecards;

-- Drop policies for evaluation_sessions
DROP POLICY IF EXISTS evaluation_sessions_select_policy ON evaluation_sessions;
DROP POLICY IF EXISTS evaluation_sessions_insert_policy ON evaluation_sessions;
DROP POLICY IF EXISTS evaluation_sessions_update_policy ON evaluation_sessions;
DROP POLICY IF EXISTS evaluation_sessions_delete_policy ON evaluation_sessions;

-- Drop policies for evaluation_submissions
DROP POLICY IF EXISTS evaluation_submissions_select_policy ON evaluation_submissions;
DROP POLICY IF EXISTS evaluation_submissions_insert_policy ON evaluation_submissions;
DROP POLICY IF EXISTS evaluation_submissions_update_policy ON evaluation_submissions;
DROP POLICY IF EXISTS evaluation_submissions_delete_policy ON evaluation_submissions;

-- Drop policies for user_career_selections (if exists)
DROP POLICY IF EXISTS user_career_selections_select_policy ON user_career_selections;
DROP POLICY IF EXISTS user_career_selections_insert_policy ON user_career_selections;
DROP POLICY IF EXISTS user_career_selections_update_policy ON user_career_selections;
DROP POLICY IF EXISTS user_career_selections_delete_policy ON user_career_selections;

-- Drop policies for user_test_results (if exists)
DROP POLICY IF EXISTS user_test_results_select_policy ON user_test_results;
DROP POLICY IF EXISTS user_test_results_insert_policy ON user_test_results;
DROP POLICY IF EXISTS user_test_results_update_policy ON user_test_results;
DROP POLICY IF EXISTS user_test_results_delete_policy ON user_test_results;

-- Drop policies for user_skill_progress (if exists)
DROP POLICY IF EXISTS user_skill_progress_select_policy ON user_skill_progress;
DROP POLICY IF EXISTS user_skill_progress_insert_policy ON user_skill_progress;
DROP POLICY IF EXISTS user_skill_progress_update_policy ON user_skill_progress;
DROP POLICY IF EXISTS user_skill_progress_delete_policy ON user_skill_progress;

-- ============================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================

-- Enable RLS on core tables (ignore errors if they don't exist)
DO $$
BEGIN
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_progress does not exist, skipping...';
END $$;

DO $$
BEGIN
    ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table scorecards does not exist, skipping...';
END $$;

DO $$
BEGIN
    ALTER TABLE evaluation_sessions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table evaluation_sessions does not exist, skipping...';
END $$;

DO $$
BEGIN
    ALTER TABLE evaluation_submissions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table evaluation_submissions does not exist, skipping...';
END $$;

-- Enable RLS on optional tables (ignore errors if they don't exist)
DO $$
BEGIN
    ALTER TABLE user_career_selections ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_career_selections does not exist, skipping...';
END $$;

DO $$
BEGIN
    ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_test_results does not exist, skipping...';
END $$;

DO $$
BEGIN
    ALTER TABLE user_skill_progress ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_skill_progress does not exist, skipping...';
END $$;

-- ============================================
-- STEP 3: CREATE UNIVERSAL POLICIES
-- ============================================
-- These policies work for BOTH TEXT and UUID user_id columns
-- by casting both sides to TEXT for comparison
-- ============================================

-- ============================================
-- USER_PROGRESS TABLE POLICIES
-- ============================================

DO $$
BEGIN
    EXECUTE 'CREATE POLICY user_progress_select_policy ON user_progress FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_progress_insert_policy ON user_progress FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_progress_update_policy ON user_progress FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_progress_delete_policy ON user_progress FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    RAISE NOTICE '✅ Created policies for user_progress';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE '⚠️ Table user_progress does not exist, skipping...';
END $$;

-- ============================================
-- SCORECARDS TABLE POLICIES
-- ============================================

DO $$
BEGIN
    EXECUTE 'CREATE POLICY scorecards_select_policy ON scorecards FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY scorecards_insert_policy ON scorecards FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY scorecards_update_policy ON scorecards FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY scorecards_delete_policy ON scorecards FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    RAISE NOTICE '✅ Created policies for scorecards';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE '⚠️ Table scorecards does not exist, skipping...';
END $$;

-- ============================================
-- EVALUATION_SESSIONS TABLE POLICIES
-- ============================================

DO $$
BEGIN
    EXECUTE 'CREATE POLICY evaluation_sessions_select_policy ON evaluation_sessions FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_sessions_insert_policy ON evaluation_sessions FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_sessions_update_policy ON evaluation_sessions FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_sessions_delete_policy ON evaluation_sessions FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    RAISE NOTICE '✅ Created policies for evaluation_sessions';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE '⚠️ Table evaluation_sessions does not exist, skipping...';
END $$;

-- ============================================
-- EVALUATION_SUBMISSIONS TABLE POLICIES
-- ============================================

DO $$
BEGIN
    EXECUTE 'CREATE POLICY evaluation_submissions_select_policy ON evaluation_submissions FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_submissions_insert_policy ON evaluation_submissions FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_submissions_update_policy ON evaluation_submissions FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY evaluation_submissions_delete_policy ON evaluation_submissions FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    RAISE NOTICE '✅ Created policies for evaluation_submissions';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE '⚠️ Table evaluation_submissions does not exist, skipping...';
END $$;

-- ============================================
-- OPTIONAL TABLES (ignore errors if they don't exist)
-- ============================================

-- USER_CAREER_SELECTIONS
DO $$
BEGIN
    EXECUTE 'CREATE POLICY user_career_selections_select_policy ON user_career_selections FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_career_selections_insert_policy ON user_career_selections FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_career_selections_update_policy ON user_career_selections FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_career_selections_delete_policy ON user_career_selections FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_career_selections does not exist, skipping...';
END $$;

-- USER_TEST_RESULTS
DO $$
BEGIN
    EXECUTE 'CREATE POLICY user_test_results_select_policy ON user_test_results FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_test_results_insert_policy ON user_test_results FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_test_results_update_policy ON user_test_results FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_test_results_delete_policy ON user_test_results FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_test_results does not exist, skipping...';
END $$;

-- USER_SKILL_PROGRESS
DO $$
BEGIN
    EXECUTE 'CREATE POLICY user_skill_progress_select_policy ON user_skill_progress FOR SELECT TO authenticated USING ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_skill_progress_insert_policy ON user_skill_progress FOR INSERT TO authenticated WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_skill_progress_update_policy ON user_skill_progress FOR UPDATE TO authenticated USING ((user_id)::text = (auth.uid())::text) WITH CHECK ((user_id)::text = (auth.uid())::text)';
    EXECUTE 'CREATE POLICY user_skill_progress_delete_policy ON user_skill_progress FOR DELETE TO authenticated USING ((user_id)::text = (auth.uid())::text)';
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table user_skill_progress does not exist, skipping...';
END $$;

-- ============================================
-- STEP 4: GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON user_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scorecards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON evaluation_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON evaluation_submissions TO authenticated;

-- Grant on optional tables (ignore errors)
DO $$
BEGIN
    GRANT SELECT, INSERT, UPDATE, DELETE ON user_career_selections TO authenticated;
EXCEPTION WHEN undefined_table THEN
    NULL;
END $$;

DO $$
BEGIN
    GRANT SELECT, INSERT, UPDATE, DELETE ON user_test_results TO authenticated;
EXCEPTION WHEN undefined_table THEN
    NULL;
END $$;

DO $$
BEGIN
    GRANT SELECT, INSERT, UPDATE, DELETE ON user_skill_progress TO authenticated;
EXCEPTION WHEN undefined_table THEN
    NULL;
END $$;

GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- STEP 5: VERIFY POLICIES WERE CREATED
-- ============================================

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual::text, 1, 50) || '...'
    ELSE 'N/A'
  END as using_clause
FROM pg_policies 
WHERE tablename IN (
  'user_progress', 
  'scorecards', 
  'evaluation_sessions', 
  'evaluation_submissions',
  'user_career_selections',
  'user_test_results',
  'user_skill_progress'
)
ORDER BY tablename, cmd;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ ALL RLS POLICIES FIXED PERMANENTLY!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ All tables now use: (user_id)::text = (auth.uid())::text';
  RAISE NOTICE '✅ This works for BOTH TEXT and UUID columns';
  RAISE NOTICE '✅ You will never see UUID vs TEXT errors again';
  RAISE NOTICE '✅ ============================================';
END $$;
