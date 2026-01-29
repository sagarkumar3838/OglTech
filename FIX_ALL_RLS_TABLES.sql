-- ============================================
-- FIX ALL TABLES WITH RLS ISSUES
-- This fixes user_progress, scorecards, and other user tables
-- ============================================

-- ============================================
-- 1. FIX user_progress TABLE
-- ============================================
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_progress') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_progress';
    END LOOP;
END $$;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_progress_select" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_progress_insert" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_update" ON user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_delete" ON user_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT ALL ON user_progress TO authenticated;

-- ============================================
-- 2. FIX scorecards TABLE (if exists)
-- ============================================
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'scorecards') THEN
        -- Drop existing policies
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'scorecards') 
        LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON scorecards';
        END LOOP;
        
        -- Enable RLS
        ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "scorecards_select" ON scorecards FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "scorecards_insert" ON scorecards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "scorecards_update" ON scorecards FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "scorecards_delete" ON scorecards FOR DELETE TO authenticated USING (auth.uid() = user_id);
        
        GRANT ALL ON scorecards TO authenticated;
    END IF;
END $$;

-- ============================================
-- 3. FIX user_profiles TABLE (if exists)
-- ============================================
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_profiles') THEN
        -- Drop existing policies
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') 
        LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
        END LOOP;
        
        -- Enable RLS
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies (user_profiles might use 'id' instead of 'user_id')
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'user_id') THEN
            CREATE POLICY "user_profiles_select" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
            CREATE POLICY "user_profiles_insert" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
            CREATE POLICY "user_profiles_update" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
            CREATE POLICY "user_profiles_delete" ON user_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);
        ELSE
            CREATE POLICY "user_profiles_select" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
            CREATE POLICY "user_profiles_insert" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
            CREATE POLICY "user_profiles_update" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
            CREATE POLICY "user_profiles_delete" ON user_profiles FOR DELETE TO authenticated USING (auth.uid() = id);
        END IF;
        
        GRANT ALL ON user_profiles TO authenticated;
    END IF;
END $$;

-- ============================================
-- 4. FIX user_career_selections TABLE (if exists)
-- ============================================
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_career_selections') THEN
        -- Drop existing policies
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_career_selections') 
        LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_career_selections';
        END LOOP;
        
        -- Enable RLS
        ALTER TABLE user_career_selections ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "user_career_selections_select" ON user_career_selections FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "user_career_selections_insert" ON user_career_selections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "user_career_selections_update" ON user_career_selections FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "user_career_selections_delete" ON user_career_selections FOR DELETE TO authenticated USING (auth.uid() = user_id);
        
        GRANT ALL ON user_career_selections TO authenticated;
    END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Show all tables with RLS enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_progress', 'scorecards', 'user_profiles', 'user_career_selections')
ORDER BY tablename;

-- Show all policies created
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE tablename IN ('user_progress', 'scorecards', 'user_profiles', 'user_career_selections')
ORDER BY tablename, cmd;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '✅ ALL RLS POLICIES FIXED!' as status;
SELECT '✅ Refresh your app - 406 errors should be gone!' as next_step;
