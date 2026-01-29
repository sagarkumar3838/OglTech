-- ============================================
-- VERIFY UPLOAD - Run after uploading questions
-- ============================================

-- 1. Total count (should be ~3000+)
SELECT COUNT(*) as total_questions FROM questions;

-- 2. Count by skill and level
SELECT 
  skill, 
  level, 
  COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- 3. Total per skill
SELECT 
  skill,
  COUNT(*) as total,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard
FROM questions 
GROUP BY skill 
ORDER BY total DESC;

-- 4. Check for any remaining uppercase (should be empty)
SELECT skill, level, COUNT(*) 
FROM questions 
WHERE skill != LOWER(skill) OR level != LOWER(level)
GROUP BY skill, level;

-- 5. Sample questions from each skill
SELECT DISTINCT ON (skill, level) 
  skill, 
  level, 
  type,
  LEFT(question, 50) as question_preview
FROM questions 
ORDER BY skill, level, created_at DESC;

-- 6. Check question types
SELECT type, COUNT(*) as count 
FROM questions 
GROUP BY type 
ORDER BY count DESC;

-- 7. Verify all Content Developer skills have questions
SELECT 
  skill,
  COUNT(*) as total,
  CASE 
    WHEN COUNT(*) >= 30 THEN '✅ Good'
    WHEN COUNT(*) >= 10 THEN '⚡ Okay'
    ELSE '⚠️ Need more'
  END as status
FROM questions 
WHERE skill IN ('html', 'css', 'javascript', 'jquery', 'oglknowledge')
GROUP BY skill
ORDER BY total DESC;

-- 8. Check for duplicates (should be empty or minimal)
SELECT 
  question,
  skill,
  level,
  COUNT(*) as duplicate_count
FROM questions
GROUP BY question, skill, level
HAVING COUNT(*) > 1
LIMIT 10;
