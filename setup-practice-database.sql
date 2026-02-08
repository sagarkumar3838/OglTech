-- ========================================
-- Practice System Database Setup
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple-choice',
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at DESC);

-- 2. Create Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  required_skills JSONB NOT NULL,
  min_score_percentage INTEGER NOT NULL CHECK (min_score_percentage >= 0 AND min_score_percentage <= 100),
  description TEXT,
  salary_range TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Practice Results Table
CREATE TABLE IF NOT EXISTS practice_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL NOT NULL,
  time_taken_seconds INTEGER,
  recommended_roles JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_practice_results_user ON practice_results(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_results_skill ON practice_results(skill, level);

-- 4. Insert Job Roles
INSERT INTO job_roles (role_name, category, required_skills, min_score_percentage, description, salary_range) VALUES

-- Web Development Roles
('Frontend Developer', 'web-development', '["html", "css", "javascript"]', 70, 'Build user interfaces and web applications using modern frameworks', '$60k - $120k'),
('Backend Developer', 'web-development', '["python", "nodejs", "sql"]', 70, 'Develop server-side logic, APIs, and database management', '$70k - $130k'),
('Full Stack Developer', 'web-development', '["html", "css", "javascript", "python", "sql"]', 75, 'Handle both frontend and backend development', '$80k - $150k'),

-- Mobile Development Roles
('Mobile App Developer', 'mobile-development', '["kotlin", "swift", "java"]', 70, 'Create native mobile applications for iOS and Android', '$70k - $130k'),
('React Native Developer', 'mobile-development', '["javascript", "react"]', 70, 'Build cross-platform mobile apps with React Native', '$65k - $125k'),

-- DevOps Roles
('DevOps Engineer', 'devops', '["linux", "docker", "kubernetes", "python"]', 75, 'Automate deployment pipelines and manage infrastructure', '$90k - $160k'),
('Cloud Engineer', 'devops', '["docker", "kubernetes", "linux"]', 70, 'Design and manage cloud infrastructure and services', '$85k - $150k'),

-- Cybersecurity Roles
('Security Analyst', 'cybersecurity', '["linux", "python"]', 75, 'Identify and mitigate security threats and vulnerabilities', '$75k - $140k'),
('Penetration Tester', 'cybersecurity', '["linux", "python"]', 80, 'Test systems and networks for security weaknesses', '$80k - $150k'),

-- Graphics/OpenGL Roles
('Graphics Programmer', 'graphics', '["opengl", "cpp", "glsl"]', 75, 'Develop 3D graphics and rendering systems', '$80k - $150k'),
('Game Developer', 'graphics', '["opengl", "cpp"]', 70, 'Create video games and interactive experiences', '$70k - $140k'),
('Shader Developer', 'graphics', '["opengl", "glsl"]', 80, 'Write custom shaders and visual effects', '$75k - $145k'),
('3D Engine Developer', 'graphics', '["opengl", "cpp", "glsl"]', 85, 'Build game engines and 3D rendering frameworks', '$90k - $170k'),
('AR/VR Developer', 'graphics', '["opengl", "cpp"]', 75, 'Create augmented and virtual reality applications', '$85k - $160k'),
('Computer Vision Engineer', 'graphics', '["opengl", "python", "cpp"]', 80, 'Develop image processing and computer vision systems', '$90k - $165k'),
('Rendering Engineer', 'graphics', '["opengl", "cpp", "glsl"]', 85, 'Optimize rendering pipelines and graphics performance', '$95k - $175k'),
('Technical Artist', 'graphics', '["opengl", "glsl"]', 70, 'Bridge art and programming in game development', '$65k - $130k')

ON CONFLICT (role_name) DO UPDATE SET
  category = EXCLUDED.category,
  required_skills = EXCLUDED.required_skills,
  min_score_percentage = EXCLUDED.min_score_percentage,
  description = EXCLUDED.description,
  salary_range = EXCLUDED.salary_range;

-- 5. Enable RLS (Row Level Security)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_results ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies

-- Questions: Everyone can read
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

-- Questions: Only admins can insert/update/delete
CREATE POLICY "Only admins can modify questions"
  ON questions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Job Roles: Everyone can read
CREATE POLICY "Anyone can read job roles"
  ON job_roles FOR SELECT
  USING (true);

-- Practice Results: Users can insert their own
CREATE POLICY "Users can insert their own results"
  ON practice_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Practice Results: Users can read their own
CREATE POLICY "Users can read their own results"
  ON practice_results FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Create helper function to get recommendations
CREATE OR REPLACE FUNCTION get_job_recommendations(
  user_skill TEXT,
  user_percentage DECIMAL
)
RETURNS TABLE (
  role_name TEXT,
  category TEXT,
  description TEXT,
  salary_range TEXT,
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jr.role_name,
    jr.category,
    jr.description,
    jr.salary_range,
    CASE 
      WHEN user_percentage >= jr.min_score_percentage + 20 THEN 100
      WHEN user_percentage >= jr.min_score_percentage + 10 THEN 90
      WHEN user_percentage >= jr.min_score_percentage THEN 80
      ELSE 70
    END as match_score
  FROM job_roles jr
  WHERE jr.required_skills @> to_jsonb(ARRAY[user_skill])
    AND user_percentage >= jr.min_score_percentage - 10
  ORDER BY match_score DESC, jr.min_score_percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Setup Complete!
-- ========================================

-- Verify setup
SELECT 'Questions table' as table_name, COUNT(*) as count FROM questions
UNION ALL
SELECT 'Job roles table', COUNT(*) FROM job_roles
UNION ALL
SELECT 'Practice results table', COUNT(*) FROM practice_results;

-- Show job roles
SELECT role_name, category, min_score_percentage, salary_range 
FROM job_roles 
ORDER BY category, role_name;
