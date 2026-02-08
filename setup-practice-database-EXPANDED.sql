-- ========================================
-- EXPANDED Practice System Database Setup
-- Includes: DevTools, Oracle, Java, and More Jobs
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create Questions Table (if not exists)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple-choice',
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

-- 2. Create Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  required_skills JSONB NOT NULL,
  min_score_percentage INTEGER NOT NULL CHECK (min_score_percentage >= 0 AND min_score_percentage <= 100),
  description TEXT,
  salary_range TEXT,
  experience_level TEXT,
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

CREATE INDEX IF NOT EXISTS idx_practice_results_user ON practice_results(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_results_skill ON practice_results(skill, level);

-- 4. Insert EXPANDED Job Roles (50+ roles)
INSERT INTO job_roles (role_name, category, required_skills, min_score_percentage, description, salary_range, experience_level) VALUES

-- ========================================
-- WEB DEVELOPMENT (5 roles)
-- ========================================
('Frontend Developer', 'web-development', '["html", "css", "javascript"]', 70, 'Build user interfaces and web applications using modern frameworks', '$60k - $120k', 'Junior to Mid'),
('Backend Developer', 'web-development', '["python", "nodejs", "sql", "java"]', 70, 'Develop server-side logic, APIs, and database management', '$70k - $130k', 'Junior to Mid'),
('Full Stack Developer', 'web-development', '["html", "css", "javascript", "python", "sql"]', 75, 'Handle both frontend and backend development', '$80k - $150k', 'Mid to Senior'),
('UI/UX Developer', 'web-development', '["html", "css", "javascript", "figma"]', 65, 'Create beautiful and intuitive user interfaces', '$55k - $110k', 'Junior to Mid'),
('Web Performance Engineer', 'web-development', '["javascript", "devtools", "webpack"]', 80, 'Optimize web application performance and loading times', '$90k - $160k', 'Senior'),

-- ========================================
-- BACKEND & DATABASE (8 roles)
-- ========================================
('Java Developer', 'backend', '["java", "spring", "sql"]', 70, 'Build enterprise applications with Java and Spring framework', '$75k - $140k', 'Junior to Senior'),
('Python Developer', 'backend', '["python", "django", "sql"]', 70, 'Develop scalable applications using Python', '$70k - $135k', 'Junior to Senior'),
('Node.js Developer', 'backend', '["nodejs", "javascript", "sql"]', 70, 'Build fast and scalable server-side applications', '$70k - $130k', 'Junior to Mid'),
('Database Administrator', 'backend', '["sql", "oracle", "postgresql"]', 75, 'Manage and optimize database systems', '$80k - $150k', 'Mid to Senior'),
('Oracle Database Developer', 'backend', '["oracle", "sql", "plsql"]', 75, 'Design and develop Oracle database solutions', '$85k - $155k', 'Mid to Senior'),
('API Developer', 'backend', '["nodejs", "python", "java", "rest"]', 70, 'Design and build RESTful APIs', '$75k - $140k', 'Junior to Senior'),
('Microservices Architect', 'backend', '["java", "python", "docker", "kubernetes"]', 85, 'Design distributed microservices architectures', '$120k - $200k', 'Senior to Lead'),
('.NET Developer', 'backend', '["csharp", "dotnet", "sql"]', 70, 'Build applications using Microsoft .NET framework', '$70k - $135k', 'Junior to Senior'),

-- ========================================
-- MOBILE DEVELOPMENT (4 roles)
-- ========================================
('Android Developer', 'mobile-development', '["java", "kotlin", "android"]', 70, 'Create native Android applications', '$70k - $135k', 'Junior to Senior'),
('iOS Developer', 'mobile-development', '["swift", "ios", "xcode"]', 70, 'Build native iOS applications', '$75k - $140k', 'Junior to Senior'),
('React Native Developer', 'mobile-development', '["javascript", "react", "reactnative"]', 70, 'Build cross-platform mobile apps with React Native', '$65k - $125k', 'Junior to Mid'),
('Flutter Developer', 'mobile-development', '["dart", "flutter"]', 70, 'Create beautiful cross-platform mobile apps', '$65k - $130k', 'Junior to Mid'),

-- ========================================
-- DEVOPS & CLOUD (8 roles)
-- ========================================
('DevOps Engineer', 'devops', '["linux", "docker", "kubernetes", "python", "git"]', 75, 'Automate deployment pipelines and manage infrastructure', '$90k - $160k', 'Mid to Senior'),
('Cloud Engineer', 'devops', '["aws", "azure", "docker", "kubernetes"]', 75, 'Design and manage cloud infrastructure', '$85k - $155k', 'Mid to Senior'),
('Site Reliability Engineer (SRE)', 'devops', '["linux", "python", "kubernetes", "monitoring"]', 80, 'Ensure system reliability and performance', '$95k - $170k', 'Senior'),
('CI/CD Engineer', 'devops', '["jenkins", "git", "docker", "linux"]', 75, 'Build and maintain continuous integration pipelines', '$85k - $150k', 'Mid to Senior'),
('Infrastructure Engineer', 'devops', '["terraform", "ansible", "linux", "cloud"]', 75, 'Manage and automate infrastructure as code', '$85k - $155k', 'Mid to Senior'),
('Kubernetes Administrator', 'devops', '["kubernetes", "docker", "linux"]', 80, 'Manage and optimize Kubernetes clusters', '$90k - $165k', 'Senior'),
('AWS Solutions Architect', 'devops', '["aws", "cloud", "architecture"]', 80, 'Design scalable AWS cloud solutions', '$100k - $180k', 'Senior to Lead'),
('Azure DevOps Engineer', 'devops', '["azure", "devops", "ci-cd"]', 75, 'Implement DevOps practices on Azure platform', '$85k - $155k', 'Mid to Senior'),

-- ========================================
-- CYBERSECURITY (6 roles)
-- ========================================
('Security Analyst', 'cybersecurity', '["linux", "python", "networking"]', 75, 'Identify and mitigate security threats', '$75k - $140k', 'Junior to Mid'),
('Penetration Tester', 'cybersecurity', '["linux", "python", "security-tools"]', 80, 'Test systems for security vulnerabilities', '$80k - $150k', 'Mid to Senior'),
('Security Engineer', 'cybersecurity', '["linux", "python", "security", "networking"]', 80, 'Build and maintain security systems', '$85k - $160k', 'Mid to Senior'),
('Application Security Engineer', 'cybersecurity', '["java", "python", "security", "devtools"]', 80, 'Secure applications and code', '$85k - $155k', 'Mid to Senior'),
('Cloud Security Engineer', 'cybersecurity', '["aws", "azure", "security", "cloud"]', 80, 'Secure cloud infrastructure and services', '$90k - $165k', 'Senior'),
('SOC Analyst', 'cybersecurity', '["security-tools", "monitoring", "incident-response"]', 70, 'Monitor and respond to security incidents', '$70k - $130k', 'Junior to Mid'),

-- ========================================
-- DATA & AI (6 roles)
-- ========================================
('Data Engineer', 'data-ai', '["python", "sql", "spark", "etl"]', 75, 'Build data pipelines and infrastructure', '$85k - $155k', 'Mid to Senior'),
('Data Scientist', 'data-ai', '["python", "sql", "machine-learning", "statistics"]', 80, 'Analyze data and build predictive models', '$90k - $165k', 'Mid to Senior'),
('Machine Learning Engineer', 'data-ai', '["python", "tensorflow", "pytorch", "ml"]', 80, 'Develop and deploy ML models', '$95k - $175k', 'Senior'),
('AI Engineer', 'data-ai', '["python", "ai", "deep-learning"]', 80, 'Build AI-powered applications', '$95k - $180k', 'Senior'),
('Data Analyst', 'data-ai', '["sql", "python", "excel", "bi-tools"]', 65, 'Analyze data and create insights', '$60k - $110k', 'Junior to Mid'),
('Business Intelligence Developer', 'data-ai', '["sql", "tableau", "powerbi"]', 70, 'Create dashboards and reports', '$70k - $130k', 'Junior to Senior'),

-- ========================================
-- GRAPHICS & GAME DEVELOPMENT (10 roles)
-- ========================================
('Graphics Programmer', 'graphics', '["opengl", "cpp", "glsl"]', 75, 'Develop 3D graphics and rendering systems', '$80k - $150k', 'Mid to Senior'),
('Game Developer', 'graphics', '["opengl", "cpp", "unity", "unreal"]', 70, 'Create video games and interactive experiences', '$70k - $140k', 'Junior to Senior'),
('Shader Developer', 'graphics', '["opengl", "glsl", "hlsl"]', 80, 'Write custom shaders and visual effects', '$75k - $145k', 'Mid to Senior'),
('3D Engine Developer', 'graphics', '["opengl", "cpp", "glsl", "physics"]', 85, 'Build game engines and 3D frameworks', '$90k - $170k', 'Senior to Lead'),
('AR/VR Developer', 'graphics', '["opengl", "cpp", "unity", "ar-vr"]', 75, 'Create augmented and virtual reality applications', '$85k - $160k', 'Mid to Senior'),
('Computer Vision Engineer', 'graphics', '["opengl", "python", "cpp", "opencv"]', 80, 'Develop image processing and CV systems', '$90k - $165k', 'Senior'),
('Rendering Engineer', 'graphics', '["opengl", "cpp", "glsl", "optimization"]', 85, 'Optimize rendering pipelines and performance', '$95k - $175k', 'Senior to Lead'),
('Technical Artist', 'graphics', '["opengl", "glsl", "art-tools"]', 70, 'Bridge art and programming in game development', '$65k - $130k', 'Junior to Senior'),
('Unity Developer', 'graphics', '["unity", "csharp", "game-dev"]', 70, 'Build games and applications with Unity', '$70k - $135k', 'Junior to Senior'),
('Unreal Engine Developer', 'graphics', '["unreal", "cpp", "blueprints"]', 75, 'Create games with Unreal Engine', '$75k - $145k', 'Mid to Senior'),

-- ========================================
-- QUALITY ASSURANCE (4 roles)
-- ========================================
('QA Engineer', 'quality-assurance', '["testing", "automation", "selenium"]', 65, 'Test software and ensure quality', '$60k - $115k', 'Junior to Mid'),
('Test Automation Engineer', 'quality-assurance', '["python", "java", "selenium", "testing"]', 70, 'Automate testing processes', '$70k - $130k', 'Mid to Senior'),
('Performance Test Engineer', 'quality-assurance', '["testing", "jmeter", "performance"]', 75, 'Test application performance and scalability', '$75k - $140k', 'Mid to Senior'),
('Security QA Engineer', 'quality-assurance', '["testing", "security", "devtools"]', 75, 'Test applications for security vulnerabilities', '$75k - $145k', 'Mid to Senior'),

-- ========================================
-- DEVTOOLS & TOOLING (5 roles)
-- ========================================
('DevTools Engineer', 'devtools', '["javascript", "devtools", "chrome-devtools"]', 75, 'Build developer tools and extensions', '$85k - $155k', 'Mid to Senior'),
('Build Engineer', 'devtools', '["webpack", "babel", "build-tools"]', 75, 'Optimize build systems and tooling', '$80k - $150k', 'Mid to Senior'),
('Developer Experience Engineer', 'devtools', '["javascript", "devtools", "cli"]', 75, 'Improve developer workflows and tools', '$85k - $160k', 'Mid to Senior'),
('IDE Plugin Developer', 'devtools', '["java", "javascript", "plugin-development"]', 75, 'Create IDE extensions and plugins', '$80k - $150k', 'Mid to Senior'),
('Debugging Tools Engineer', 'devtools', '["cpp", "python", "debugging", "devtools"]', 80, 'Build debugging and profiling tools', '$90k - $165k', 'Senior'),

-- ========================================
-- ORACLE & ENTERPRISE (4 roles)
-- ========================================
('Oracle Developer', 'oracle-enterprise', '["oracle", "plsql", "sql"]', 75, 'Develop Oracle database applications', '$85k - $155k', 'Mid to Senior'),
('Oracle DBA', 'oracle-enterprise', '["oracle", "database-admin", "performance"]', 80, 'Administer Oracle database systems', '$90k - $165k', 'Senior'),
('Oracle Cloud Developer', 'oracle-enterprise', '["oracle-cloud", "java", "cloud"]', 75, 'Build applications on Oracle Cloud', '$85k - $160k', 'Mid to Senior'),
('ERP Developer', 'oracle-enterprise', '["oracle", "erp", "business-logic"]', 75, 'Develop enterprise resource planning systems', '$80k - $150k', 'Mid to Senior')

ON CONFLICT (role_name) DO UPDATE SET
  category = EXCLUDED.category,
  required_skills = EXCLUDED.required_skills,
  min_score_percentage = EXCLUDED.min_score_percentage,
  description = EXCLUDED.description,
  salary_range = EXCLUDED.salary_range,
  experience_level = EXCLUDED.experience_level;

-- 5. Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_results ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can read job roles" ON job_roles;
CREATE POLICY "Anyone can read job roles"
  ON job_roles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own results" ON practice_results;
CREATE POLICY "Users can insert their own results"
  ON practice_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own results" ON practice_results;
CREATE POLICY "Users can read their own results"
  ON practice_results FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- Verification
-- ========================================

-- Count job roles by category
SELECT 
  category,
  COUNT(*) as role_count,
  STRING_AGG(role_name, ', ' ORDER BY role_name) as roles
FROM job_roles
GROUP BY category
ORDER BY role_count DESC;

-- Total summary
SELECT 
  'Total Job Roles' as metric,
  COUNT(*)::TEXT as value
FROM job_roles
UNION ALL
SELECT 
  'Total Categories',
  COUNT(DISTINCT category)::TEXT
FROM job_roles
UNION ALL
SELECT
  'Total Questions',
  COUNT(*)::TEXT
FROM questions;

-- ========================================
-- Setup Complete! 🎉
-- Total: 60+ Job Roles across 10 categories
-- ========================================
