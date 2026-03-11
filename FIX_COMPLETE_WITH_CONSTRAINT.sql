-- ============================================
-- COMPLETE FIX WITH CONSTRAINT HANDLING
-- ============================================

-- Step 1: Check what the level constraint allows
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%level%';

-- Step 2: See all current level values
SELECT 
  DISTINCT level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Step 3: Map invalid levels to valid ones
-- 'basic' should probably be 'beginner' or 'easy'
-- 'Advanced' should be 'advanced'
-- 'Intermediate' should be 'intermediate'

-- First, let's see what needs mapping
SELECT 
  level,
  COUNT(*) as count,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'beginner'
    WHEN LOWER(level) = 'easy' THEN 'beginner'
    WHEN LOWER(level) = 'medium' THEN 'intermediate'
    WHEN LOWER(level) = 'hard' THEN 'advanced'
    ELSE LOWER(level)
  END as mapped_level
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Step 4: Delete duplicates FIRST (before any updates)
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY 
               LOWER(skill), 
               CASE 
                 WHEN LOWER(level) = 'basic' THEN 'beginner'
                 WHEN LOWER(level) = 'easy' THEN 'beginner'
                 WHEN LOWER(level) = 'medium' THEN 'intermediate'
                 WHEN LOWER(level) = 'hard' THEN 'advanced'
                 ELSE LOWER(level)
               END,
               LOWER(question_text)
             ORDER BY created_at DESC NULLS LAST, id DESC
           ) as rn
    FROM practice_questions
  ) t
  WHERE rn > 1
);

-- Step 5: Now update to standardized values
UPDATE practice_questions
SET 
  skill = LOWER(skill),
  level = CASE 
    WHEN LOWER(level) = 'basic' THEN 'beginner'
    WHEN LOWER(level) = 'easy' THEN 'beginner'
    WHEN LOWER(level) = 'medium' THEN 'intermediate'
    WHEN LOWER(level) = 'hard' THEN 'advanced'
    ELSE LOWER(level)
  END;

-- Step 6: Verify Angular advanced count
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
GROUP BY skill, level;

-- Step 7: Check all Angular levels
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'angular'
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
  END;

-- Step 8: Overall summary
SELECT 
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT level) as total_levels,
  COUNT(*) as total_questions
FROM practice_questions;

-- Step 9: Show level distribution
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;
