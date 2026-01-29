-- Fix skill names in existing scorecards to match career skill names
-- This will allow level unlocking to work properly for ALL skills

-- Update normalized skill names to proper case
UPDATE scorecards
SET skill = CASE 
  WHEN LOWER(skill) = 'html' THEN 'HTML'
  WHEN LOWER(skill) = 'css' THEN 'CSS'
  WHEN LOWER(skill) = 'javascript' THEN 'JavaScript'
  WHEN LOWER(skill) = 'jquery' THEN 'jQuery'
  WHEN LOWER(skill) = 'oglknowledge' OR LOWER(skill) = 'ogl knowledge' THEN 'OGL Knowledge'
  WHEN LOWER(skill) = 'typescript' THEN 'TypeScript'
  WHEN LOWER(skill) = 'react' THEN 'React'
  WHEN LOWER(skill) = 'node.js' OR LOWER(skill) = 'nodejs' THEN 'Node.js'
  WHEN LOWER(skill) = 'python' THEN 'Python'
  WHEN LOWER(skill) = 'java' THEN 'Java'
  WHEN LOWER(skill) = 'testing tools' OR LOWER(skill) = 'testingtools' THEN 'Testing Tools'
  ELSE skill
END
WHERE skill != CASE 
  WHEN LOWER(skill) = 'html' THEN 'HTML'
  WHEN LOWER(skill) = 'css' THEN 'CSS'
  WHEN LOWER(skill) = 'javascript' THEN 'JavaScript'
  WHEN LOWER(skill) = 'jquery' THEN 'jQuery'
  WHEN LOWER(skill) = 'oglknowledge' OR LOWER(skill) = 'ogl knowledge' THEN 'OGL Knowledge'
  WHEN LOWER(skill) = 'typescript' THEN 'TypeScript'
  WHEN LOWER(skill) = 'react' THEN 'React'
  WHEN LOWER(skill) = 'node.js' OR LOWER(skill) = 'nodejs' THEN 'Node.js'
  WHEN LOWER(skill) = 'python' THEN 'Python'
  WHEN LOWER(skill) = 'java' THEN 'Java'
  WHEN LOWER(skill) = 'testing tools' OR LOWER(skill) = 'testingtools' THEN 'Testing Tools'
  ELSE skill
END;

-- Also normalize level_attempted to lowercase (easy, medium, hard)
UPDATE scorecards
SET level_attempted = LOWER(level_attempted)
WHERE level_attempted != LOWER(level_attempted);

-- Show what was updated
SELECT 
  '✅ Skill names and levels have been normalized!' as status;

-- Verify the changes - show all unique skill/level combinations
SELECT 
  skill,
  level_attempted,
  COUNT(*) as test_count,
  AVG(overall_score) as avg_score,
  MAX(overall_score) as best_score
FROM scorecards
GROUP BY skill, level_attempted
ORDER BY skill, 
  CASE level_attempted
    WHEN 'easy' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'hard' THEN 3
    ELSE 4
  END;

-- Show which levels should be unlocked for each skill
SELECT 
  skill,
  level_attempted,
  MAX(overall_score) as best_score,
  CASE 
    WHEN MAX(overall_score) >= 70 THEN '✅ Next level should unlock'
    ELSE '❌ Need 70%+ to unlock next level'
  END as unlock_status
FROM scorecards
GROUP BY skill, level_attempted
ORDER BY skill, 
  CASE level_attempted
    WHEN 'easy' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'hard' THEN 3
    ELSE 4
  END;
