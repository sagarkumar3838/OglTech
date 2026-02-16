-- ========================================
-- CHECK COLUMNS IN BOTH TABLES
-- ========================================

-- Check practice_questions columns
SELECT 'practice_questions columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- Check questions columns
SELECT 'questions columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- Show sample data from practice_questions
SELECT 'Sample from practice_questions:' as info;
SELECT * FROM practice_questions LIMIT 1;

-- Show sample data from questions
SELECT 'Sample from questions:' as info;
SELECT * FROM questions LIMIT 1;
