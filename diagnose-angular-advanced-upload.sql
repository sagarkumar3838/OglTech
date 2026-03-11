-- ============================================
-- DIAGNOSE ANGULAR ADVANCED UPLOAD ISSUE
-- ============================================

-- 1. Check current count in practice_questions
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as total_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced';

-- 2. Check if there are duplicates
SELECT 
  question_text,
  COUNT(*) as duplicate_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY question_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 3. Check the most recent questions added
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 80) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if questions exist in questions table instead
SELECT 
  'questions' as table_name,
  COUNT(*) as total_count
FROM questions
WHERE skill = 'angular' AND level = 'advanced';

-- 5. Check for case sensitivity issues
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'angular' AND LOWER(level) LIKE '%adv%'
GROUP BY skill, level;

-- 6. Check total Angular questions across all levels
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'angular'
GROUP BY level
ORDER BY level;

-- 7. Check if there's a unique constraint preventing inserts
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'practice_questions';
