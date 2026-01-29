-- ============================================
-- Topic Knowledge Base - Link-Based Approach
-- ============================================
-- Stores links to educational resources (LEGAL)
-- Does NOT copy copyrighted content
-- ============================================

CREATE TABLE IF NOT EXISTS topic_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  
  -- Content Summary (your own words, not copied)
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- External Resource Links (LEGAL - just links)
  w3schools_url TEXT,
  mdn_url TEXT,
  geeksforgeeks_url TEXT,
  javascript_info_url TEXT,
  freecodecamp_url TEXT,
  
  -- YouTube Video Links (LEGAL - just links)
  youtube_en TEXT,
  youtube_hi TEXT,
  youtube_ml TEXT,
  youtube_te TEXT,
  youtube_kn TEXT,
  
  -- Your Own Content (LEGAL - you create it)
  key_points JSONB DEFAULT '[]'::jsonb,
  code_examples JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  best_practices JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  tags TEXT[],
  prerequisites TEXT[],
  related_topics TEXT[],
  estimated_time_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topic_kb_skill ON topic_knowledge_base(skill);
CREATE INDEX IF NOT EXISTS idx_topic_kb_topic ON topic_knowledge_base(topic);
CREATE INDEX IF NOT EXISTS idx_topic_kb_difficulty ON topic_knowledge_base(difficulty_level);

-- Enable RLS
ALTER TABLE topic_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view knowledge base" ON topic_knowledge_base
  FOR SELECT USING (true);

-- Authenticated users can add/edit
CREATE POLICY "Authenticated users can manage knowledge base" ON topic_knowledge_base
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON topic_knowledge_base TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON topic_knowledge_base TO authenticated;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Topic Knowledge Base Created!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Stores LINKS to external resources (legal)';
  RAISE NOTICE '✅ Stores YOUR OWN content (legal)';
  RAISE NOTICE '✅ Does NOT copy copyrighted content';
  RAISE NOTICE '✅ ============================================';
END $$;
