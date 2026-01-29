-- ============================================
-- SIMPLE & SAFE RLS FIX
-- ============================================
-- This only fixes tables that exist
-- Run check-existing-tables.sql first to see what you have
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FIX USER_PROGRESS TABLE
-- ============================================

DO $$
BEGIN
  -- Check if table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
    
    -- Drop old policies
    DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can delete their own progress" ON user_progress;
    DROP POLICY IF EXISTS user_progress_select_policy ON user_progress;
    DROP POLICY IF EXISTS user_progress_insert_policy ON user_progress;
    DROP POLICY IF EXISTS user_progress_update_policy ON user_progress;
    DROP POLICY IF EXISTS user_progress_delete_policy ON user_progress;
    
    -- Enable RLS
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
    
    -- Create new policies
    CREATE POLICY user_progress_select_policy ON user_progress
      FOR SELECT TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY user_progress_insert_policy ON user_progress
      FOR INSERT TO authenticated
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY user_progress_update_policy ON user_progress
      FOR UPDATE TO authenticated
      USING ((user_id)::text = (auth.uid())::text)
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY user_progress_delete_policy ON user_progress
      FOR DELETE TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    -- Grant permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON user_progress TO authenticated;
    
    RAISE NOTICE '✅ Fixed user_progress table';
  ELSE
    RAISE NOTICE '⚠️ Table user_progress does not exist';
  END IF;
END $$;

-- ============================================
-- FIX SCORECARDS TABLE
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scorecards') THEN
    
    -- Drop old policies
    DROP POLICY IF EXISTS scorecards_select_policy ON scorecards;
    DROP POLICY IF EXISTS scorecards_insert_policy ON scorecards;
    DROP POLICY IF EXISTS scorecards_update_policy ON scorecards;
    DROP POLICY IF EXISTS scorecards_delete_policy ON scorecards;
    
    -- Enable RLS
    ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
    
    -- Create new policies
    CREATE POLICY scorecards_select_policy ON scorecards
      FOR SELECT TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY scorecards_insert_policy ON scorecards
      FOR INSERT TO authenticated
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY scorecards_update_policy ON scorecards
      FOR UPDATE TO authenticated
      USING ((user_id)::text = (auth.uid())::text)
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY scorecards_delete_policy ON scorecards
      FOR DELETE TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    -- Grant permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON scorecards TO authenticated;
    
    RAISE NOTICE '✅ Fixed scorecards table';
  ELSE
    RAISE NOTICE '⚠️ Table scorecards does not exist';
  END IF;
END $$;

-- ============================================
-- FIX EVALUATION_SESSIONS TABLE (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'evaluation_sessions') THEN
    
    DROP POLICY IF EXISTS evaluation_sessions_select_policy ON evaluation_sessions;
    DROP POLICY IF EXISTS evaluation_sessions_insert_policy ON evaluation_sessions;
    DROP POLICY IF EXISTS evaluation_sessions_update_policy ON evaluation_sessions;
    DROP POLICY IF EXISTS evaluation_sessions_delete_policy ON evaluation_sessions;
    
    ALTER TABLE evaluation_sessions ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY evaluation_sessions_select_policy ON evaluation_sessions
      FOR SELECT TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_sessions_insert_policy ON evaluation_sessions
      FOR INSERT TO authenticated
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_sessions_update_policy ON evaluation_sessions
      FOR UPDATE TO authenticated
      USING ((user_id)::text = (auth.uid())::text)
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_sessions_delete_policy ON evaluation_sessions
      FOR DELETE TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    GRANT SELECT, INSERT, UPDATE, DELETE ON evaluation_sessions TO authenticated;
    
    RAISE NOTICE '✅ Fixed evaluation_sessions table';
  ELSE
    RAISE NOTICE '⚠️ Table evaluation_sessions does not exist';
  END IF;
END $$;

-- ============================================
-- FIX EVALUATION_SUBMISSIONS TABLE (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'evaluation_submissions') THEN
    
    DROP POLICY IF EXISTS evaluation_submissions_select_policy ON evaluation_submissions;
    DROP POLICY IF EXISTS evaluation_submissions_insert_policy ON evaluation_submissions;
    DROP POLICY IF EXISTS evaluation_submissions_update_policy ON evaluation_submissions;
    DROP POLICY IF EXISTS evaluation_submissions_delete_policy ON evaluation_submissions;
    
    ALTER TABLE evaluation_submissions ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY evaluation_submissions_select_policy ON evaluation_submissions
      FOR SELECT TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_submissions_insert_policy ON evaluation_submissions
      FOR INSERT TO authenticated
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_submissions_update_policy ON evaluation_submissions
      FOR UPDATE TO authenticated
      USING ((user_id)::text = (auth.uid())::text)
      WITH CHECK ((user_id)::text = (auth.uid())::text);
    
    CREATE POLICY evaluation_submissions_delete_policy ON evaluation_submissions
      FOR DELETE TO authenticated
      USING ((user_id)::text = (auth.uid())::text);
    
    GRANT SELECT, INSERT, UPDATE, DELETE ON evaluation_submissions TO authenticated;
    
    RAISE NOTICE '✅ Fixed evaluation_submissions table';
  ELSE
    RAISE NOTICE '⚠️ Table evaluation_submissions does not exist';
  END IF;
END $$;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- VERIFY WHAT WAS FIXED
-- ============================================

SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('user_progress', 'scorecards', 'evaluation_sessions', 'evaluation_submissions')
ORDER BY tablename, cmd;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ RLS POLICIES FIXED!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Formula used: (user_id)::text = (auth.uid())::text';
  RAISE NOTICE '✅ Works for both TEXT and UUID columns';
  RAISE NOTICE '✅ ============================================';
END $$;
