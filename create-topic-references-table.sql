-- ============================================
-- CREATE TOPIC_REFERENCES TABLE
-- For storing skill topic reference data
-- ============================================

CREATE TABLE IF NOT EXISTS topic_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('basic', 'intermediate', 'advanced')),
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL,
  content TEXT,
  code_examples JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(skill_name, slug)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_topic_references_skill ON topic_references(skill_name);
CREATE INDEX IF NOT EXISTS idx_topic_references_slug ON topic_references(slug);
CREATE INDEX IF NOT EXISTS idx_topic_references_difficulty ON topic_references(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_topic_references_order ON topic_references(skill_name, order_index);

-- Enable RLS
ALTER TABLE topic_references ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access
CREATE POLICY "Topic references are viewable by everyone" 
  ON topic_references FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert topic references" 
  ON topic_references FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update topic references" 
  ON topic_references FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_topic_references_updated_at 
  BEFORE UPDATE ON topic_references
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'topic_references table created successfully!' as status;
