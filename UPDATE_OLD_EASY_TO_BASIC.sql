-- ========================================
-- UPDATE OLD "easy" LEVEL TO "Basic"
-- ========================================

-- This will change all old questions with level "easy" to "Basic"
-- so they match the new naming convention

-- 1. Check what needs to be updated
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE level IN ('easy', 'medium', 'hard')
GROUP BY skill, level
ORDER BY skill, level;

-- 2. Update old level names to new ones
UPDATE practice_questions
SET level = 'Basic'
WHERE level = 'easy';

UPDATE practice_questions
SET level = 'Intermediate'
WHERE level = 'medium';

UPDATE practice_questions
SET level = 'Advanced'
WHERE level = 'hard';

-- 3. Verify the update
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE skill LIKE '%devtools%' OR skill LIKE '%Devtools%'
GROUP BY skill, level
ORDER BY skill, level;

-- 4. Check all levels now
SELECT level, COUNT(*) as count
FROM practice_questions
GROUP BY level
ORDER BY level;

-- ========================================
-- RESULT: All questions now use Basic, Intermediate, Advanced
-- ========================================
