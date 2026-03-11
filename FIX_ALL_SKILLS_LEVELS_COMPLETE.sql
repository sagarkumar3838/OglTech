-- FIX ALL SKILLS LEVEL NAMES
-- Standardize ALL questions to use: Basic, Intermediate, Advanced
-- This ensures consistency across the entire database

-- Step 1: Show current state
SELECT '=== CURRENT STATE - All Skills ===' as status;
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Step 2: Fix ALL skills to use standard level names
-- Convert beginner/easy → Basic
UPDATE practice_questions
SET level = 'Basic'
WHERE level IN ('beginner', 'Beginner', 'BEGINNER', 'Easy', 'easy', 'EASY', 'basic', 'BASIC');

-- Convert intermediate/medium → Intermediate
UPDATE practice_questions
SET level = 'Intermediate'
WHERE level IN ('intermediate', 'INTERMEDIATE', 'Medium', 'medium', 'MEDIUM');

-- Convert advanced/hard → Advanced
UPDATE practice_questions
SET level = 'Advanced'
WHERE level IN ('advanced', 'ADVANCED', 'Hard', 'hard', 'HARD');

-- Step 3: Show fixed state
SELECT '=== AFTER FIX - All Skills ===' as status;
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Step 4: Summary by skill
SELECT '=== SUMMARY BY SKILL ===' as status;
SELECT 
  skill,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic_count,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Step 5: Check for any remaining non-standard levels
SELECT '=== CHECK FOR NON-STANDARD LEVELS ===' as status;
SELECT DISTINCT level
FROM practice_questions
WHERE level NOT IN ('Basic', 'Intermediate', 'Advanced')
ORDER BY level;

-- If any non-standard levels exist, show them
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE level NOT IN ('Basic', 'Intermediate', 'Advanced')
GROUP BY skill, level
ORDER BY skill, level;
