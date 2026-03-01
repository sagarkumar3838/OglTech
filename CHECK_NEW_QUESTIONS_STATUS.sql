-- ============================================
-- CHECK NEW QUESTIONS STATUS IN SUPABASE
-- ============================================

-- 1. Total count of questions in both tables
SELECT 'practice_questions' as table_name, COUNT(*) as total_questions
FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as total_questions
FROM questions;

-- 2. Count by skill and level in practice_questions
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- 3. Count by skill and level in questions table
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- 4. Recently added questions (last 24 hours)
SELECT 
  skill,
  level,
  COUNT(*) as recent_questions,
  MAX(created_at) as last_added
FROM practice_questions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY skill, level
ORDER BY last_added DESC;

-- 5. Check if questions table has recent additions
SELECT 
  skill,
  level,
  COUNT(*) as recent_questions,
  MAX(created_at) as last_added
FROM questions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY skill, level
ORDER BY last_added DESC;

-- 6. Show sample of most recent questions
SELECT 
  id,
  skill,
  level,
  LEFT(question, 50) as question_preview,
  created_at
FROM practice_questions
ORDER BY created_at DESC
LIMIT 10;

-- 7. Check for questions that exist in practice_questions but NOT in questions
SELECT 
  pq.skill,
  pq.level,
  COUNT(*) as missing_count
FROM practice_questions pq
LEFT JOIN questions q ON pq.id = q.id
WHERE q.id IS NULL
GROUP BY pq.skill, pq.level
ORDER BY missing_count DESC;
