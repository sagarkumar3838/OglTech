-- ============================================
-- FIX ALL 406 ERRORS - COMPLETE RLS FIX
-- This fixes RLS policies for all tables
-- ============================================

-- ============================================
-- 1. FIX user_progress TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid()::text = user_id);

-- ============================================
-- 2. FIX user_profiles TABLE
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
-- 3. FIX user_career_selections TABLE
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
-- 4. FIX user_test_results TABLE
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
-- 5. FIX user_skill_progress TABLE
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
-- 6. FIX career_recommendations TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view own recommendations" ON career_recommendations;
DROP POLICY IF EXISTS "Users can update own recommendations" ON career_recommendations;

ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON career_recommendations FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own recommendations"
  ON career_recommendations FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- 7. FIX scorecards TABLE (if exists)
-- ============================================
DROP POLICY IF EXISTS "Users can view own scorecards" ON scorecards;
DROP POLICY IF EXISTS "Users can insert own scorecards" ON scorecards;

ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scorecards"
  ON scorecards FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own scorecards"
  ON scorecards FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- 8. FIX questions TABLE - Allow public read
-- ============================================
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  USING (true);

-- ============================================
-- 9. FIX careers TABLE - Allow public read
-- ============================================
DROP POLICY IF EXISTS "Anyone can view careers" ON careers;

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view careers"
  ON careers FOR SELECT
  USING (true);

-- ============================================
-- 10. FIX media TABLE - Allow public read
-- ============================================
DROP POLICY IF EXISTS "Anyone can view media" ON media;

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  '✅ RLS Policies Fixed' as status,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_progress',
    'user_profiles',
    'user_career_selections',
    'user_test_results',
    'user_skill_progress',
    'career_recommendations',
    'scorecards',
    'questions',
    'careers',
    'media'
  )
GROUP BY tablename
ORDER BY tablename;

SELECT '🎉 All 406 errors should be fixed now!' as message;
SELECT 'Please refresh your browser and try again' as next_step;
