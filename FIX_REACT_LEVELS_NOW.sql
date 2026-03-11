-- Fix React Level Names to Match UI Expectations
-- The UI expects: Basic, Intermediate, Advanced
-- But questions might be stored as: beginner, intermediate, advanced OR Easy, Medium, Hard

-- First, check current state
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY skill, level
ORDER BY level;

-- Fix: Update all ReactJS questions to use correct level names
-- Convert any variations to the standard format

-- Update beginner -> Basic
UPDATE practice_questions
SET level = 'Basic'
WHERE skill = 'ReactJS' 
  AND (level = 'beginner' OR level = 'Beginner' OR level = 'BEGINNER' OR level = 'Easy');

-- Update intermediate -> Intermediate  
UPDATE practice_questions
SET level = 'Intermediate'
WHERE skill = 'ReactJS' 
  AND (level = 'intermediate' OR level = 'INTERMEDIATE' OR level = 'Medium');

-- Update advanced -> Advanced
UPDATE practice_questions
SET level = 'Advanced'
WHERE skill = 'ReactJS' 
  AND (level = 'advanced' OR level = 'ADVANCED' OR level = 'Hard');

-- Verify the fix
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY skill, level
ORDER BY level;

-- Show total
SELECT COUNT(*) as total_react_questions
FROM practice_questions
WHERE skill = 'ReactJS';
