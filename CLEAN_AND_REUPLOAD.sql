-- ========================================
-- CLEAN DATABASE AND RE-UPLOAD
-- ========================================

-- Option 1: Update old level names (keeps existing data)
-- ========================================

-- Update old "easy" to "Basic"
UPDATE practice_questions SET level = 'Basic' WHERE level = 'easy';

-- Update old "medium" to "Intermediate"  
UPDATE practice_questions SET level = 'Intermediate' WHERE level = 'medium';

-- Update old "hard" to "Advanced"
UPDATE practice_questions SET level = 'Advanced' WHERE level = 'hard';

-- Verify
SELECT level, COUNT(*) as count FROM practice_questions GROUP BY level;


-- Option 2: Delete ALL and start fresh (recommended)
-- ========================================

-- Delete all existing questions
DELETE FROM practice_questions;

-- Verify empty
SELECT COUNT(*) FROM practice_questions;
-- Should show: 0

-- Now run: UPLOAD_VALID_QUESTIONS.bat
-- This will upload all 9,464 questions with correct level names


-- ========================================
-- AFTER UPLOAD - VERIFY
-- ========================================

-- Check total
SELECT COUNT(*) FROM practice_questions;
-- Should show: 9464

-- Check devtools
SELECT level, COUNT(*) as count
FROM practice_questions
WHERE skill = 'Devtools'
GROUP BY level;
-- Should show:
-- Basic: 95
-- Intermediate: 248
-- Advanced: 110

-- Check all levels
SELECT level, COUNT(*) as count
FROM practice_questions
GROUP BY level;
-- Should show:
-- Basic: ~3000+
-- Intermediate: ~3000+
-- Advanced: ~3000+
