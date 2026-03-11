-- ============================================
-- FIX: Convert ALL level variations to standard format
-- ============================================

-- Step 1: Check current state (see all variations)
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Step 2: Update ALL variations to lowercase standard
-- This handles: Basic, basic, Beginner, beginner, Intermediate, intermediate, Advanced, advanced
UPDATE practice_questions
SET level = CASE 
  WHEN LOWER(level) IN ('basic', 'beginner', 'easy') THEN 'beginner'
  WHEN LOWER(level) IN ('intermediate', 'medium') THEN 'intermediate'
  WHEN LOWER(level) IN ('advanced', 'hard') THEN 'advanced'
  ELSE LOWER(level)
END;

-- Step 3: Verify the fix
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
    ELSE 4
  END;

-- Step 4: Check for any remaining invalid levels
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE level NOT IN ('beginner', 'intermediate', 'advanced')
GROUP BY level;

-- Step 5: Show total by level
SELECT 
  'Total Questions' as summary,
  SUM(CASE WHEN level = 'beginner' THEN 1 ELSE 0 END) as beginner_count,
  SUM(CASE WHEN level = 'intermediate' THEN 1 ELSE 0 END) as intermediate_count,
  SUM(CASE WHEN level = 'advanced' THEN 1 ELSE 0 END) as advanced_count,
  COUNT(*) as total
FROM practice_questions;
