-- Quick Status Check for Practice Page
-- Run this in Supabase SQL Editor to see current state

-- 1. Total questions
SELECT 
  '1. TOTAL QUESTIONS' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ NO QUESTIONS - Need to upload'
    WHEN COUNT(*) < 100 THEN '⚠️ FEW QUESTIONS - Upload more'
    ELSE '✅ GOOD'
  END as status
FROM questions;

-- 2. JavaScript easy MCQ (default on Practice page)
SELECT 
  '2. JAVASCRIPT EASY MCQ' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ NONE - This is why Practice page is empty!'
    WHEN COUNT(*) < 10 THEN '⚠️ LESS THAN 10 - Need more'
    ELSE '✅ GOOD'
  END as status
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq';

-- 3. RLS Status
SELECT 
  '3. RLS STATUS' as check_name,
  CASE 
    WHEN rowsecurity THEN 'ENABLED'
    ELSE 'DISABLED'
  END as rls_status,
  CASE 
    WHEN rowsecurity THEN '⚠️ Check policies below'
    ELSE '✅ No RLS blocking'
  END as status
FROM pg_tables
WHERE tablename = 'questions';

-- 4. RLS Policies
SELECT 
  '4. RLS POLICIES' as check_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ NO POLICIES - Add SELECT policy'
    ELSE '✅ Policies exist'
  END as status
FROM pg_policies
WHERE tablename = 'questions'
  AND cmd = 'SELECT';

-- 5. Skills available
SELECT 
  '5. AVAILABLE SKILLS' as check_name,
  STRING_AGG(DISTINCT skill, ', ') as skills,
  COUNT(DISTINCT skill) as skill_count
FROM questions;

-- 6. Levels available
SELECT 
  '6. AVAILABLE LEVELS' as check_name,
  STRING_AGG(DISTINCT level, ', ') as levels,
  COUNT(DISTINCT level) as level_count
FROM questions;

-- 7. Question types
SELECT 
  '7. QUESTION TYPES' as check_name,
  STRING_AGG(DISTINCT type, ', ') as types,
  COUNT(DISTINCT type) as type_count
FROM questions;

-- 8. Sample question structure
SELECT 
  '8. SAMPLE QUESTION' as check_name,
  id,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  CASE 
    WHEN options IS NULL THEN '❌ NULL'
    WHEN options::text = '{}' THEN '❌ EMPTY'
    WHEN options::text LIKE '[%' THEN '✅ ARRAY FORMAT'
    WHEN options::text LIKE '{%' THEN '✅ OBJECT FORMAT'
    ELSE '⚠️ UNKNOWN FORMAT'
  END as options_format,
  correct_answer
FROM questions
LIMIT 1;

-- SUMMARY
SELECT 
  '═══════════════════════════════════════' as separator,
  'SUMMARY' as title;

DO $$
DECLARE
  total_count INTEGER;
  js_easy_count INTEGER;
  rls_enabled BOOLEAN;
  policy_count INTEGER;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO total_count FROM questions;
  SELECT COUNT(*) INTO js_easy_count FROM questions 
    WHERE skill = 'javascript' AND level = 'easy' AND type = 'mcq';
  SELECT rowsecurity INTO rls_enabled FROM pg_tables WHERE tablename = 'questions';
  SELECT COUNT(*) INTO policy_count FROM pg_policies 
    WHERE tablename = 'questions' AND cmd = 'SELECT';
  
  -- Print summary
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE 'PRACTICE PAGE STATUS SUMMARY';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '';
  
  IF total_count = 0 THEN
    RAISE NOTICE '❌ CRITICAL: No questions in database';
    RAISE NOTICE '   → Upload questions from CSV files';
  ELSIF js_easy_count = 0 THEN
    RAISE NOTICE '❌ CRITICAL: No JavaScript easy MCQ questions';
    RAISE NOTICE '   → Practice page loads these by default';
    RAISE NOTICE '   → Check skill/level/type values';
  ELSIF rls_enabled AND policy_count = 0 THEN
    RAISE NOTICE '❌ CRITICAL: RLS enabled but no SELECT policy';
    RAISE NOTICE '   → Run: FIX_PRACTICE_PAGE_NOW.sql';
  ELSE
    RAISE NOTICE '✅ All checks passed!';
    RAISE NOTICE '   Total questions: %', total_count;
    RAISE NOTICE '   JavaScript easy MCQ: %', js_easy_count;
    RAISE NOTICE '   Practice page should work';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
END $$;
