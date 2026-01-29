-- ============================================
-- CHECK CURRENT STATE OF DATABASE
-- Run this to see what you have now
-- ============================================

-- 1. Total questions
SELECT COUNT(*) as total_questions FROM questions;

-- 2. Check for duplicates
SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT CONCAT(question, skill, level)) as unique_questions,
  COUNT(*) - COUNT(DISTINCT CONCAT(question, skill, level)) as duplicate_rows
FROM questions;

-- 3. Show some duplicate examples
SELECT 
  LEFT(question, 60) as question_preview,
  skill,
  level,
  COUNT(*) as appears_times
FROM questions
GROUP BY question, skill, level
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC
LIMIT 10;

-- 4. Breakdown by skill
SELECT 
  skill, 
  COUNT(*) as total,
  COUNT(DISTINCT question) as unique_questions
FROM questions 
GROUP BY skill 
ORDER BY total DESC;
