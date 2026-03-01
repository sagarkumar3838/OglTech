-- Diagnose why questions aren't showing on Practice page

-- 1. Check if questions table exists and has data
SELECT 
  'Total questions in table' as check_type,
  COUNT(*) as count
FROM questions;

-- 2. Check questions by skill
SELECT 
  skill,
  COUNT(*) as question_count
FROM questions
GROUP BY skill
ORDER BY skill;

-- 3. Check questions by level
SELECT 
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY level
ORDER BY level;

-- 4. Check questions by type
SELECT 
  type,
  COUNT(*) as question_count
FROM questions
GROUP BY type
ORDER BY type;

-- 5. Check JavaScript beginner questions specifically (what Practice page loads by default)
SELECT 
  id,
  skill,
  level,
  type,
  question,
  LEFT(CAST(options AS TEXT), 100) as options_preview
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 5;

-- 6. Check if there are any JavaScript questions at all
SELECT 
  level,
  type,
  COUNT(*) as count
FROM questions
WHERE skill = 'javascript'
GROUP BY level, type;

-- 7. Check RLS policies on questions table
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

-- 8. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'questions';
