-- ========================================
-- FIND ACTUAL COLUMN NAMES IN BOTH TABLES
-- ========================================

-- Show ALL columns in questions table
SELECT 'questions table columns:' as info;
SELECT 
  column_name, 
  data_type,
  ordinal_position
FROM information_schema.columns
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- Show ALL columns in practice_questions table
SELECT 'practice_questions table columns:' as info;
SELECT 
  column_name, 
  data_type,
  ordinal_position
FROM information_schema.columns
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- Show sample row from questions (if any data exists)
SELECT 'Sample from questions:' as info;
SELECT * FROM questions LIMIT 1;

-- Show sample row from practice_questions
SELECT 'Sample from practice_questions:' as info;
SELECT * FROM practice_questions LIMIT 1;

-- Count rows in each table
SELECT 'Row counts:' as info;
SELECT 'questions' as table_name, COUNT(*) as count FROM questions
UNION ALL
SELECT 'practice_questions' as table_name, COUNT(*) as count FROM practice_questions;
