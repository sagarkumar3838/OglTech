-- ============================================
-- SHOW ALL QUESTIONS IN DATABASE
-- Run this to see what you have
-- ============================================

-- 1. Total count
SELECT COUNT(*) as total_questions FROM questions;

-- 2. Breakdown by skill and level
SELECT 
  skill, 
  level, 
  COUNT(*) as count,
  MIN(LEFT(question, 40)) as sample_question
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- 3. Show all HTML questions
SELECT 
  skill,
  level,
  LEFT(question, 60) as question_preview,
  type
FROM questions 
WHERE skill = 'html'
ORDER BY level, question;

-- 4. Count by skill (total per skill)
SELECT 
  skill,
  COUNT(*) as total,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard
FROM questions 
GROUP BY skill 
ORDER BY total DESC;

-- 5. Skills that need more questions (less than 10 per level)
SELECT 
  skill,
  level,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) < 10 THEN '⚠️ Need more questions'
    WHEN COUNT(*) < 30 THEN '⚡ Could use more'
    ELSE '✅ Good'
  END as status
FROM questions 
GROUP BY skill, level 
HAVING COUNT(*) < 30
ORDER BY count ASC;
