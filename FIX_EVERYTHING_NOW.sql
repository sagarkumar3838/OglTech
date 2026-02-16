-- ========================================
-- ONE SOLUTION TO FIX ALL ISSUES
-- ========================================
-- This will:
-- 1. Delete practice_questions table (we don't need it anymore)
-- 2. Convert all levels in questions table: Basic/Intermediate/Advanced → easy/medium/hard
-- 3. Verify everything works
-- ========================================

-- STEP 1: Convert all levels in questions table
UPDATE questions
SET level = CASE 
  WHEN LOWER(level) = 'basic' THEN 'easy'
  WHEN LOWER(level) = 'beginner' THEN 'easy'
  WHEN LOWER(level) = 'intermediate' THEN 'medium'
  WHEN LOWER(level) = 'advanced' THEN 'hard'
  WHEN level = 'easy' THEN 'easy'
  WHEN level = 'medium' THEN 'medium'
  WHEN level = 'hard' THEN 'hard'
  ELSE LOWER(level)
END;

-- STEP 2: Verify total count
SELECT '=== TOTAL QUESTIONS ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

-- STEP 3: Verify levels
SELECT '=== LEVELS BREAKDOWN ===' as status;
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

-- STEP 4: Verify devtools
SELECT '=== DEVTOOLS VERIFICATION ===' as status;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

-- STEP 5: Show all skills
SELECT '=== ALL SKILLS (first 20) ===' as status;
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END
LIMIT 20;

-- ========================================
-- RESULT: All questions now use easy/medium/hard
-- Your frontend will show all questions correctly!
-- ========================================

-- OPTIONAL: Drop practice_questions table (uncomment if you want to clean up)
-- DROP TABLE IF EXISTS practice_questions;
