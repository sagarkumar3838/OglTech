-- ============================================
-- EVALUATION TRACKING & TOPIC LEARNING SYSTEM
-- ============================================

-- 1. Evaluation Sessions Table (Track 24-hour time limits)
CREATE TABLE IF NOT EXISTS evaluation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  current_level TEXT NOT NULL CHECK (current_level IN ('basic', 'intermediate', 'advanced')),
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'passed', 'failed', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  score INTEGER,
  total_questions INTEGER,
  correct_answers INTEGER,
  wrong_answers INTEGER,
  can_retest BOOLEAN DEFAULT false,
  retest_available_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Weak Topics Identification Table
CREATE TABLE IF NOT EXISTS user_weak_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluation_session_id UUID REFERENCES evaluation_sessions(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('basic', 'intermediate', 'advanced')),
  topic_id UUID NOT NULL REFERENCES topic_references(id),
  topic_name TEXT NOT NULL,
  wrong_count INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2),
  status TEXT NOT NULL CHECK (status IN ('needs_review', 'in_progress', 'completed', 'mastered')),
  started_learning_at TIMESTAMPTZ,
  completed_learning_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, evaluation_session_id, topic_id)
);

-- 3. Topic References System (Like quickref.me)
CREATE TABLE IF NOT EXISTS topic_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('basic', 'intermediate', 'advanced')),
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Topic Content Sections (Detailed reference content)
CREATE TABLE IF NOT EXISTS topic_content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES topic_references(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN ('syntax', 'example', 'explanation', 'code', 'table', 'list', 'note', 'warning', 'tip')),
  content TEXT NOT NULL,
  code_language TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Topic Examples (Code examples and use cases)
CREATE TABLE IF NOT EXISTS topic_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES topic_references(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  output TEXT,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Topic Progress Tracking
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topic_references(id) ON DELETE CASCADE,
  weak_topic_id UUID REFERENCES user_weak_topics(id),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'reading', 'completed', 'bookmarked')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  last_read_section_id UUID REFERENCES topic_content_sections(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 7. Retest Eligibility Tracking
CREATE TABLE IF NOT EXISTS retest_eligibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluation_session_id UUID NOT NULL REFERENCES evaluation_sessions(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL,
  required_topics_count INTEGER NOT NULL,
  completed_topics_count INTEGER DEFAULT 0,
  is_eligible BOOLEAN DEFAULT false,
  eligible_at TIMESTAMPTZ,
  retest_taken BOOLEAN DEFAULT false,
  retest_session_id UUID REFERENCES evaluation_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, evaluation_session_id)
);

-- 8. Topic Bookmarks
CREATE TABLE IF NOT EXISTS topic_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topic_references(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 9. Topic Search History
CREATE TABLE IF NOT EXISTS topic_search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_evaluation_sessions_user ON evaluation_sessions(user_id, skill_name, current_level);
CREATE INDEX idx_evaluation_sessions_expires ON evaluation_sessions(expires_at) WHERE status = 'in_progress';
CREATE INDEX idx_weak_topics_user ON user_weak_topics(user_id, status);
CREATE INDEX idx_weak_topics_session ON user_weak_topics(evaluation_session_id);
CREATE INDEX idx_topic_references_skill ON topic_references(skill_name, difficulty_level);
CREATE INDEX idx_topic_references_slug ON topic_references(slug);
CREATE INDEX idx_topic_content_topic ON topic_content_sections(topic_id, order_index);
CREATE INDEX idx_topic_examples_topic ON topic_examples(topic_id, order_index);
CREATE INDEX idx_user_topic_progress_user ON user_topic_progress(user_id, status);
CREATE INDEX idx_retest_eligibility_user ON retest_eligibility(user_id, is_eligible);

-- Enable Row Level Security
ALTER TABLE evaluation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weak_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE retest_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Evaluation Sessions
CREATE POLICY "Users can view own evaluation sessions" ON evaluation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own evaluation sessions" ON evaluation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evaluation sessions" ON evaluation_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Weak Topics
CREATE POLICY "Users can view own weak topics" ON user_weak_topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own weak topics" ON user_weak_topics FOR ALL USING (auth.uid() = user_id);

-- Topic References (Public read, admin write)
CREATE POLICY "Anyone can view topic references" ON topic_references FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage topic references" ON topic_references FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Topic Content (Public read)
CREATE POLICY "Anyone can view topic content" ON topic_content_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage topic content" ON topic_content_sections FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Topic Examples (Public read)
CREATE POLICY "Anyone can view topic examples" ON topic_examples FOR SELECT USING (true);
CREATE POLICY "Admins can manage topic examples" ON topic_examples FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User Topic Progress
CREATE POLICY "Users can view own topic progress" ON user_topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own topic progress" ON user_topic_progress FOR ALL USING (auth.uid() = user_id);

-- Retest Eligibility
CREATE POLICY "Users can view own retest eligibility" ON retest_eligibility FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own retest eligibility" ON retest_eligibility FOR ALL USING (auth.uid() = user_id);

-- Topic Bookmarks
CREATE POLICY "Users can manage own bookmarks" ON topic_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Search History
CREATE POLICY "Users can manage own search history" ON topic_search_history FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic tracking
CREATE OR REPLACE FUNCTION check_evaluation_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'in_progress' AND NEW.expires_at < NOW() THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluation_expiry_check
  BEFORE UPDATE ON evaluation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION check_evaluation_expiry();

-- Function to update retest eligibility
CREATE OR REPLACE FUNCTION update_retest_eligibility()
RETURNS TRIGGER AS $$
DECLARE
  v_required_count INTEGER;
  v_completed_count INTEGER;
BEGIN
  -- Get required topics count
  SELECT COUNT(*) INTO v_required_count
  FROM user_weak_topics
  WHERE user_id = NEW.user_id 
    AND evaluation_session_id = NEW.weak_topic_id;
  
  -- Get completed topics count
  SELECT COUNT(*) INTO v_completed_count
  FROM user_weak_topics
  WHERE user_id = NEW.user_id 
    AND evaluation_session_id = NEW.weak_topic_id
    AND status = 'completed';
  
  -- Update retest eligibility
  UPDATE retest_eligibility
  SET completed_topics_count = v_completed_count,
      is_eligible = (v_completed_count >= v_required_count),
      eligible_at = CASE WHEN v_completed_count >= v_required_count THEN NOW() ELSE NULL END,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_retest_on_topic_completion
  AFTER UPDATE ON user_topic_progress
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_retest_eligibility();
