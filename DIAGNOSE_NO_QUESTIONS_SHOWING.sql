-- Comprehensive diagnosis for why no questions are showing in Practice page
-- Run each section in Supabase SQL Editor

-- ============================================
-- SECTION 1: Check if questions table exists and has data
-- ============================================
SELECT 
  'Total questions in database' as check_name,
  COUNT(*) as count
FROM questions;

-- ============================================
-- SECTION 2: Check what skills are available
-- ============================================
SELECT 
  skill,
  COUNT(*) as total_questions
FROM questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- SECTION 3: Check what levels exist (should be: easy, medium, hard)
-- ============================================
SELECT 
  DISTINCT level,
  COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- ============================================
-- SECTION 4: Check skill + level combinations
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- SECTION 5: Check if type column exists and has 'mcq' values
-- ============================================
SELECT 
  type,
  COUNT(*) as count
FROM questions
GROUP BY type;

-- ============================================
-- SECTION 6: Check RLS policies on questions table
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'questions';

-- ============================================
-- SECTION 7: Check if RLS is enabled
-- ============================================
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'questions';

-- ============================================
-- SECTION 8: Sample query that Practice page runs
-- Test with JavaScript + Easy (beginner maps to easy)
-- ============================================
SELECT 
  id,
  skill,
  level,
  type,
  question,
  options,
  correct_answer
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 5;

-- ============================================
-- SECTION 9: Check if practice_questions has data
-- ============================================
SELECT 
  'practice_questions table' as table_name,
  COUNT(*) as total_count
FROM practice_questions;

-- ============================================
-- SECTION 10: Compare both tables
-- ============================================
SELECT 
  'questions' as table_name,
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
UNION ALL
SELECT 
  'practice_questions' as table_name,
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY table_name, skill, level;
