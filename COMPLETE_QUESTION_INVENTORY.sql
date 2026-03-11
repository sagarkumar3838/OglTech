-- ============================================
-- COMPLETE PRACTICE QUESTIONS INVENTORY
-- ============================================
-- This gives you a full overview of all questions in your database

-- ============================================
-- 1. SUMMARY: Total Questions by Level
-- ============================================
SELECT '=== TOTAL QUESTIONS BY LEVEL ===' as section;

SELECT 
  level,
  COUNT(*) as total_questions,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM practice_questions
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
    ELSE 4
  END;

-- ============================================
-- 2. DETAILED: Questions by Skill and Level
-- ============================================
SELECT '=== QUESTIONS BY SKILL AND LEVEL ===' as section;

SELECT 
  skill,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced,
  COUNT(*) as total,
  CASE 
    WHEN COUNT(CASE WHEN level = 'Basic' THEN 1 END) >= 50 
     AND COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) >= 50 
     AND COUNT(CASE WHEN level = 'Advanced' THEN 1 END) >= 50 
    THEN '✅ COMPLETE'
    WHEN COUNT(*) >= 100 THEN '⚠️ PARTIAL'
    ELSE '❌ INCOMPLETE'
  END as status
FROM practice_questions
GROUP BY skill
ORDER BY total DESC, skill;

-- ============================================
-- 3. SKILLS WITH MISSING LEVELS
-- ============================================
SELECT '=== SKILLS WITH MISSING LEVELS ===' as section;

SELECT 
  skill,
  CASE WHEN COUNT(CASE WHEN level = 'Basic' THEN 1 END) = 0 THEN '❌ Missing Basic' ELSE '✅' END as basic_status,
  CASE WHEN COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) = 0 THEN '❌ Missing Intermediate' ELSE '✅' END as intermediate_status,
  CASE WHEN COUNT(CASE WHEN level = 'Advanced' THEN 1 END) = 0 THEN '❌ Missing Advanced' ELSE '✅' END as advanced_status,
  COUNT(*) as total_questions
FROM practice_questions
GROUP BY skill
HAVING 
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) = 0 
  OR COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) = 0 
  OR COUNT(CASE WHEN level = 'Advanced' THEN 1 END) = 0
ORDER BY total_questions DESC;

-- ============================================
-- 4. SKILLS READY FOR PRODUCTION
-- ============================================
SELECT '=== SKILLS READY FOR PRODUCTION (50+ per level) ===' as section;

SELECT 
  skill,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced,
  COUNT(*) as total
FROM practice_questions
GROUP BY skill
HAVING 
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) >= 50 
  AND COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) >= 50 
  AND COUNT(CASE WHEN level = 'Advanced' THEN 1 END) >= 50
ORDER BY total DESC;

-- ============================================
-- 5. SKILLS NEEDING MORE QUESTIONS
-- ============================================
SELECT '=== SKILLS NEEDING MORE QUESTIONS ===' as section;

SELECT 
  skill,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic,
  50 - COUNT(CASE WHEN level = 'Basic' THEN 1 END) as basic_needed,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate,
  50 - COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as intermediate_needed,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced,
  50 - COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as advanced_needed,
  COUNT(*) as total
FROM practice_questions
GROUP BY skill
HAVING 
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) < 50 
  OR COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) < 50 
  OR COUNT(CASE WHEN level = 'Advanced' THEN 1 END) < 50
ORDER BY total DESC;

-- ============================================
-- 6. CHECK FOR NON-STANDARD LEVEL NAMES
-- ============================================
SELECT '=== NON-STANDARD LEVEL NAMES (NEED FIXING) ===' as section;

SELECT 
  level,
  COUNT(*) as count,
  STRING_AGG(DISTINCT skill, ', ') as affected_skills
FROM practice_questions
WHERE level NOT IN ('Basic', 'Intermediate', 'Advanced')
GROUP BY level
ORDER BY count DESC;

-- ============================================
-- 7. OVERALL DATABASE STATISTICS
-- ============================================
SELECT '=== OVERALL STATISTICS ===' as section;

SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT level) as total_levels,
  MIN(created_at) as oldest_question,
  MAX(created_at) as newest_question,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as total_basic,
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as total_intermediate,
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as total_advanced
FROM practice_questions;

-- ============================================
-- 8. ALPHABETICAL LIST OF ALL SKILLS
-- ============================================
SELECT '=== ALL SKILLS (ALPHABETICAL) ===' as section;

SELECT 
  ROW_NUMBER() OVER (ORDER BY skill) as "#",
  skill,
  COUNT(CASE WHEN level = 'Basic' THEN 1 END) as "Basic",
  COUNT(CASE WHEN level = 'Intermediate' THEN 1 END) as "Int",
  COUNT(CASE WHEN level = 'Advanced' THEN 1 END) as "Adv",
  COUNT(*) as "Total"
FROM practice_questions
GROUP BY skill
ORDER BY skill;
