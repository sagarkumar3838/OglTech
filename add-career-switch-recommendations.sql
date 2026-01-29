-- Add Career Switch Recommendations System
-- This enables suggesting different careers based on user's skills

-- ============================================
-- 1. Add Career Switch Paths Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_switch_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_career_id TEXT NOT NULL,
  to_career_id TEXT NOT NULL,
  to_career_name TEXT NOT NULL,
  matching_skills TEXT[] NOT NULL, -- Skills that transfer
  additional_skills_needed TEXT[], -- New skills to learn
  difficulty_level TEXT, -- 'easy', 'medium', 'hard'
  estimated_time_months INTEGER,
  salary_change_percentage INTEGER, -- Expected salary change
  job_market_demand TEXT, -- 'high', 'medium', 'low'
  description TEXT,
  why_switch TEXT, -- Reasons to consider this switch
  UNIQUE(from_career_id, to_career_id)
);

-- ============================================
-- 2. Add Skill Compatibility Matrix Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.skill_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  compatible_careers TEXT[] NOT NULL, -- Careers where this skill is valuable
  transferability_score INTEGER, -- 0-100, how transferable is this skill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Update Career Recommendations to include switch type
-- ============================================
ALTER TABLE public.career_recommendations 
ADD COLUMN IF NOT EXISTS recommendation_type TEXT DEFAULT 'progression'; -- 'progression' or 'switch'

ALTER TABLE public.career_recommendations 
ADD COLUMN IF NOT EXISTS transferable_skills TEXT[]; -- Skills that transfer to new career

ALTER TABLE public.career_recommendations 
ADD COLUMN IF NOT EXISTS new_skills_needed TEXT[]; -- Skills user needs to learn

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.career_switch_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_compatibility ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies (Public read for reference data)
-- ============================================
CREATE POLICY "Anyone can view career switch paths"
  ON public.career_switch_paths FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view skill compatibility"
  ON public.skill_compatibility FOR SELECT
  USING (true);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_career_switch_from ON public.career_switch_paths(from_career_id);
CREATE INDEX idx_career_switch_to ON public.career_switch_paths(to_career_id);
CREATE INDEX idx_skill_compatibility_skill ON public.skill_compatibility(skill_name);

-- ============================================
-- Insert Career Switch Paths
-- ============================================

-- OGL to Other Tech Careers
INSERT INTO public.career_switch_paths (
  from_career_id, to_career_id, to_career_name,
  matching_skills, additional_skills_needed,
  difficulty_level, estimated_time_months,
  salary_change_percentage, job_market_demand,
  description, why_switch
) VALUES
-- OGL to Frontend
(
  'ogl-content-developer', 'frontend-developer', 'Frontend Developer',
  ARRAY['javascript', 'html', 'css'],
  ARRAY['react', 'vue', 'responsive-design'],
  'easy', 4, 10, 'high',
  'Leverage your programming skills in web development',
  'High demand, remote opportunities, faster development cycles, large community'
),
-- OGL to Game Development
(
  'ogl-content-developer', 'game-developer', 'Game Developer',
  ARRAY['ogl', 'c++', '3d-graphics'],
  ARRAY['unity', 'unreal', 'game-design'],
  'medium', 6, 15, 'high',
  'Apply your graphics knowledge to game development',
  'Creative work, growing industry, work on exciting projects, good compensation'
),
-- OGL to VR/AR
(
  'ogl-content-developer', 'vr-ar-developer', 'VR/AR Developer',
  ARRAY['ogl', '3d-graphics', 'shaders'],
  ARRAY['unity-xr', 'spatial-computing', 'interaction-design'],
  'medium', 8, 25, 'high',
  'Enter the cutting-edge field of immersive technologies',
  'Emerging field, high salaries, innovative work, future-proof career'
),

-- Frontend to Backend
(
  'frontend-developer', 'backend-developer', 'Backend Developer',
  ARRAY['javascript', 'apis', 'databases'],
  ARRAY['nodejs', 'sql', 'server-architecture'],
  'medium', 6, 5, 'high',
  'Expand to server-side development',
  'Higher salaries, system design experience, full control over data'
),
-- Frontend to Mobile
(
  'frontend-developer', 'mobile-developer', 'Mobile Developer',
  ARRAY['javascript', 'html', 'css', 'ui-design'],
  ARRAY['react-native', 'flutter', 'mobile-apis'],
  'easy', 5, 15, 'high',
  'Build mobile applications using your web skills',
  'High demand, app store revenue, native development, growing market'
),
-- Frontend to Data Visualization
(
  'frontend-developer', 'data-visualization-specialist', 'Data Visualization Specialist',
  ARRAY['javascript', 'html', 'css', 'd3js'],
  ARRAY['data-analysis', 'statistics', 'tableau'],
  'medium', 7, 20, 'medium',
  'Combine design and data skills',
  'Unique niche, high value, work with data teams, creative + analytical'
),

-- Backend to DevOps
(
  'backend-developer', 'devops-engineer', 'DevOps Engineer',
  ARRAY['nodejs', 'linux', 'databases', 'apis'],
  ARRAY['docker', 'kubernetes', 'ci-cd', 'monitoring'],
  'medium', 8, 20, 'high',
  'Focus on infrastructure and deployment',
  'High salaries, critical role, automation, cloud expertise'
),
-- Backend to Data Engineering
(
  'backend-developer', 'data-engineer', 'Data Engineer',
  ARRAY['databases', 'sql', 'python', 'apis'],
  ARRAY['spark', 'airflow', 'data-pipelines', 'etl'],
  'hard', 10, 25, 'high',
  'Work with big data and analytics',
  'Very high demand, excellent pay, work with cutting-edge tech'
),
-- Backend to Cloud Architect
(
  'backend-developer', 'cloud-architect', 'Cloud Architect',
  ARRAY['nodejs', 'databases', 'apis', 'architecture'],
  ARRAY['aws', 'azure', 'microservices', 'security'],
  'hard', 12, 30, 'high',
  'Design cloud-based solutions',
  'Top-tier salaries, strategic role, high impact, consulting opportunities'
);

-- ============================================
-- Insert Skill Compatibility Data
-- ============================================
INSERT INTO public.skill_compatibility (
  skill_name, compatible_careers, transferability_score
) VALUES
('ogl', ARRAY['game-developer', 'vr-ar-developer', 'graphics-programmer', '3d-artist'], 90),
('javascript', ARRAY['frontend-developer', 'fullstack-developer', 'mobile-developer', 'backend-developer'], 95),
('html', ARRAY['frontend-developer', 'fullstack-developer', 'email-developer', 'wordpress-developer'], 85),
('css', ARRAY['frontend-developer', 'ui-developer', 'email-developer', 'wordpress-developer'], 85),
('react', ARRAY['frontend-developer', 'fullstack-developer', 'mobile-developer'], 90),
('nodejs', ARRAY['backend-developer', 'fullstack-developer', 'devops-engineer'], 90),
('python', ARRAY['backend-developer', 'data-scientist', 'ml-engineer', 'data-engineer'], 95),
('sql', ARRAY['backend-developer', 'data-analyst', 'data-engineer', 'database-admin'], 90),
('docker', ARRAY['devops-engineer', 'backend-developer', 'cloud-engineer'], 85),
('aws', ARRAY['cloud-architect', 'devops-engineer', 'backend-developer'], 90),
('c++', ARRAY['game-developer', 'systems-programmer', 'embedded-developer'], 85),
('unity', ARRAY['game-developer', 'vr-ar-developer', 'simulation-developer'], 90),
('3d-modeling', ARRAY['3d-artist', 'game-developer', 'vr-ar-developer'], 80);

-- ============================================
-- Function to Generate Career Switch Recommendations
-- ============================================
CREATE OR REPLACE FUNCTION generate_career_switch_recommendations(
  p_user_id UUID,
  p_current_career_id TEXT
)
RETURNS TABLE (
  recommended_career_id TEXT,
  recommended_career_name TEXT,
  match_score INTEGER,
  transferable_skills TEXT[],
  new_skills_needed TEXT[],
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_skills AS (
    -- Get all skills user has completed
    SELECT DISTINCT skill_name
    FROM public.user_skill_progress
    WHERE user_id = p_user_id
      AND overall_completion >= 80 -- At least 80% complete
  ),
  career_matches AS (
    -- Find careers that match user's skills
    SELECT 
      csp.to_career_id,
      csp.to_career_name,
      csp.matching_skills,
      csp.additional_skills_needed,
      csp.why_switch,
      -- Calculate match score
      (
        SELECT COUNT(*)::INTEGER
        FROM unnest(csp.matching_skills) AS skill
        WHERE skill IN (SELECT skill_name FROM user_skills)
      ) * 100 / GREATEST(array_length(csp.matching_skills, 1), 1) AS match_percentage
    FROM public.career_switch_paths csp
    WHERE csp.from_career_id = p_current_career_id
  )
  SELECT 
    cm.to_career_id,
    cm.to_career_name,
    cm.match_percentage,
    cm.matching_skills,
    cm.additional_skills_needed,
    cm.why_switch
  FROM career_matches cm
  WHERE cm.match_percentage >= 30 -- At least 30% skill match
  ORDER BY cm.match_percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Verify Setup
-- ============================================
SELECT 
  'Career Switch Paths' as table_name,
  COUNT(*) as record_count
FROM public.career_switch_paths
UNION ALL
SELECT 
  'Skill Compatibility' as table_name,
  COUNT(*) as record_count
FROM public.skill_compatibility;

-- Show sample career switches
SELECT 
  from_career_id,
  to_career_name,
  difficulty_level,
  estimated_time_months,
  salary_change_percentage,
  job_market_demand
FROM public.career_switch_paths
ORDER BY from_career_id, salary_change_percentage DESC;
