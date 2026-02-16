-- ========================================
-- STEP 1: DIAGNOSE - Find exact column names
-- ========================================

-- Check row counts
SELECT 'practice_questions' as table_name, COUNT(*) as rows FROM practice_questions
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as rows FROM questions;

-- Show columns in questions table
SELECT 
  'questions table columns:' as info,
  column_name,
  data_type,
  ordinal_position
FROM information_schema.columns
WHERE table_name = 'questions'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show columns in practice_questions table
SELECT 
  'practice_questions table columns:' as info,
  column_name,
  data_type,
  ordinal_position
FROM information_schema.columns
WHERE table_name = 'practice_questions'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample from practice_questions
SELECT 'Sample from practice_questions:' as info;
SELECT * FROM practice_questions LIMIT 2;

-- ========================================
-- AFTER RUNNING THIS:
-- Look at the column names in "questions table columns"
-- Then I'll create the exact INSERT statement you need
-- ========================================
