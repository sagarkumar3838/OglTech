-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,  -- Firebase UID
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  user_role TEXT,
  experience_level TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  learning_goals JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  preferred_learning_style TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (user_id = auth.uid()::text);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USER COURSE ENROLLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'locked')),
  progress NUMERIC DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, career_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_user_id ON user_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_enrollments_career_id ON user_course_enrollments(career_id);

-- Enable RLS
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own enrollments" ON user_course_enrollments FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert own enrollments" ON user_course_enrollments FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update own enrollments" ON user_course_enrollments FOR UPDATE USING (user_id = auth.uid()::text);

-- Trigger for updated_at
CREATE TRIGGER update_user_course_enrollments_updated_at BEFORE UPDATE ON user_course_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  up.user_id,
  up.full_name,
  up.avatar_url,
  up.user_role,
  up.experience_level,
  COUNT(DISTINCT s.id) as total_tests,
  COALESCE(AVG(sc.overall_score), 0) as average_score,
  COALESCE(SUM(sc.correct_count), 0) as total_correct,
  COALESCE(SUM(sc.total_questions), 0) as total_questions_attempted,
  MAX(sc.created_at) as last_test_date,
  RANK() OVER (ORDER BY COALESCE(AVG(sc.overall_score), 0) DESC, COUNT(DISTINCT s.id) DESC) as rank
FROM user_profiles up
LEFT JOIN submissions s ON up.user_id::text = s.user_id::text
LEFT JOIN scorecards sc ON s.submission_id::text = sc.submission_id::text
GROUP BY up.user_id, up.full_name, up.avatar_url, up.user_role, up.experience_level
ORDER BY average_score DESC, total_tests DESC;

-- Grant access to leaderboard view
GRANT SELECT ON leaderboard TO authenticated, anon;
