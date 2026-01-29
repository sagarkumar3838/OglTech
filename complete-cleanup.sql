-- ============================================
-- COMPLETE DATABASE CLEANUP SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Show current state
SELECT '=== BEFORE CLEANUP ===' as status;
SELECT skill, level, COUNT(*) as count FROM questions GROUP BY skill, level ORDER BY skill, level;
SELECT COUNT(*) as total_before FROM questions;

-- STEP 2: Delete unwanted skills (keep all skills needed for 8 OGL courses)
-- Keep: html, css, javascript, jquery, typescript, react, nodejs, python, java, 
--       testing tools, cloud platforms, docker, kubernetes, ci/cd, serverless, microservices, oglknowledge
DELETE FROM questions 
WHERE LOWER(TRIM(skill)) NOT IN (
  'html', 'css', 'javascript', 'jquery', 'typescript', 'react', 'node.js', 'nodejs',
  'python', 'java', 'testing tools', 'testing', 'cloud platforms', 'cloud', 
  'docker', 'kubernetes', 'ci/cd', 'cicd', 'serverless', 'microservices', 'oglknowledge', 'ogl knowledge'
);

SELECT '=== After removing unwanted skills ===' as status;
SELECT COUNT(*) as remaining FROM questions;

-- STEP 3: Standardize skill names to lowercase and remove spaces
UPDATE questions SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')));

-- STEP 4: Convert level names (handle all variations)
UPDATE questions SET level = 'easy' WHERE LOWER(TRIM(level)) IN ('basic', 'beginner', 'easy');
UPDATE questions SET level = 'medium' WHERE LOWER(TRIM(level)) IN ('intermediate', 'inter', 'medium');
UPDATE questions SET level = 'hard' WHERE LOWER(TRIM(level)) IN ('advanced', 'expert', 'hard');

SELECT '=== After standardizing levels ===' as status;
SELECT skill, level, COUNT(*) as count FROM questions GROUP BY skill, level ORDER BY skill, level;

-- STEP 5: Remove duplicates (keep oldest)
WITH ranked_questions AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY TRIM(question), skill, level 
      ORDER BY created_at ASC NULLS LAST, id ASC
    ) as rn
  FROM questions
)
DELETE FROM questions
WHERE id IN (
  SELECT id 
  FROM ranked_questions 
  WHERE rn > 1
);

SELECT '=== After removing duplicates ===' as status;
SELECT COUNT(*) as remaining FROM questions;

-- STEP 6: Final verification
SELECT '=== FINAL STATE ===' as status;

-- Count by skill and level
SELECT 
  skill, 
  level, 
  COUNT(*) as question_count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- Total count
SELECT COUNT(*) as total_questions FROM questions;

-- Breakdown by skill
SELECT 
  skill, 
  COUNT(*) as total,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced
FROM questions 
GROUP BY skill 
ORDER BY skill;

-- Show sample questions from each skill
SELECT DISTINCT ON (skill, level) 
  skill, level, question, type 
FROM questions 
ORDER BY skill, level, created_at ASC;
