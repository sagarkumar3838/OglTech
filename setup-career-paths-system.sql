-- ========================================
-- CAREER PATHS & SKILL COMBOS SYSTEM
-- Smart recommendations based on skill combinations
-- ========================================

-- 1. Create Career Paths Table
CREATE TABLE IF NOT EXISTS career_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_name TEXT NOT NULL,
  skill_combo JSONB NOT NULL,
  job_roles JSONB NOT NULL,
  best_for JSONB NOT NULL,
  salary_range TEXT,
  difficulty_level TEXT,
  time_to_learn TEXT,
  description TEXT,
  icon TEXT,
  category TEXT,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create User Interests Table
CREATE TABLE IF NOT EXISTS user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interests JSONB NOT NULL,
  preferred_path_id UUID REFERENCES career_paths(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Insert Career Paths
INSERT INTO career_paths (path_name, skill_combo, job_roles, best_for, salary_range, difficulty_level, time_to_learn, description, icon, category, popularity_score) VALUES

-- ========================================
-- 1. MERN STACK
-- ========================================
('MERN Stack Developer', 
 '["javascript", "react", "nodejs", "mongodb"]',
 '["Frontend Developer", "Full Stack Developer", "React Developer", "Web Developer", "SaaS Product Developer"]',
 '["Startups", "Product Companies", "Freelancing", "Remote Jobs"]',
 '$70k - $140k',
 'Intermediate',
 '6-9 months',
 'Build modern web applications with MongoDB, Express, React, and Node.js. Perfect for creating full-stack applications.',
 '⚛️',
 'web-development',
 95),

-- ========================================
-- 2. PYTHON + AI/ML
-- ========================================
('Python AI/ML Engineer',
 '["python", "sql", "machine-learning", "tensorflow"]',
 '["Data Scientist", "AI / ML Engineer", "Python Backend Developer", "Data Analyst", "Automation Engineer"]',
 '["AI Companies", "Research Firms", "Analytics Companies", "High Salary Roles"]',
 '$90k - $180k',
 'Advanced',
 '12-18 months',
 'Master Python with Machine Learning and AI. Build intelligent systems and work on cutting-edge technology.',
 '🤖',
 'ai-ml',
 90),

-- ========================================
-- 3. JAVA ENTERPRISE
-- ========================================
('Java Enterprise Developer',
 '["java", "spring", "sql", "microservices"]',
 '["Java Backend Developer", "Software Engineer", "Enterprise Application Developer", "Microservices Developer"]',
 '["Banking Sector", "Large IT Companies", "MNCs (Infosys, TCS, Wipro, Accenture)"]',
 '$75k - $150k',
 'Intermediate',
 '8-12 months',
 'Build enterprise-grade applications with Java and Spring Boot. Ideal for stable, high-paying corporate jobs.',
 '☕',
 'backend',
 85),

-- ========================================
-- 4. C++ SYSTEM PROGRAMMING
-- ========================================
('C++ System Engineer',
 '["cpp", "data-structures", "algorithms", "system-design"]',
 '["Software Engineer (Product Companies)", "Game Developer", "System Engineer", "Competitive Programmer"]',
 '["Google, Amazon, Microsoft-type companies", "Core Engineering Roles"]',
 '$90k - $170k',
 'Advanced',
 '12-18 months',
 'Master C++ with DSA and system design. Perfect for top tech companies and competitive programming.',
 '⚡',
 'system-programming',
 80),

-- ========================================
-- 5. MOBILE DEVELOPMENT
-- ========================================
('Mobile App Developer',
 '["kotlin", "swift", "mobile-dev"]',
 '["Android Developer (Kotlin)", "iOS Developer (Swift)", "Mobile App Engineer"]',
 '["App-Based Startups", "Freelance App Development", "Product Companies"]',
 '$70k - $145k',
 'Intermediate',
 '6-10 months',
 'Build native mobile apps for Android (Kotlin) and iOS (Swift). High demand in app-based startups.',
 '📱',
 'mobile',
 88),

-- ========================================
-- 6. CYBERSECURITY
-- ========================================
('Cybersecurity Specialist',
 '["python", "linux", "security-tools", "networking"]',
 '["Cybersecurity Analyst", "Ethical Hacker", "Penetration Tester", "Security Engineer"]',
 '["Government Jobs", "Security Firms", "Banks & Enterprises"]',
 '$80k - $160k',
 'Advanced',
 '10-15 months',
 'Protect systems and networks from cyber threats. Work in security, ethical hacking, and defense.',
 '🔒',
 'cybersecurity',
 82),

-- ========================================
-- 7. UI/UX + FRONTEND
-- ========================================
('UI/UX Frontend Developer',
 '["javascript", "html", "css", "figma", "react"]',
 '["UI Developer", "UX Designer", "Product Designer", "Frontend Engineer"]',
 '["Design Agencies", "Product Startups", "Freelancing"]',
 '$60k - $130k',
 'Beginner to Intermediate',
 '4-8 months',
 'Create beautiful, user-friendly interfaces. Combine design skills with frontend development.',
 '🎨',
 'design-frontend',
 92),

-- ========================================
-- 8. DEVOPS + CLOUD
-- ========================================
('DevOps Cloud Engineer',
 '["python", "go", "docker", "kubernetes", "aws", "terraform"]',
 '["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer (SRE)", "Platform Engineer"]',
 '["High-Pay Enterprise Jobs", "Cloud Companies", "Infrastructure Teams"]',
 '$95k - $175k',
 'Advanced',
 '10-14 months',
 'Automate infrastructure and manage cloud systems. Very high salaries in enterprise companies.',
 '☁️',
 'devops-cloud',
 87),

-- ========================================
-- HIGH-VALUE COMBOS
-- ========================================
('MERN + Gen AI',
 '["javascript", "react", "nodejs", "ai", "openai"]',
 '["AI Web Developer", "Full Stack AI Engineer", "Gen AI Developer"]',
 '["AI Startups", "Product Companies", "High-Growth Companies"]',
 '$90k - $160k',
 'Advanced',
 '10-12 months',
 'Combine MERN stack with Generative AI. Build AI-powered web applications.',
 '🚀',
 'ai-web',
 93),

('Python + Cloud',
 '["python", "aws", "azure", "docker", "kubernetes"]',
 '["Cloud Developer", "Python Cloud Engineer", "Backend Cloud Specialist"]',
 '["Cloud Companies", "Enterprise", "High Salary Roles"]',
 '$100k - $180k',
 'Advanced',
 '12-15 months',
 'Python development with cloud platforms. Very high salary potential.',
 '💰',
 'cloud-backend',
 89),

('UI/UX + Frontend',
 '["figma", "html", "css", "javascript", "react"]',
 '["Product Designer", "UI/UX Engineer", "Design System Developer"]',
 '["Product Companies", "Design Agencies", "Startups"]',
 '$70k - $140k',
 'Intermediate',
 '6-10 months',
 'Master both design and development. High demand in product companies.',
 '✨',
 'design-dev',
 91),

('Cybersecurity + Cloud',
 '["python", "security", "aws", "azure", "cloud-security"]',
 '["Cloud Security Engineer", "Security Architect", "Enterprise Security Specialist"]',
 '["Enterprise Security Roles", "Banks", "Government"]',
 '$95k - $175k',
 'Advanced',
 '12-16 months',
 'Secure cloud infrastructure. Critical role in enterprise companies.',
 '🛡️',
 'security-cloud',
 84);

-- 4. Create Smart Recommendations Table
CREATE TABLE IF NOT EXISTS smart_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interest_type TEXT NOT NULL,
  recommended_path_id UUID REFERENCES career_paths(id),
  description TEXT,
  priority INTEGER DEFAULT 0
);

-- 5. Insert Smart Recommendations
INSERT INTO smart_recommendations (interest_type, recommended_path_id, description, priority) VALUES
('coding-building-apps', (SELECT id FROM career_paths WHERE path_name = 'MERN Stack Developer'), 'Perfect for building modern web applications', 1),
('math-logic-future-tech', (SELECT id FROM career_paths WHERE path_name = 'Python AI/ML Engineer'), 'Ideal for AI and machine learning enthusiasts', 1),
('big-companies-stable-jobs', (SELECT id FROM career_paths WHERE path_name = 'Java Enterprise Developer'), 'Best for corporate and enterprise careers', 1),
('core-programming-problem-solving', (SELECT id FROM career_paths WHERE path_name = 'C++ System Engineer'), 'Perfect for competitive programming and top tech companies', 1),
('design-creativity', (SELECT id FROM career_paths WHERE path_name = 'UI/UX Frontend Developer'), 'Combine creativity with coding', 1),
('security-hacking-defense', (SELECT id FROM career_paths WHERE path_name = 'Cybersecurity Specialist'), 'Protect systems and networks', 1);

-- 6. Create Career Formula Table
CREATE TABLE IF NOT EXISTS career_formulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  formula_name TEXT NOT NULL,
  components JSONB NOT NULL,
  result TEXT NOT NULL,
  description TEXT,
  example TEXT
);

-- 7. Insert Career Formulas
INSERT INTO career_formulas (formula_name, components, result, description, example) VALUES
('Golden Career Formula',
 '["1 Main Language", "1 Framework", "DSA", "2-3 Projects"]',
 'Job Ready',
 'The proven formula to become job-ready in any tech stack',
 'JavaScript + React + DSA + 3 Projects = Frontend Job Ready'),

('High Salary Combo',
 '["Python", "Cloud (AWS/Azure)", "DevOps Tools"]',
 'Very High Salary',
 'Combination that leads to highest paying roles',
 'Python + AWS + Docker + Kubernetes = $120k+ salary'),

('Startup Ready',
 '["MERN Stack", "Gen AI", "Product Mindset"]',
 'Startup Developer',
 'Perfect combination for joining or building startups',
 'React + Node.js + OpenAI API = AI Startup Developer'),

('Enterprise Ready',
 '["Java", "Spring Boot", "Microservices", "SQL"]',
 'Enterprise Developer',
 'Ideal for large companies and MNCs',
 'Java + Spring + Microservices = Enterprise Job at TCS/Infosys');

-- 8. Enable RLS
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_formulas ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies
CREATE POLICY "Anyone can read career paths"
  ON career_paths FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read smart recommendations"
  ON smart_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read career formulas"
  ON career_formulas FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their interests"
  ON user_interests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. Create helper function
CREATE OR REPLACE FUNCTION get_recommended_path(user_interest TEXT)
RETURNS TABLE (
  path_name TEXT,
  skill_combo JSONB,
  job_roles JSONB,
  best_for JSONB,
  salary_range TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.path_name,
    cp.skill_combo,
    cp.job_roles,
    cp.best_for,
    cp.salary_range,
    cp.description
  FROM career_paths cp
  JOIN smart_recommendations sr ON cp.id = sr.recommended_path_id
  WHERE sr.interest_type = user_interest
  ORDER BY sr.priority ASC, cp.popularity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Verification
-- ========================================

-- Show all career paths
SELECT 
  path_name,
  category,
  difficulty_level,
  salary_range,
  time_to_learn
FROM career_paths
ORDER BY popularity_score DESC;

-- Show smart recommendations
SELECT 
  sr.interest_type,
  cp.path_name,
  cp.icon,
  sr.description
FROM smart_recommendations sr
JOIN career_paths cp ON sr.recommended_path_id = cp.id
ORDER BY sr.priority;

-- Show career formulas
SELECT 
  formula_name,
  components,
  result,
  example
FROM career_formulas;

-- ========================================
-- Setup Complete! 🎉
-- 12 Career Paths + Smart Recommendations
-- ========================================
