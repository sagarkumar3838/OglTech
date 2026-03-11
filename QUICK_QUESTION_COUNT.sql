-- ============================================
-- QUICK QUESTION COUNT - Easy to Read
-- ============================================

-- Simple table showing all skills with their question counts
SELECT 
  skill as "Skill",
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as "Basic",
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as "Intermediate",
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as "Advanced",
  COUNT(*) as "Total",
  CASE 
    WHEN COUNT(CASE WHEN level = 'Basic' THEN 1 END) >= 50 
     AND COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) >= 50 
     AND COUNT(CASE WHEN level = 'Advanced' THEN 1 END) >= 50 
    THEN '✅ Complete'
    WHEN COUNT(*) = 0 THEN '❌ Empty'
    ELSE '⚠️ Incomplete'
  END as "Status"
FROM practice_questions
GROUP BY skill
ORDER BY skill;

-- Quick summary at the bottom
SELECT 
  '📊 TOTAL' as "Skill",
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as "Basic",
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as "Intermediate",
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as "Advanced",
  COUNT(*) as "Total",
  COUNT(DISTINCT skill) || ' skills' as "Status"
FROM practice_questions;
