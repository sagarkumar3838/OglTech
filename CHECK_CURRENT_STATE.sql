-- ============================================
-- CHECK CURRENT STATE - Run this first
-- ============================================
-- This shows you exactly what you have now
-- Run in Supabase SQL Editor

-- ============================================
-- 1. CHECK IF TABLES EXIST
-- ============================================
SELECT 
  'Table Check' as check_type,
  table_name,
  CASE 
    WHEN table_name = 'practice_questions' THEN '✅ Source table (your questions)'
    WHEN table_name = 'questions' THEN '✅ Target table (app looks here)'
    ELSE '❓ Other table'
  END as description
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('practice_questions', 'questions')
ORDER BY table_name;

-- ============================================
-- 2. COUNT QUESTIONS IN EACH TABLE
-- ============================================
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills,
  COUNT(DISTINCT level) as unique_levels
FROM practice_questions
UNION ALL
SELECT 
  'questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills,
  COUNT(DISTINCT level) as unique_levels
FROM questions;

-- ============================================
-- 3. SKILLS IN practice_questions
-- ============================================
SELECT 
  'practice_questions' as source,
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- ============================================
-- 4. SKILLS IN questions
-- ============================================
SELECT 
  'questions' as source,
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- ============================================
-- 5. SAMPLE QUESTIONS FROM practice_questions
-- ============================================
SELECT 
  'practice_questions sample' as info,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  jsonb_typeof(options) as options_format,
  correct_answer
FROM practice_questions
LIMIT 5;

-- ============================================
-- 6. SAMPLE QUESTIONS FROM questions
-- ============================================
SELECT 
  'questions sample' as info,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  jsonb_typeof(options) as options_format,
  correct_answer
FROM questions
LIMIT 5;

-- ============================================
-- 7. CHECK FOR FORMAT ISSUES
-- ============================================
-- Check skill name format (should be lowercase, no spaces)
SELECT 
  'Skill Format Issues' as check_type,
  skill as original_skill,
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as normalized_skill,
  COUNT(*) as question_count,
  CASE 
    WHEN skill = LOWER(TRIM(REPLACE(skill, ' ', ''))) THEN '✅ OK'
    ELSE '❌ Needs normalization'
  END as status
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- 8. CHECK LEVEL FORMAT
-- ============================================
-- Check level format (should be easy/medium/hard)
SELECT 
  'Level Format Issues' as check_type,
  level as original_level,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as normalized_level,
  COUNT(*) as question_count,
  CASE 
    WHEN level IN ('easy', 'medium', 'hard') THEN '✅ OK'
    ELSE '❌ Needs normalization'
  END as status
FROM practice_questions
GROUP BY level
ORDER BY level;

-- ============================================
-- 9. CHECK TYPE FORMAT
-- ============================================
-- Check type format (should be 'mcq')
SELECT 
  'Type Format Issues' as check_type,
  COALESCE(type, 'NULL') as current_type,
  COUNT(*) as question_count,
  CASE 
    WHEN type = 'mcq' THEN '✅ OK'
    WHEN type IS NULL OR type = '' THEN '⚠️ Empty (will be set to mcq)'
    ELSE '❌ Wrong type'
  END as status
FROM practice_questions
GROUP BY type
ORDER BY type;

-- ============================================
-- 10. MISSING SKILLS IN questions TABLE
-- ============================================
-- Skills in practice_questions but NOT in questions
SELECT 
  'Missing Skills' as check_type,
  pq.skill,
  COUNT(*) as questions_in_practice_table,
  '❌ Not in questions table' as status
FROM practice_questions pq
LEFT JOIN questions q ON pq.skill = q.skill
WHERE q.skill IS NULL
GROUP BY pq.skill
ORDER BY pq.skill;

-- ============================================
-- 11. SUMMARY
-- ============================================
SELECT 
  '📊 SUMMARY' as section,
  (SELECT COUNT(*) FROM practice_questions) as practice_questions_count,
  (SELECT COUNT(*) FROM questions) as questions_count,
  (SELECT COUNT(DISTINCT skill) FROM practice_questions) as skills_in_practice,
  (SELECT COUNT(DISTINCT skill) FROM questions) as skills_in_questions,
  CASE 
    WHEN (SELECT COUNT(*) FROM questions) = 0 THEN '❌ questions table is EMPTY - need to copy'
    WHEN (SELECT COUNT(*) FROM questions) < (SELECT COUNT(*) FROM practice_questions) THEN '⚠️ questions table has FEWER questions - need to copy more'
    ELSE '✅ questions table has questions'
  END as status;

-- ============================================
-- INTERPRETATION
-- ============================================
-- After running this script, you'll see:
--
-- 1. Which tables exist
-- 2. How many questions in each table
-- 3. What skills are in each table
-- 4. Sample questions from each table
-- 5. Format issues (skill names, levels, types)
-- 6. Which skills are missing from questions table
-- 7. Overall summary
--
-- If questions table is empty or has fewer questions:
-- → Run COPY_PRACTICE_QUESTIONS_TO_MAIN.sql
--
-- If format issues found:
-- → The copy script will fix them automatically
--
-- If everything looks good:
-- → Test in Practice page!
-- ============================================
