-- COMPREHENSIVE DUPLICATE DIAGNOSIS
-- Run this FIRST to see the full scope of duplicates

-- ============================================================
-- 1. OVERALL SUMMARY
-- ============================================================

SELECT 
  '📊 DATABASE OVERVIEW' as section,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  COUNT(*) - COUNT(DISTINCT (skill, level, question_text)) as total_duplicates,
  ROUND(100.0 * (COUNT(*) - COUNT(DISTINCT (skill, level, question_text))) / COUNT(*), 2) as duplicate_percentage
FROM practice_questions;

-- ============================================================
-- 2. DUPLICATES BY SKILL
-- ============================================================

SELECT 
  '📋 DUPLICATES BY SKILL' as section,
  skill,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions,
  COUNT(*) - COUNT(DISTINCT question_text) as duplicates,
  ROUND(100.0 * (COUNT(*) - COUNT(DISTINCT question_text)) / COUNT(*), 2) as duplicate_pct
FROM practice_questions
GROUP BY skill
ORDER BY COUNT(*) - COUNT(DISTINCT question_text) DESC;

-- ============================================================
-- 3. DUPLICATES BY SKILL AND LEVEL
-- ============================================================

SELECT 
  '📊 DUPLICATES BY SKILL & LEVEL' as section,
  skill,
  level,
  COUNT(*) as total,
  COUNT(DISTINCT question_text) as unique_q,
  COUNT(*) - COUNT(DISTINCT question_text) as duplicates
FROM practice_questions
GROUP BY skill, level
HAVING COUNT(*) > COUNT(DISTINCT question_text)
ORDER BY COUNT(*) - COUNT(DISTINCT question_text) DESC;

-- ============================================================
-- 4. TOP 20 MOST DUPLICATED QUESTIONS
-- ============================================================

SELECT 
  '🔍 TOP DUPLICATED QUESTIONS' as section,
  skill,
  level,
  LEFT(question_text, 100) as question_preview,
  COUNT(*) as times_duplicated,
  ARRAY_AGG(id ORDER BY id) as all_ids
FROM practice_questions
GROUP BY skill, level, question_text
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC
LIMIT 20;

-- ============================================================
-- 5. SKILLS WITH NO DUPLICATES (GOOD ONES)
-- ============================================================

SELECT 
  '✅ CLEAN SKILLS (NO DUPLICATES)' as section,
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
HAVING COUNT(*) = COUNT(DISTINCT question_text)
ORDER BY skill, level;

-- ============================================================
-- 6. ESTIMATED CLEANUP IMPACT
-- ============================================================

SELECT 
  '💾 CLEANUP IMPACT' as section,
  COUNT(*) as current_total_rows,
  COUNT(DISTINCT (skill, level, question_text)) as rows_after_cleanup,
  COUNT(*) - COUNT(DISTINCT (skill, level, question_text)) as rows_to_delete,
  ROUND(100.0 * COUNT(DISTINCT (skill, level, question_text)) / COUNT(*), 2) as retention_percentage
FROM practice_questions;
