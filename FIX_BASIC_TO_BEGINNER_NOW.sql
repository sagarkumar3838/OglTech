-- ============================================
-- FIX: Convert "basic" to "beginner"
-- ============================================

-- Step 1: Check current state
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Step 2: Update "basic" to "beginner"
UPDATE practice_questions
SET level = 'beginner'
WHERE level = 'basic';

-- Step 3: Verify the fix
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- Step 4: Check for any remaining issues
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE level NOT IN ('beginner', 'intermediate', 'advanced')
GROUP BY level;
