-- ============================================
-- Learning Resources System
-- ============================================
-- This creates tables to store learning resources
-- and track user learning history
-- ============================================

-- 1. Add columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS mdn_link TEXT,
ADD COLUMN IF NOT EXISTS quickref_link TEXT;

-- Create index on topic for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);

-- 2. Create learning_resources table
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  topic TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('mdn', 'quickref', 'youtube', 'article', 'tutorial')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ml', 'te', 'kn')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration TEXT, -- For videos: "10:30"
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  rating DECIMAL(3,2) DEFAULT 0.0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_skill ON learning_resources(skill);
CREATE INDEX IF NOT EXISTS idx_learning_resources_topic ON learning_resources(topic);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_language ON learning_resources(language);

-- 3. Create user_learning_history table
CREATE TABLE IF NOT EXISTS user_learning_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  scorecard_id TEXT,
  question_id TEXT,
  topic TEXT NOT NULL,
  resource_id UUID REFERENCES learning_resources(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INTEGER DEFAULT 0,
  helpful BOOLEAN,
  feedback TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_learning_history_user_id ON user_learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_topic ON user_learning_history(topic);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_resource_id ON user_learning_history(resource_id);

-- 4. Update scorecards table
ALTER TABLE scorecards
ADD COLUMN IF NOT EXISTS topics_mastered JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS topics_to_practice JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS learning_resources JSONB DEFAULT '[]'::jsonb;

-- 5. Enable RLS on new tables
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_resources (public read, authenticated write)
CREATE POLICY "Anyone can view learning resources" ON learning_resources
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add resources" ON learning_resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for user_learning_history (users see only their own)
CREATE POLICY "Users can view own learning history" ON user_learning_history
  FOR SELECT USING ((user_id)::text = (auth.uid())::text);

CREATE POLICY "Users can insert own learning history" ON user_learning_history
  FOR INSERT WITH CHECK ((user_id)::text = (auth.uid())::text);

-- Grant permissions
GRANT SELECT ON learning_resources TO authenticated, anon;
GRANT INSERT ON learning_resources TO authenticated;
GRANT SELECT, INSERT ON user_learning_history TO authenticated;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Learning Resources System Created!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Tables created:';
  RAISE NOTICE '✅   - learning_resources';
  RAISE NOTICE '✅   - user_learning_history';
  RAISE NOTICE '✅ Columns added to:';
  RAISE NOTICE '✅   - questions (topic, explanation, links)';
  RAISE NOTICE '✅   - scorecards (topics_mastered, topics_to_practice)';
  RAISE NOTICE '✅ ============================================';
END $$;
