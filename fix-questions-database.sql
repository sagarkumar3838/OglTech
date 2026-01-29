-- ============================================
-- FIX QUESTIONS DATABASE - COMPLETE SOLUTION
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check current state
SELECT '=== CURRENT DATABASE STATE ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

SELECT '=== Questions by skill (raw) ===' as status;
SELECT skill, COUNT(*) as count FROM questions GROUP BY skill ORDER BY count DESC;

SELECT '=== Questions by level (raw) ===' as status;
SELECT level, COUNT(*) as count FROM questions GROUP BY level ORDER BY count DESC;

-- STEP 2: Standardize skill names to lowercase
UPDATE questions SET skill = LOWER(TRIM(skill));

-- STEP 3: Standardize level names
UPDATE questions SET level = LOWER(TRIM(level));

-- Convert variations to standard levels
UPDATE questions SET level = 'easy' WHERE level IN ('basic', 'beginner', 'easy');
UPDATE questions SET level = 'medium' WHERE level IN ('intermediate', 'inter', 'medium');
UPDATE questions SET level = 'hard' WHERE level IN ('advanced', 'expert', 'hard');

-- STEP 4: Remove duplicates (keep the first occurrence)
WITH ranked_questions AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY question, skill, level 
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

-- STEP 5: Verify the fix
SELECT '=== AFTER CLEANUP ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

SELECT '=== Questions by skill and level ===' as status;
SELECT 
  skill, 
  level, 
  COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- STEP 6: Check for HTML easy questions specifically
SELECT '=== HTML EASY QUESTIONS ===' as status;
SELECT COUNT(*) as html_easy_count 
FROM questions 
WHERE skill = 'html' AND level = 'easy';

-- Show sample HTML easy questions
SELECT id, question, type, options 
FROM questions 
WHERE skill = 'html' AND level = 'easy' 
LIMIT 5;

-- STEP 7: Summary by skill
SELECT '=== SUMMARY BY SKILL ===' as status;
SELECT 
  skill,
  COUNT(*) as total,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard
FROM questions 
GROUP BY skill 
ORDER BY skill;
