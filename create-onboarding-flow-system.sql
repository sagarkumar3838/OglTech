-- Complete Onboarding Flow System
-- Tracks user journey from signup to career selection to test completion

-- ============================================
-- 1. User Onboarding Status Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_onboarding_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE, -- Firebase UID (string, not UUID)
  profile_completed BOOLEAN DEFAULT false,
  profile_completed_at TIMESTAMP WITH TIME ZONE,
  career_selected BOOLEAN DEFAULT false,
  career_selected_at TIMESTAMP WITH TIME ZONE,
  first_test_taken BOOLEAN DEFAULT false,
  first_test_taken_at TIMESTAMP WITH TIME ZONE,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  current_step TEXT DEFAULT 'profile', -- 'profile', 'career', 'test', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. Enhanced User Profiles Table (if not exists)
-- ============================================
-- Add onboarding-specific fields to existing user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

-- ============================================
-- 3. Test Performance Summary Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_test_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- Firebase UID (string, not UUID)
  career_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  
  -- Easy Level
  easy_attempts INTEGER DEFAULT 0,
  easy_best_score INTEGER DEFAULT 0,
  easy_best_percentage DECIMAL(5,2) DEFAULT 0,
  easy_passed BOOLEAN DEFAULT false,
  easy_last_attempt TIMESTAMP WITH TIME ZONE,
  
  -- Medium Level
  medium_attempts INTEGER DEFAULT 0,
  medium_best_score INTEGER DEFAULT 0,
  medium_best_percentage DECIMAL(5,2) DEFAULT 0,
  medium_passed BOOLEAN DEFAULT false,
  medium_last_attempt TIMESTAMP WITH TIME ZONE,
  
  -- Hard Level
  hard_attempts INTEGER DEFAULT 0,
  hard_best_score INTEGER DEFAULT 0,
  hard_best_percentage DECIMAL(5,2) DEFAULT 0,
  hard_passed BOOLEAN DEFAULT false,
  hard_last_attempt TIMESTAMP WITH TIME ZONE,
  
  -- Overall
  total_attempts INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  skill_mastery_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, career_id, skill_name)
);

-- ============================================
-- 4. Dashboard Statistics View
-- ============================================
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT 
  up.user_id,
  u.email,
  up.full_name,
  up.is_profile_complete,
  uo.current_step as onboarding_step,
  uo.onboarding_completed,
  
  -- Career Info
  (SELECT COUNT(*) FROM public.user_career_selections WHERE user_id = up.user_id AND is_active = true) as active_careers,
  (SELECT career_name FROM public.user_career_selections WHERE user_id = up.user_id AND is_active = true ORDER BY priority LIMIT 1) as primary_career,
  
  -- Test Statistics
  (SELECT COUNT(*) FROM public.user_test_results WHERE user_id = up.user_id) as total_tests_taken,
  (SELECT COUNT(*) FROM public.user_test_results WHERE user_id = up.user_id AND passed = true) as tests_passed,
  (SELECT AVG(percentage) FROM public.user_test_results WHERE user_id = up.user_id) as average_score,
  
  -- Skill Progress
  (SELECT COUNT(*) FROM public.user_skill_progress WHERE user_id = up.user_id AND overall_completion = 100) as skills_mastered,
  (SELECT COUNT(*) FROM public.user_skill_progress WHERE user_id = up.user_id AND overall_completion > 0) as skills_in_progress,
  
  -- Recommendations
  (SELECT COUNT(*) FROM public.career_recommendations WHERE user_id = up.user_id AND is_viewed = false) as unread_recommendations,
  
  -- Recent Activity
  (SELECT MAX(completed_at) FROM public.user_test_results WHERE user_id = up.user_id) as last_test_date,
  (SELECT MAX(last_updated) FROM public.user_skill_progress WHERE user_id = up.user_id) as last_activity_date

FROM public.user_profiles up
LEFT JOIN auth.users u ON up.user_id = u.id::text
LEFT JOIN public.user_onboarding_status uo ON up.user_id = uo.user_id;

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.user_onboarding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_performance ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- User Onboarding Status
CREATE POLICY "Users can view own onboarding status"
  ON public.user_onboarding_status FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own onboarding status"
  ON public.user_onboarding_status FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own onboarding status"
  ON public.user_onboarding_status FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Test Performance
CREATE POLICY "Users can view own test performance"
  ON public.user_test_performance FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own test performance"
  ON public.user_test_performance FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own test performance"
  ON public.user_test_performance FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_onboarding_user_id ON public.user_onboarding_status(user_id);
CREATE INDEX idx_onboarding_current_step ON public.user_onboarding_status(current_step);
CREATE INDEX idx_test_performance_user_id ON public.user_test_performance(user_id);
CREATE INDEX idx_test_performance_career_skill ON public.user_test_performance(career_id, skill_name);

-- ============================================
-- Function: Initialize User Onboarding
-- ============================================
CREATE OR REPLACE FUNCTION initialize_user_onboarding()
RETURNS TRIGGER AS $$
BEGIN
  -- Create onboarding status for new user
  INSERT INTO public.user_onboarding_status (user_id, current_step)
  VALUES (NEW.id, 'profile')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_user_created_init_onboarding ON auth.users;
CREATE TRIGGER on_user_created_init_onboarding
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_onboarding();

-- ============================================
-- Function: Update Onboarding Progress
-- ============================================
CREATE OR REPLACE FUNCTION update_onboarding_progress(
  p_user_id UUID,
  p_step TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_onboarding_status
  SET 
    profile_completed = CASE WHEN p_step = 'profile' THEN true ELSE profile_completed END,
    profile_completed_at = CASE WHEN p_step = 'profile' THEN NOW() ELSE profile_completed_at END,
    career_selected = CASE WHEN p_step = 'career' THEN true ELSE career_selected END,
    career_selected_at = CASE WHEN p_step = 'career' THEN NOW() ELSE career_selected_at END,
    first_test_taken = CASE WHEN p_step = 'test' THEN true ELSE first_test_taken END,
    first_test_taken_at = CASE WHEN p_step = 'test' THEN NOW() ELSE first_test_taken_at END,
    onboarding_completed = CASE WHEN p_step = 'completed' THEN true ELSE onboarding_completed END,
    onboarding_completed_at = CASE WHEN p_step = 'completed' THEN NOW() ELSE onboarding_completed_at END,
    current_step = CASE 
      WHEN p_step = 'profile' THEN 'career'
      WHEN p_step = 'career' THEN 'test'
      WHEN p_step = 'test' THEN 'completed'
      ELSE current_step
    END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: Update Test Performance
-- ============================================
CREATE OR REPLACE FUNCTION update_test_performance(
  p_user_id UUID,
  p_career_id TEXT,
  p_skill_name TEXT,
  p_level TEXT,
  p_score INTEGER,
  p_total_questions INTEGER,
  p_passed BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  v_percentage DECIMAL(5,2);
BEGIN
  v_percentage := (p_score::DECIMAL / p_total_questions::DECIMAL) * 100;
  
  -- Insert or update performance record
  INSERT INTO public.user_test_performance (
    user_id, career_id, skill_name,
    easy_attempts, easy_best_score, easy_best_percentage, easy_passed, easy_last_attempt,
    medium_attempts, medium_best_score, medium_best_percentage, medium_passed, medium_last_attempt,
    hard_attempts, hard_best_score, hard_best_percentage, hard_passed, hard_last_attempt,
    total_attempts
  )
  VALUES (
    p_user_id, p_career_id, p_skill_name,
    CASE WHEN p_level = 'easy' THEN 1 ELSE 0 END,
    CASE WHEN p_level = 'easy' THEN p_score ELSE 0 END,
    CASE WHEN p_level = 'easy' THEN v_percentage ELSE 0 END,
    CASE WHEN p_level = 'easy' THEN p_passed ELSE false END,
    CASE WHEN p_level = 'easy' THEN NOW() ELSE NULL END,
    
    CASE WHEN p_level = 'medium' THEN 1 ELSE 0 END,
    CASE WHEN p_level = 'medium' THEN p_score ELSE 0 END,
    CASE WHEN p_level = 'medium' THEN v_percentage ELSE 0 END,
    CASE WHEN p_level = 'medium' THEN p_passed ELSE false END,
    CASE WHEN p_level = 'medium' THEN NOW() ELSE NULL END,
    
    CASE WHEN p_level = 'hard' THEN 1 ELSE 0 END,
    CASE WHEN p_level = 'hard' THEN p_score ELSE 0 END,
    CASE WHEN p_level = 'hard' THEN v_percentage ELSE 0 END,
    CASE WHEN p_level = 'hard' THEN p_passed ELSE false END,
    CASE WHEN p_level = 'hard' THEN NOW() ELSE NULL END,
    
    1
  )
  ON CONFLICT (user_id, career_id, skill_name)
  DO UPDATE SET
    easy_attempts = CASE WHEN p_level = 'easy' THEN user_test_performance.easy_attempts + 1 ELSE user_test_performance.easy_attempts END,
    easy_best_score = CASE WHEN p_level = 'easy' AND p_score > user_test_performance.easy_best_score THEN p_score ELSE user_test_performance.easy_best_score END,
    easy_best_percentage = CASE WHEN p_level = 'easy' AND v_percentage > user_test_performance.easy_best_percentage THEN v_percentage ELSE user_test_performance.easy_best_percentage END,
    easy_passed = CASE WHEN p_level = 'easy' AND p_passed THEN true ELSE user_test_performance.easy_passed END,
    easy_last_attempt = CASE WHEN p_level = 'easy' THEN NOW() ELSE user_test_performance.easy_last_attempt END,
    
    medium_attempts = CASE WHEN p_level = 'medium' THEN user_test_performance.medium_attempts + 1 ELSE user_test_performance.medium_attempts END,
    medium_best_score = CASE WHEN p_level = 'medium' AND p_score > user_test_performance.medium_best_score THEN p_score ELSE user_test_performance.medium_best_score END,
    medium_best_percentage = CASE WHEN p_level = 'medium' AND v_percentage > user_test_performance.medium_best_percentage THEN v_percentage ELSE user_test_performance.medium_best_percentage END,
    medium_passed = CASE WHEN p_level = 'medium' AND p_passed THEN true ELSE user_test_performance.medium_passed END,
    medium_last_attempt = CASE WHEN p_level = 'medium' THEN NOW() ELSE user_test_performance.medium_last_attempt END,
    
    hard_attempts = CASE WHEN p_level = 'hard' THEN user_test_performance.hard_attempts + 1 ELSE user_test_performance.hard_attempts END,
    hard_best_score = CASE WHEN p_level = 'hard' AND p_score > user_test_performance.hard_best_score THEN p_score ELSE user_test_performance.hard_best_score END,
    hard_best_percentage = CASE WHEN p_level = 'hard' AND v_percentage > user_test_performance.hard_best_percentage THEN v_percentage ELSE user_test_performance.hard_best_percentage END,
    hard_passed = CASE WHEN p_level = 'hard' AND p_passed THEN true ELSE user_test_performance.hard_passed END,
    hard_last_attempt = CASE WHEN p_level = 'hard' THEN NOW() ELSE user_test_performance.hard_last_attempt END,
    
    total_attempts = user_test_performance.total_attempts + 1,
    updated_at = NOW();
    
  -- Calculate average and mastery level
  UPDATE public.user_test_performance
  SET 
    average_score = (
      (COALESCE(easy_best_percentage, 0) + COALESCE(medium_best_percentage, 0) + COALESCE(hard_best_percentage, 0)) / 
      NULLIF((CASE WHEN easy_attempts > 0 THEN 1 ELSE 0 END + CASE WHEN medium_attempts > 0 THEN 1 ELSE 0 END + CASE WHEN hard_attempts > 0 THEN 1 ELSE 0 END), 0)
    ),
    skill_mastery_level = CASE
      WHEN easy_passed AND medium_passed AND hard_passed THEN 'expert'
      WHEN easy_passed AND medium_passed THEN 'advanced'
      WHEN easy_passed THEN 'intermediate'
      ELSE 'beginner'
    END
  WHERE user_id = p_user_id AND career_id = p_career_id AND skill_name = p_skill_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Verify Setup
-- ============================================
SELECT 
  'Onboarding System Tables' as info,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_onboarding_status', 'user_test_performance');

-- Show sample onboarding status
SELECT * FROM public.user_onboarding_status LIMIT 5;
