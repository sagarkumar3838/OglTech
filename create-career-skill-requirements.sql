-- ============================================
-- CREATE CAREER_SKILL_REQUIREMENTS TABLE
-- Defines what skill levels are required for each career
-- ============================================

CREATE TABLE IF NOT EXISTS career_skill_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  required_level TEXT NOT NULL CHECK (required_level IN ('easy', 'medium', 'hard')),
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_id, skill_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_career_skill_requirements_career ON career_skill_requirements(career_id);
CREATE INDEX IF NOT EXISTS idx_career_skill_requirements_skill ON career_skill_requirements(skill_name);

-- Enable RLS
ALTER TABLE career_skill_requirements ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access
CREATE POLICY "Career skill requirements are viewable by everyone" 
  ON career_skill_requirements FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert career skill requirements" 
  ON career_skill_requirements FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update career skill requirements" 
  ON career_skill_requirements FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- ============================================
-- SEED CAREER SKILL REQUIREMENTS
-- Based on OGL career paths
-- ============================================

-- Get career IDs first (we'll use them in the inserts)
DO $$
DECLARE
  content_dev_id UUID;
  tester_id UUID;
  frontend_id UUID;
  backend_id UUID;
  devops_id UUID;
  cloud_id UUID;
  qa_id UUID;
  fullstack_id UUID;
BEGIN
  -- Get career IDs
  SELECT id INTO content_dev_id FROM careers WHERE name = 'OGL Content Developer';
  SELECT id INTO tester_id FROM careers WHERE name = 'OGL Tester';
  SELECT id INTO frontend_id FROM careers WHERE name = 'OGL Frontend Developer';
  SELECT id INTO backend_id FROM careers WHERE name = 'OGL Backend Developer';
  SELECT id INTO devops_id FROM careers WHERE name = 'OGL DevOps Developer';
  SELECT id INTO cloud_id FROM careers WHERE name = 'OGL Cloud Developer';
  SELECT id INTO qa_id FROM careers WHERE name = 'OGL QA Developer';
  SELECT id INTO fullstack_id FROM careers WHERE name = 'OGL Developer';

  -- OGL Content Developer (Fresher level)
  IF content_dev_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (content_dev_id, 'HTML', 'medium', true),
    (content_dev_id, 'CSS', 'medium', true),
    (content_dev_id, 'JavaScript', 'medium', true),
    (content_dev_id, 'jQuery', 'easy', true),
    (content_dev_id, 'OGL Knowledge', 'easy', true)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL Tester (Entry-Level)
  IF tester_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (tester_id, 'Testing Tools', 'easy', true),
    (tester_id, 'JavaScript', 'easy', true),
    (tester_id, 'HTML', 'easy', true),
    (tester_id, 'CSS', 'easy', true),
    (tester_id, 'TypeScript', 'easy', false)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL Frontend Developer (Mid-Level)
  IF frontend_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (frontend_id, 'HTML', 'hard', true),
    (frontend_id, 'CSS', 'hard', true),
    (frontend_id, 'JavaScript', 'hard', true),
    (frontend_id, 'TypeScript', 'medium', true),
    (frontend_id, 'React', 'medium', true),
    (frontend_id, 'jQuery', 'medium', false)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL Backend Developer (Mid-Level)
  IF backend_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (backend_id, 'JavaScript', 'hard', true),
    (backend_id, 'TypeScript', 'hard', true),
    (backend_id, 'Python', 'medium', true),
    (backend_id, 'Java', 'medium', true),
    (backend_id, 'Node.js', 'hard', true)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL DevOps Developer (Senior)
  IF devops_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (devops_id, 'Cloud Platforms', 'hard', true),
    (devops_id, 'Docker', 'hard', true),
    (devops_id, 'Kubernetes', 'hard', true),
    (devops_id, 'CI/CD', 'hard', true),
    (devops_id, 'Python', 'medium', true)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL Cloud Developer (Senior)
  IF cloud_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (cloud_id, 'Cloud Platforms', 'hard', true),
    (cloud_id, 'JavaScript', 'hard', true),
    (cloud_id, 'Python', 'hard', true),
    (cloud_id, 'Serverless', 'medium', true),
    (cloud_id, 'Microservices', 'medium', true)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL QA Developer (Entry-Level)
  IF qa_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (qa_id, 'Testing Tools', 'medium', true),
    (qa_id, 'TypeScript', 'medium', true),
    (qa_id, 'JavaScript', 'medium', true),
    (qa_id, 'HTML', 'easy', true),
    (qa_id, 'CSS', 'easy', true),
    (qa_id, 'Java', 'easy', false)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

  -- OGL Developer / Full-stack (Mid-Level)
  IF fullstack_id IS NOT NULL THEN
    INSERT INTO career_skill_requirements (career_id, skill_name, required_level, is_mandatory) VALUES
    (fullstack_id, 'HTML', 'hard', true),
    (fullstack_id, 'CSS', 'hard', true),
    (fullstack_id, 'JavaScript', 'hard', true),
    (fullstack_id, 'TypeScript', 'medium', false),
    (fullstack_id, 'React', 'medium', true),
    (fullstack_id, 'Node.js', 'medium', true)
    ON CONFLICT (career_id, skill_name) DO NOTHING;
  END IF;

END $$;

-- Verify the data
SELECT 
  c.name as career_name,
  csr.skill_name,
  csr.required_level,
  csr.is_mandatory
FROM career_skill_requirements csr
JOIN careers c ON c.id = csr.career_id
ORDER BY c.name, csr.skill_name;

SELECT 'Career skill requirements table created and seeded successfully!' as status;
