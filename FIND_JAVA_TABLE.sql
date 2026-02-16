-- ============================================
-- FIND YOUR JAVA QUESTIONS TABLE
-- ============================================
-- Run this to find where your Java questions are stored

-- 1. Find all tables with 'java' in the name
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as table_size
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name ILIKE '%java%'
ORDER BY table_name;

-- 2. Find all tables with 'practice' or 'question' in the name
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND (table_name ILIKE '%practice%' OR table_name ILIKE '%question%')
ORDER BY table_name;

-- 3. List ALL tables in your database
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 4. Check the main 'questions' table
SELECT 
  'Main questions table' as info,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills
FROM questions;

-- 5. List all skills in main questions table
SELECT 
  skill,
  COUNT(*) as question_count
FROM questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- AFTER YOU FIND THE TABLE NAME
-- ============================================
-- Replace 'YOUR_TABLE_NAME' below and run to see its structure

-- Check columns in your Java table
/*
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'YOUR_TABLE_NAME'
ORDER BY ordinal_position;
*/

-- See sample data from your Java table
/*
SELECT * FROM YOUR_TABLE_NAME LIMIT 5;
*/

-- Count questions in your Java table
/*
SELECT COUNT(*) as total_java_questions FROM YOUR_TABLE_NAME;
*/
