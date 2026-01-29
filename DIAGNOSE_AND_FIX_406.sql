-- ============================================
-- DIAGNOSE AND FIX 406 ERRORS
-- Step 1: Diagnose, Step 2: Apply correct fix
-- ============================================

-- ============================================
-- DIAGNOSTIC: Check all user_id types
-- ============================================
SELECT 
  '🔍 DIAGNOSTIC: user_id types in all tables' as info;

SELECT 
  table_name,
  data_type,
  CASE 
    WHEN data_type = 'uuid' THEN '→ Use: auth.uid() = user_id'
    WHEN data_type = 'text' THEN '→ Use: auth.uid()::text = user_id'
    ELSE '→ Unknown type!'
  END as correct_policy
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'user_id'
ORDER BY table_name;

-- ============================================
-- FIX: user_progress (assuming UUID)
-- ============================================
SELECT '🔧 Fixing user_progress table...' as step;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- UUID version (no casting needed)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

SELECT '✅ user_progress policies created (UUID)' as result;

-- ============================================
-- FIX: scorecards (check type first)
-- ============================================
SELECT '🔧 Fixing scorecards table...' as step;

DO $$
DECLARE
  scorecards_type text;
BEGIN
  SELECT data_type INTO scorecards_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'scorecards'
    AND column_name = 'user_id';
  
  DROP POLICY IF EXISTS "Users can view own scorecards" ON scorecards;
  DROP POLICY IF EXISTS "Users can insert own scorecards" ON scorecards;
  
  ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
  
  IF scorecards_type = 'uuid' THEN
    -- UUID version
    EXECUTE 'CREATE POLICY "Users can view own scorecards" ON scorecards FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert own scorecards" ON scorecards FOR INSERT WITH CHECK (auth.uid() = user_id)';
    RAISE NOTICE 'scorecards: UUID policies created';
  ELSE
    -- TEXT version
    EXECUTE 'CREATE POLICY "Users can view own scorecards" ON scorecards FOR SELECT USING (auth.uid()::text = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert own scorecards" ON scorecards FOR INSERT WITH CHECK (auth.uid()::text = user_id)';
    RAISE NOTICE 'scorecards: TEXT policies created';
  END IF;
END $$;

SELECT '✅ scorecards policies created' as result;

-- ============================================
-- FIX: Public read tables
-- ============================================
SELECT '🔧 Fixing public read tables...' as step;

DROP POLICY IF EXISTS "Anyone can view careers" ON careers;
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view careers"
  ON careers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  USING (true);

SELECT '✅ Public read policies created' as result;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT '📊 VERIFICATION: Policies per table' as info;

SELECT 
  tablename,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_progress', 'scorecards', 'careers', 'questions')
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- FINAL STATUS
-- ============================================
SELECT '🎉 Fix complete!' as message;
SELECT 'Now clear browser cache and re-login' as next_step;
