-- ============================================
-- OGL Skill Evaluation Platform - Supabase Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CAREERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_careers_name ON careers(name);

-- ============================================
-- USER_PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_progress JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, career_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_career_id ON user_progress(career_id);

-- ============================================
-- QUESTIONS TABLE (Question Bank)
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id TEXT NOT NULL UNIQUE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'multi_select', 'coding', 'fill_blank', 'matching')),
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  code_snippet TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  blanks JSONB DEFAULT '[]'::jsonb,
  matching_pairs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

-- ============================================
-- EVALUATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations(status);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id TEXT NOT NULL UNIQUE,
  evaluation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  candidate_name TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_evaluation_id ON submissions(evaluation_id);

-- ============================================
-- SCORECARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scorecards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scorecard_id TEXT NOT NULL UNIQUE,
  submission_id TEXT NOT NULL,
  user_id TEXT NOT NULL,  -- Firebase UID (string, not UUID)
  candidate_name TEXT NOT NULL,
  skill TEXT NOT NULL,
  level_attempted TEXT NOT NULL,
  overall_score NUMERIC NOT NULL,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  level_readiness TEXT NOT NULL CHECK (level_readiness IN ('EXCEEDS_EXPECTATION', 'MEETS_EXPECTATION', 'BELOW_EXPECTATION')),
  observed_maturity TEXT,
  dimension_scores JSONB NOT NULL,
  question_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  hiring_recommendation TEXT NOT NULL CHECK (hiring_recommendation IN ('STRONG_HIRE', 'CONSIDER', 'NO_HIRE')),
  evaluator_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON scorecards(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_submission_id ON scorecards(submission_id);

-- ============================================
-- EVALUATION_CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS evaluation_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key TEXT NOT NULL UNIQUE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 1
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_evaluation_cache_key ON evaluation_cache(cache_key);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_cache ENABLE ROW LEVEL SECURITY;

-- Careers: Public read, authenticated write
CREATE POLICY "Careers are viewable by everyone" ON careers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert careers" ON careers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update careers" ON careers FOR UPDATE USING (auth.role() = 'authenticated');

-- User Progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Questions: Authenticated users can read, system can write
CREATE POLICY "Authenticated users can view questions" ON questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert questions" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Evaluations: Users can only see their own evaluations
CREATE POLICY "Users can view own evaluations" ON evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create evaluations" ON evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evaluations" ON evaluations FOR UPDATE USING (auth.uid() = user_id);

-- Submissions: Users can only see their own submissions
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Scorecards: Users can only see their own scorecards
CREATE POLICY "Users can view own scorecards" ON scorecards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create scorecards" ON scorecards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Evaluation Cache: Authenticated users can read and write
CREATE POLICY "Authenticated users can view cache" ON evaluation_cache FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert cache" ON evaluation_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update cache" ON evaluation_cache FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: 8 OGL Careers
-- ============================================

INSERT INTO careers (name, description, experience_level, skills) VALUES
('OGL Developer', 'Full-stack developer role covering frontend and backend development', 'Mid-Level', 
 '[{"name": "HTML", "required": true}, {"name": "CSS", "required": true}, {"name": "JavaScript", "required": true}, {"name": "TypeScript", "required": false}, {"name": "React", "required": true}, {"name": "Node.js", "required": true}]'::jsonb),

('OGL Tester', 'Manual and automated testing specialist', 'Entry-Level',
 '[{"name": "Testing Tools", "required": true}, {"name": "JavaScript", "required": true}, {"name": "TypeScript", "required": false}, {"name": "HTML", "required": true}, {"name": "CSS", "required": true}]'::jsonb),

('OGL Frontend Developer', 'Specialized in building user interfaces and client-side applications', 'Mid-Level',
 '[{"name": "HTML", "required": true}, {"name": "CSS", "required": true}, {"name": "JavaScript", "required": true}, {"name": "TypeScript", "required": true}, {"name": "React", "required": true}, {"name": "jQuery", "required": false}]'::jsonb),

('OGL Backend Developer', 'Server-side development and API design specialist', 'Mid-Level',
 '[{"name": "JavaScript", "required": true}, {"name": "TypeScript", "required": true}, {"name": "Python", "required": true}, {"name": "Java", "required": true}, {"name": "Node.js", "required": true}]'::jsonb),

('OGL DevOps Developer', 'Infrastructure automation and deployment specialist', 'Senior',
 '[{"name": "Cloud Platforms", "required": true}, {"name": "Docker", "required": true}, {"name": "Kubernetes", "required": true}, {"name": "CI/CD", "required": true}, {"name": "Python", "required": true}]'::jsonb),

('OGL Cloud Developer', 'Cloud-native application development specialist', 'Senior',
 '[{"name": "Cloud Platforms", "required": true}, {"name": "JavaScript", "required": true}, {"name": "Python", "required": true}, {"name": "Serverless", "required": true}, {"name": "Microservices", "required": true}]'::jsonb),

('OGL QA Developer', 'Quality assurance and test automation engineer', 'Entry-Level',
 '[{"name": "Testing Tools", "required": true}, {"name": "TypeScript", "required": true}, {"name": "JavaScript", "required": true}, {"name": "Java", "required": false}, {"name": "HTML", "required": true}, {"name": "CSS", "required": true}]'::jsonb),

('OGL Content Developer', 'Web content development and basic frontend implementation', 'Fresher',
 '[{"name": "HTML", "required": true}, {"name": "CSS", "required": true}, {"name": "JavaScript", "required": true}, {"name": "jQuery", "required": true}, {"name": "OGL Knowledge", "required": true}]'::jsonb)

ON CONFLICT (name) DO NOTHING;
