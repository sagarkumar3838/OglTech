-- ============================================
-- EVALUATION SESSIONS TABLE
-- Tracks active evaluation sessions and detects tab switches
-- ============================================

CREATE TABLE IF NOT EXISTS evaluation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  evaluation_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  invalidated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  tab_switches INTEGER DEFAULT 0,
  invalidation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON evaluation_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON evaluation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON evaluation_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_user_skill_level ON evaluation_sessions(user_id, skill, level);

-- Enable RLS
ALTER TABLE evaluation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sessions" 
ON evaluation_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" 
ON evaluation_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" 
ON evaluation_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Success message
SELECT 'Successfully created evaluation_sessions table!' as message;
