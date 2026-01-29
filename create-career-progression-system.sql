-- Complete Career Progression System Database Schema
-- This creates all necessary tables for the career progression flow

-- ============================================
-- 1. User Career Selections Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_career_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  career_name TEXT NOT NULL,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- 1 = primary, 2 = secondary
  UNIQUE(user_id, career_id)
);

-- ============================================
-- 2. User Test Results Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL, -- 'easy', 'medium', 'hard'
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scorecard_data JSONB -- Store full scorecard details
);

-- ============================================
-- 3. User Skill Progress Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  easy_completed BOOLEAN DEFAULT false,
  easy_score INTEGER,
  medium_completed BOOLEAN DEFAULT false,
  medium_score INTEGER,
  hard_completed BOOLEAN DEFAULT false,
  hard_score INTEGER,
  overall_completion DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, career_id, skill_name)
);

-- ============================================
-- 4. Career Recommendations Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_career_id TEXT NOT NULL,
  recommended_career_id TEXT NOT NULL,
  recommended_career_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  based_on_skills TEXT[], -- Array of skills user excels in
  confidence_score DECIMAL(5,2), -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_viewed BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false
);

-- ============================================
-- 5. Learning Resources Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'video', 'article', 'course', 'practice'
  resource_url TEXT,
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. Career Progression Paths Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_progression_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_career_id TEXT NOT NULL,
  to_career_id TEXT NOT NULL,
  to_career_name TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  recommended_skills TEXT[],
  difficulty_level TEXT, -- 'easy', 'medium', 'hard'
  estimated_time_months INTEGER,
  description TEXT,
  UNIQUE(from_career_id, to_career_id)
);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE public.user_career_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_progression_paths ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- User Career Selections Policies
CREATE POLICY "Users can view own career selections"
  ON public.user_career_selections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career selections"
  ON public.user_career_selections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career selections"
  ON public.user_career_selections FOR UPDATE
  USING (auth.uid() = user_id);

-- User Test Results Policies
CREATE POLICY "Users can view own test results"
  ON public.user_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
  ON public.user_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Skill Progress Policies
CREATE POLICY "Users can view own skill progress"
  ON public.user_skill_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill progress"
  ON public.user_skill_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill progress"
  ON public.user_skill_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Career Recommendations Policies
CREATE POLICY "Users can view own recommendations"
  ON public.career_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.career_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON public.career_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- Learning Resources Policies (Public read)
CREATE POLICY "Anyone can view learning resources"
  ON public.learning_resources FOR SELECT
  USING (true);

-- Career Progression Paths Policies (Public read)
CREATE POLICY "Anyone can view career progression paths"
  ON public.career_progression_paths FOR SELECT
  USING (true);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_user_career_selections_user_id ON public.user_career_selections(user_id);
CREATE INDEX idx_user_test_results_user_id ON public.user_test_results(user_id);
CREATE INDEX idx_user_test_results_career_skill ON public.user_test_results(career_id, skill_name);
CREATE INDEX idx_user_skill_progress_user_id ON public.user_skill_progress(user_id);
CREATE INDEX idx_career_recommendations_user_id ON public.career_recommendations(user_id);
CREATE INDEX idx_learning_resources_skill ON public.learning_resources(skill_name, level);
CREATE INDEX idx_career_progression_from ON public.career_progression_paths(from_career_id);

-- ============================================
-- Verify Tables Created
-- ============================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'user_career_selections',
    'user_test_results',
    'user_skill_progress',
    'career_recommendations',
    'learning_resources',
    'career_progression_paths'
  )
ORDER BY table_name;
