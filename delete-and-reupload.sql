-- ============================================
-- DELETE ALL QUESTIONS
-- Run this first, then re-upload
-- ============================================

-- Show current count
SELECT '=== BEFORE DELETION ===' as status;
SELECT COUNT(*) as total_questions FROM questions;
SELECT skill, level, COUNT(*) as count FROM questions GROUP BY skill, level;

-- Delete all questions
DELETE FROM questions;

-- Verify deletion
SELECT '=== AFTER DELETION ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

-- ============================================
-- NEXT STEP:
-- After running this, go to terminal and run:
-- npx tsx scripts/upload-csv-to-supabase.ts client/dist/assets/ogl_developer_questions_combined_3000_cleaned.csv
-- ============================================
