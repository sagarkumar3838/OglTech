-- ============================================
-- FIX ALL CAREER PROGRESSION TABLES
-- Change user_id from UUID to TEXT for Firebase compatibility
-- ============================================

-- ============================================
-- 1. Fix user_career_selections
-- ============================================
DROP TABLE IF EXISTS user_career_selections CASCADE;

CREATE TABLE IF NOT EXISTS user_career_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 1,
  UNIQUE(user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_user_career_selections_user ON user_career_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_career_selections_career ON user_career_selections(career_id);
CREATE INDEX IF NOT EXISTS idx_user_career_selections_active ON user_career_selections(user_id, is_active);

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
-- 2. Fix user_test_results
-- ============================================
DROP TABLE IF EXISTS user_test_results CASCADE;

CREATE TABLE IF NOT EXISTS user_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('easy', 'medium', 'hard')),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage NUMERIC NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken INTEGER,  -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scorecard_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_user_test_results_user ON user_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_career ON user_test_results(career_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_skill ON user_test_results(skill_name, level);
CREATE INDEX IF NOT EXISTS idx_user_test_results_date ON user_test_results(completed_at DESC);

ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test results" 
  ON user_test_results FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own test results" 
  ON user_test_results FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- ============================================
-- 3. Fix user_skill_progress
-- ============================================
DROP TABLE IF EXISTS user_skill_progress CASCADE;

CREATE TABLE IF NOT EXISTS user_skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  easy_completed BOOLEAN DEFAULT FALSE,
  easy_score NUMERIC,
  medium_completed BOOLEAN DEFAULT FALSE,
  medium_score NUMERIC,
  hard_completed BOOLEAN DEFAULT FALSE,
  hard_score NUMERIC,
  overall_completion NUMERIC DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, career_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_user_skill_progress_user ON user_skill_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_progress_career ON user_skill_progress(career_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_progress_skill ON user_skill_progress(skill_name);

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
-- 4. Fix career_recommendations (if exists)
-- ============================================
DROP TABLE IF EXISTS career_recommendations CASCADE;

CREATE TABLE IF NOT EXISTS career_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  current_career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  recommended_career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  recommended_career_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  based_on_skills TEXT[] NOT NULL,
  confidence_score NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_viewed BOOLEAN DEFAULT FALSE,
  is_accepted BOOLEAN DEFAULT FALSE,
  recommendation_type TEXT CHECK (recommendation_type IN ('progression', 'switch')),
  transferable_skills TEXT[],
  new_skills_needed TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_career_recommendations_user ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_current ON career_recommendations(current_career_id);

ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" 
  ON career_recommendations FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own recommendations" 
  ON career_recommendations FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- ============================================
-- Success Message
-- ============================================
SELECT 'All career progression tables fixed for Firebase auth (TEXT user_id)' as status;
