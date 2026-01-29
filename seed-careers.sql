-- Seed OGL Careers to Supabase
-- Run this in Supabase SQL Editor

-- Clear existing careers (optional)
DELETE FROM careers;

-- Insert OGL careers
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
 '[{"name": "HTML", "required": true}, {"name": "CSS", "required": true}, {"name": "JavaScript", "required": true}, {"name": "jQuery", "required": true}, {"name": "OGL Knowledge", "required": true}]'::jsonb);

-- Verify the insert
SELECT id, name, experience_level, jsonb_array_length(skills) as skill_count FROM careers;
