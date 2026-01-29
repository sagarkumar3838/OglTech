-- ============================================
-- DELETE ALL QUESTIONS FROM DATABASE
-- WARNING: This cannot be undone!
-- ============================================

-- Show current count before deletion
SELECT '=== BEFORE DELETION ===' as status;
SELECT COUNT(*) as total_questions FROM questions;
SELECT skill, level, COUNT(*) as count FROM questions GROUP BY skill, level ORDER BY skill, level;

-- Uncomment the line below to actually delete all questions
-- DELETE FROM questions;

-- After deletion (uncomment above first)
-- SELECT '=== AFTER DELETION ===' as status;
-- SELECT COUNT(*) as total_questions FROM questions;

-- ============================================
-- INSTRUCTIONS:
-- 1. Review the BEFORE DELETION counts
-- 2. If you're sure, uncomment the DELETE line
-- 3. Run the script again
-- 4. Check AFTER DELETION shows 0
-- ============================================
