-- ============================================
-- QUICK FIX - Run this NOW to fix 406 errors
-- ============================================

-- Fix user_progress table (main issue)
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

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

-- Fix scorecards table
DROP POLICY IF EXISTS "Users can view own scorecards" ON scorecards;
DROP POLICY IF EXISTS "Users can insert own scorecards" ON scorecards;

ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scorecards"
  ON scorecards FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own scorecards"
  ON scorecards FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow public read for careers
DROP POLICY IF EXISTS "Anyone can view careers" ON careers;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view careers" ON careers FOR SELECT USING (true);

SELECT '✅ Quick fix applied! Refresh your browser.' as message;
