-- ============================================
-- FIX ALL SKILLS - COMPLETE SOLUTION
-- ============================================
-- This script will fix ALL skills so they appear in Practice page
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: FIND ALL SEPARATE TABLES
-- ============================================
-- Find all tables that might contain questions
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND (
  table_name ILIKE '%question%' OR 
  table_name ILIKE '%practice%' OR
  table_name ILIKE '%java%' OR
  table_name ILIKE '%python%' OR
  table_name ILIKE '%skill%'
)
ORDER BY table_name;

-- ============================================
-- STEP 2: CHECK MAIN QUESTIONS TABLE
-- ============================================
-- See what skills are already in the main table
SELECT 
  skill,
  COUNT(*) as total_questions,
  COUNT(DISTINCT level) as levels_available
FROM questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- STEP 3: NORMALIZE EXISTING QUESTIONS
-- ============================================
-- Fix format of questions already in main table

-- 3a. Normalize skill names (lowercase, no spaces)
UPDATE questions
SET skill = LOWER(TRIM(REPLACE(skill, ' ', '')))
WHERE skill != LOWER(TRIM(REPLACE(skill, ' ', '')));

-- 3b. Normalize level names (beginner→easy, intermediate→medium, advanced→hard)
UPDATE questions
SET level = CASE
  WHEN level ILIKE 'beginner' THEN 'easy'
  WHEN level ILIKE 'intermediate' THEN 'medium'
  WHEN level ILIKE 'advanced' THEN 'hard'
  WHEN level ILIKE 'expert' THEN 'hard'
  ELSE LOWER(TRIM(level))
END
WHERE level NOT IN ('easy', 'medium', 'hard');

-- 3c. Set type to 'mcq' if not set
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL OR type = '' OR type != 'mcq';

-- ============================================
-- STEP 4: VERIFY CURRENT STATE
-- ============================================
-- Check what skills are now properly formatted
SELECT 
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- ============================================
-- STEP 5: COPY FROM SEPARATE TABLES (IF ANY)
-- ============================================
-- If you have separate tables for specific skills, 
-- uncomment and modify the sections below

-- Example: Copy from java_questions table
/*
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  'java' as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  COALESCE(type, 'mcq') as type,
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM java_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = java_questions.question
);
*/

-- Example: Copy from python_questions table
/*
INSERT INTO questions (
  skill, level, type, question, options, 
  correct_answer, explanation, topic
)
SELECT 
  'python' as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  COALESCE(type, 'mcq') as type,
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM python_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = python_questions.question
);
*/

-- ============================================
-- STEP 6: FINAL VERIFICATION
-- ============================================
-- Check all skills are now properly formatted
SELECT 
  '✅ Skills Available' as status,
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'easy' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'hard' THEN 3 
    ELSE 4 
  END;

-- ============================================
-- STEP 7: CHECK FOR MISSING SKILLS
-- ============================================
-- Compare with CSV files you have
WITH expected_skills AS (
  SELECT unnest(ARRAY[
    'html', 'css', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'java', 'python', 'nodejs', 'csharp', 'php', 'ruby', 'go', 'rust',
    'sql', 'oracle', 'postgresql', 'mongodb', 'redis',
    'kotlin', 'swift', 'flutter', 'reactnative',
    'docker', 'kubernetes', 'linux', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
    'opengl', 'glsl', 'cpp', 'unity', 'unreal',
    'devtools', 'webpack', 'git', 'vscode',
    'selenium', 'jest', 'cypress'
  ]) as skill
),
available_skills AS (
  SELECT DISTINCT skill FROM questions
)
SELECT 
  e.skill as missing_skill,
  '❌ No questions found' as status
FROM expected_skills e
LEFT JOIN available_skills a ON e.skill = a.skill
WHERE a.skill IS NULL
ORDER BY e.skill;

-- ============================================
-- STEP 8: SAMPLE QUESTIONS CHECK
-- ============================================
-- View sample questions to verify format
SELECT 
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  jsonb_typeof(options) as options_format,
  correct_answer
FROM questions
WHERE skill IN ('java', 'python', 'javascript', 'html', 'css')
LIMIT 10;

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- After running this script, you should see:
-- 1. All skills in lowercase without spaces
-- 2. All levels as 'easy', 'medium', or 'hard'
-- 3. All types as 'mcq'
-- 4. Question counts for each skill/level combination
-- 5. List of missing skills (if any)
--
-- If any skills are missing, you need to:
-- 1. Check if CSV files exist in questions/ folder
-- 2. Upload them using: npx tsx scripts/upload-all-questions.ts
-- 3. Or copy from separate tables (see STEP 5)
-- ============================================
