-- ========================================
-- DIAGNOSE: Why is questions table empty?
-- ========================================

-- 1. Check total count in questions table
SELECT 'questions table' as table_name, COUNT(*) as total FROM questions;

-- 2. Check total count in practice_questions table
SELECT 'practice_questions table' as table_name, COUNT(*) as total FROM practice_questions;

-- 3. Show sample from questions table (if any)
SELECT 'Sample from questions:' as info;
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
LIMIT 10;

-- 4. Show sample from practice_questions table
SELECT 'Sample from practice_questions:' as info;
SELECT skill, level, COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
LIMIT 10;

-- 5. Check if devtools exists in practice_questions
SELECT 'Devtools in practice_questions:' as info;
SELECT level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level;

-- ========================================
-- DIAGNOSIS:
-- ========================================
-- If questions table is empty (0 rows)
-- But practice_questions has data (9,464 rows)
-- Then you need to COPY from practice_questions to questions
-- ========================================
