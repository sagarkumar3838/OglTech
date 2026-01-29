-- Debug Learning Path Issue
-- Check what skills are in scorecards vs careers

-- 1. Check your scorecards
SELECT 
  skill,
  level_attempted,
  overall_score,
  level_readiness,
  created_at
FROM scorecards
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- 2. Check OGL Content Developer career skills
SELECT 
  id,
  name,
  skills
FROM careers
WHERE name = 'OGL Content Developer';

-- 3. Check OGL Tester career skills
SELECT 
  id,
  name,
  skills
FROM careers
WHERE name = 'OGL Tester';

-- 4. Check all careers and their skills
SELECT 
  name,
  skills
FROM careers
ORDER BY name;
