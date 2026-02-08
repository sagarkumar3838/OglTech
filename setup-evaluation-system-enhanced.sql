-- ============================================
-- ENHANCED EVALUATION SYSTEM
-- With Learning Resources & Retest Logic
-- ============================================

-- 1. Enhanced Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  topic TEXT NOT NULL,
  mdn_link TEXT,
  youtube_english TEXT,
  youtube_hindi TEXT,
  youtube_kannada TEXT,
  youtube_tamil TEXT,
  youtube_telugu TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Test Attempts Tracking
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL NOT NULL,
  passed BOOLEAN NOT NULL,
  failed_topics TEXT[],
  attempt_number INTEGER NOT NULL DEFAULT 1,
  time_taken_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Learning Progress Tracking
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  mdn_completed BOOLEAN DEFAULT false,
  mdn_completed_at TIMESTAMP,
  youtube_completed BOOLEAN DEFAULT false,
  youtube_language TEXT,
  youtube_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, test_attempt_id, topic)
);

-- 4. Retest Eligibility
CREATE TABLE IF NOT EXISTS retest_eligibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  last_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  can_retest BOOLEAN DEFAULT false,
  learning_completed BOOLEAN DEFAULT false,
  required_topics TEXT[],
  completed_topics TEXT[],
  unlocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill, level)
);

-- 5. Job Role Recommendations (Enhanced)
CREATE TABLE IF NOT EXISTS job_role_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role_name TEXT NOT NULL,
  role_category TEXT,
  salary_range TEXT,
  experience_level TEXT,
  match_percentage DECIMAL,
  required_skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id, skill, level);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id, test_attempt_id);
CREATE INDEX IF NOT EXISTS idx_retest_eligibility_user ON retest_eligibility(user_id, skill, level);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE retest_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_role_recommendations ENABLE ROW LEVEL SECURITY;

-- Questions: Public read
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

-- Test Attempts: Users can manage their own
CREATE POLICY "Users can manage their test attempts"
  ON test_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Learning Progress: Users can manage their own
CREATE POLICY "Users can manage their learning progress"
  ON learning_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Retest Eligibility: Users can view and update their own
CREATE POLICY "Users can manage their retest eligibility"
  ON retest_eligibility FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Job Recommendations: Users can view their own
CREATE POLICY "Users can view their job recommendations"
  ON job_role_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert job recommendations"
  ON job_role_recommendations FOR INSERT
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user can retest
CREATE OR REPLACE FUNCTION can_user_retest(
  p_user_id UUID,
  p_skill TEXT,
  p_level TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_eligibility RECORD;
  v_required_count INTEGER;
  v_completed_count INTEGER;
BEGIN
  -- Get retest eligibility
  SELECT * INTO v_eligibility
  FROM retest_eligibility
  WHERE user_id = p_user_id
    AND skill = p_skill
    AND level = p_level;
  
  -- If no record, user can take test
  IF v_eligibility IS NULL THEN
    RETURN true;
  END IF;
  
  -- If already eligible, return true
  IF v_eligibility.can_retest THEN
    RETURN true;
  END IF;
  
  -- Check if all required topics are completed
  v_required_count := array_length(v_eligibility.required_topics, 1);
  v_completed_count := array_length(v_eligibility.completed_topics, 1);
  
  RETURN v_completed_count >= v_required_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update retest eligibility
CREATE OR REPLACE FUNCTION update_retest_eligibility(
  p_user_id UUID,
  p_skill TEXT,
  p_level TEXT,
  p_topic TEXT
)
RETURNS VOID AS $$
DECLARE
  v_eligibility RECORD;
  v_all_completed BOOLEAN;
BEGIN
  -- Get current eligibility
  SELECT * INTO v_eligibility
  FROM retest_eligibility
  WHERE user_id = p_user_id
    AND skill = p_skill
    AND level = p_level;
  
  IF v_eligibility IS NULL THEN
    RETURN;
  END IF;
  
  -- Add topic to completed list if not already there
  UPDATE retest_eligibility
  SET completed_topics = array_append(
        COALESCE(completed_topics, ARRAY[]::TEXT[]),
        p_topic
      ),
      updated_at = NOW()
  WHERE user_id = p_user_id
    AND skill = p_skill
    AND level = p_level
    AND NOT (p_topic = ANY(COALESCE(completed_topics, ARRAY[]::TEXT[])));
  
  -- Check if all topics completed
  SELECT 
    array_length(required_topics, 1) = array_length(completed_topics, 1)
  INTO v_all_completed
  FROM retest_eligibility
  WHERE user_id = p_user_id
    AND skill = p_skill
    AND level = p_level;
  
  -- Update can_retest if all completed
  IF v_all_completed THEN
    UPDATE retest_eligibility
    SET can_retest = true,
        learning_completed = true,
        unlocked_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND skill = p_skill
      AND level = p_level;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get failed topics from test
CREATE OR REPLACE FUNCTION get_failed_topics(
  p_test_attempt_id UUID
)
RETURNS TEXT[] AS $$
DECLARE
  v_failed_topics TEXT[];
BEGIN
  SELECT failed_topics INTO v_failed_topics
  FROM test_attempts
  WHERE id = p_test_attempt_id;
  
  RETURN v_failed_topics;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Evaluation System Enhanced Setup Complete!' as status;

SELECT 
  'questions' as table_name,
  COUNT(*) as row_count
FROM questions
UNION ALL
SELECT 
  'test_attempts' as table_name,
  COUNT(*) as row_count
FROM test_attempts
UNION ALL
SELECT 
  'learning_progress' as table_name,
  COUNT(*) as row_count
FROM learning_progress
UNION ALL
SELECT 
  'retest_eligibility' as table_name,
  COUNT(*) as row_count
FROM retest_eligibility;

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
