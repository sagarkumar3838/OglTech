-- ============================================
-- UNIVERSAL FIX FOR 406 ERRORS
-- Works for BOTH UUID and TEXT user_id types
-- ============================================

-- ============================================
-- STEP 1: Check what type user_id is
-- ============================================
DO $$
DECLARE
  user_id_type text;
BEGIN
  -- Get the data type of user_id in user_progress
  SELECT data_type INTO user_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'user_progress'
    AND column_name = 'user_id';
  
  RAISE NOTICE 'user_progress.user_id type: %', user_id_type;
END $$;

-- ============================================
-- STEP 2: Fix user_progress (UUID version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Try UUID version (if user_id is UUID)
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

-- ============================================
-- STEP 3: Fix scorecards (UUID version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own scorecards" ON scorecards;
DROP POLICY IF EXISTS "Users can insert own scorecards" ON scorecards;

ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scorecards"
  ON scorecards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scorecards"
  ON scorecards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 4: Fix user_profiles (TEXT version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- STEP 5: Fix user_career_selections (TEXT version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own career selections" ON user_career_selections;
DROP POLICY IF EXISTS "Users can insert own career selections" ON user_career_selections;
DROP POLICY IF EXISTS "Users can update own career selections" ON user_career_selections;

ALTER TABLE user_career_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career selections"
  ON user_career_selections FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own career selections"
  ON user_career_selections FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own career selections"
  ON user_career_selections FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- STEP 6: Fix user_test_results (TEXT version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own test results" ON user_test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON user_test_results;

ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test results"
  ON user_test_results FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own test results"
  ON user_test_results FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- STEP 7: Fix user_skill_progress (TEXT version)
-- ============================================
DROP POLICY IF EXISTS "Users can view own skill progress" ON user_skill_progress;
DROP POLICY IF EXISTS "Users can insert own skill progress" ON user_skill_progress;
DROP POLICY IF EXISTS "Users can update own skill progress" ON user_skill_progress;

ALTER TABLE user_skill_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill progress"
  ON user_skill_progress FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own skill progress"
  ON user_skill_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own skill progress"
  ON user_skill_progress FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- STEP 8: Allow public read for reference tables
-- ============================================
DROP POLICY IF EXISTS "Anyone can view careers" ON careers;
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;
DROP POLICY IF EXISTS "Anyone can view media" ON media;

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view careers"
  ON careers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  '✅ Policies Created' as status,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

SELECT '🎉 Universal fix applied!' as message;
SELECT 'Refresh your browser and clear cache' as next_step;
