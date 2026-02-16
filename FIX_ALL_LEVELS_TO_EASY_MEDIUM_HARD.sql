-- ========================================
-- ULTIMATE FIX: Convert ALL levels to easy/medium/hard
-- ========================================
-- This will fix ALL skills at once, regardless of current naming
-- ========================================

-- STEP 1: Show current state
SELECT '=== BEFORE FIX ===' as status;

SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- STEP 2: Convert ALL level variations to standardized names
UPDATE questions
SET level = CASE 
  -- Convert Basic variations
  WHEN LOWER(level) = 'basic' THEN 'easy'
  WHEN LOWER(level) = 'beginner' THEN 'easy'
  
  -- Convert Intermediate variations
  WHEN LOWER(level) = 'intermediate' THEN 'medium'
  
  -- Convert Advanced variations
  WHEN LOWER(level) = 'advanced' THEN 'hard'
  
  -- Already correct (lowercase)
  WHEN level = 'easy' THEN 'easy'
  WHEN level = 'medium' THEN 'medium'
  WHEN level = 'hard' THEN 'hard'
  
  -- Fallback: lowercase whatever it is
  ELSE LOWER(level)
END;

-- STEP 3: Show results
SELECT '=== AFTER FIX ===' as status;

SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- STEP 4: Verify each skill has correct levels
SELECT '=== ALL SKILLS BREAKDOWN ===' as status;

SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'easy' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'hard' THEN 3
  END;

-- STEP 5: Check devtools specifically
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

-- ========================================
-- EXPECTED RESULT:
-- All questions now use: easy, medium, hard
-- No more: Basic, Intermediate, Advanced
-- ========================================
