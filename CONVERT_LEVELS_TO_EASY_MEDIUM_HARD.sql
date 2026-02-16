-- ========================================
-- CONVERT ALL LEVELS TO easy/medium/hard
-- ========================================

-- Step 1: Check current levels
SELECT 'BEFORE CONVERSION' as status;

SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- Step 2: Convert level names
UPDATE questions
SET level = CASE level
  WHEN 'Basic' THEN 'easy'
  WHEN 'Intermediate' THEN 'medium'
  WHEN 'Advanced' THEN 'hard'
  ELSE LOWER(level)
END;

-- Step 3: Verify the conversion
SELECT 'AFTER CONVERSION' as status;

SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- Step 4: Check devtools specifically
SELECT 'DEVTOOLS LEVELS' as status;

SELECT skill, level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level
ORDER BY skill, level;

-- ========================================
-- RESULT: All questions now use easy/medium/hard
-- ========================================

-- Expected result:
-- easy: all Basic questions converted
-- medium: all Intermediate questions converted
-- hard: all Advanced questions converted
