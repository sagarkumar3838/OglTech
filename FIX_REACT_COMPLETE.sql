-- COMPLETE FIX FOR REACT LEVEL ISSUE
-- This will standardize all ReactJS questions to use: Basic, Intermediate, Advanced

-- Step 1: Check current state
SELECT '=== BEFORE FIX ===' as status;
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'ReactJS' OR skill = 'React' OR skill = 'react'
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Standardize skill name (in case there are variations)
UPDATE practice_questions
SET skill = 'ReactJS'
WHERE skill IN ('React', 'react', 'REACT', 'ReactJs', 'Reactjs');

-- Step 3: Fix level names to match what UI expects
-- The UI expects exactly: 'Basic', 'Intermediate', 'Advanced'

UPDATE practice_questions
SET level = 'Basic'
WHERE skill = 'ReactJS' 
  AND level IN ('beginner', 'Beginner', 'BEGINNER', 'Easy', 'easy', 'EASY', 'basic', 'BASIC');

UPDATE practice_questions
SET level = 'Intermediate'
WHERE skill = 'ReactJS' 
  AND level IN ('intermediate', 'INTERMEDIATE', 'Medium', 'medium', 'MEDIUM', 'Intermediate');

UPDATE practice_questions
SET level = 'Advanced'
WHERE skill = 'ReactJS' 
  AND level IN ('advanced', 'ADVANCED', 'Hard', 'hard', 'HARD', 'Advanced');

-- Step 4: Verify the fix
SELECT '=== AFTER FIX ===' as status;
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY skill, level
ORDER BY level;

-- Step 5: Show total
SELECT 
  COUNT(*) as total_react_questions,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic_count,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced_count
FROM practice_questions
WHERE skill = 'ReactJS';

-- Step 6: Show sample questions to verify
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 60) as question_preview
FROM practice_questions
WHERE skill = 'ReactJS'
ORDER BY level, id
LIMIT 15;
