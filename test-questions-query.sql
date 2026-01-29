-- ============================================
-- TEST QUERIES - Run AFTER cleanup to verify
-- ============================================

-- 1. Check total questions
SELECT COUNT(*) as total_questions FROM questions;

-- 2. Check questions by skill and level
SELECT 
  skill, 
  level, 
  COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- 3. Check if Content Developer skills have questions
SELECT 
  skill,
  COUNT(*) as total,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard
FROM questions 
WHERE skill IN ('html', 'css', 'javascript', 'jquery', 'oglknowledge')
GROUP BY skill;

-- 4. Sample questions from HTML easy level (should return 10 random)
SELECT 
  id,
  skill,
  level,
  LEFT(question, 50) as question_preview,
  type
FROM questions 
WHERE skill = 'html' AND level = 'easy'
ORDER BY RANDOM()
LIMIT 10;

-- 5. Check for any remaining uppercase levels (should be empty)
SELECT skill, level, COUNT(*) 
FROM questions 
WHERE level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')
GROUP BY skill, level;

-- 6. Check for duplicate questions (should be empty)
SELECT 
  question,
  skill,
  level,
  COUNT(*) as duplicate_count
FROM questions
GROUP BY question, skill, level
HAVING COUNT(*) > 1;

-- 7. List all unique skills (verify only needed skills remain)
SELECT DISTINCT skill, COUNT(*) as question_count
FROM questions
GROUP BY skill
ORDER BY skill;

-- 8. Verify question structure (check if all required fields exist)
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN question IS NOT NULL AND question != '' THEN 1 END) as has_question,
  COUNT(CASE WHEN options IS NOT NULL THEN 1 END) as has_options,
  COUNT(CASE WHEN correct_answer IS NOT NULL THEN 1 END) as has_answer,
  COUNT(CASE WHEN type IS NOT NULL THEN 1 END) as has_type
FROM questions;
