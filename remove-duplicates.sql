-- ============================================
-- REMOVE DUPLICATE QUESTIONS
-- Run this if you uploaded the CSV twice
-- ============================================

-- 1. Check current state
SELECT '=== BEFORE CLEANUP ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

-- 2. Show duplicates
SELECT 
  question,
  skill,
  level,
  COUNT(*) as duplicate_count
FROM questions
GROUP BY question, skill, level
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 3. Count total duplicates
SELECT 
  COUNT(*) as total_duplicate_rows
FROM (
  SELECT question, skill, level, COUNT(*) as cnt
  FROM questions
  GROUP BY question, skill, level
  HAVING COUNT(*) > 1
) as duplicates;

-- 4. Remove duplicates (keep the oldest one based on created_at)
DELETE FROM questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY question, skill, level 
        ORDER BY created_at ASC, id ASC
      ) as rn
    FROM questions
  ) as ranked
  WHERE rn > 1
);

-- 5. Check after cleanup
SELECT '=== AFTER CLEANUP ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

-- 6. Verify no duplicates remain
SELECT 
  question,
  skill,
  level,
  COUNT(*) as duplicate_count
FROM questions
GROUP BY question, skill, level
HAVING COUNT(*) > 1;

-- 7. Final breakdown
SELECT 
  skill, 
  level, 
  COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;
