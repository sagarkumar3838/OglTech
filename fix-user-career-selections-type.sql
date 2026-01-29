-- ============================================
-- FIX USER_CAREER_SELECTIONS TABLE
-- Change user_id from UUID to TEXT for Firebase compatibility
-- ============================================

-- Drop existing table if it has wrong type
DROP TABLE IF EXISTS user_career_selections CASCADE;

-- Recreate with correct type (TEXT for Firebase UID)
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_career_selections_user ON user_career_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_career_selections_career ON user_career_selections(career_id);
CREATE INDEX IF NOT EXISTS idx_user_career_selections_active ON user_career_selections(user_id, is_active);

-- Enable RLS
ALTER TABLE user_career_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own career selections" 
  ON user_career_selections FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own career selections" 
  ON user_career_selections FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own career selections" 
  ON user_career_selections FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own career selections" 
  ON user_career_selections FOR DELETE 
  USING (auth.uid()::text = user_id);

SELECT 'user_career_selections table fixed - now uses TEXT for user_id' as status;
