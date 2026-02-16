-- ========================================
-- FIX DEVTOOLS - COPY FROM practice_questions
-- ========================================

-- First, let's see what columns both tables have
SELECT 'questions table columns:' as info;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'questions' ORDER BY ordinal_position;

SELECT 'practice_questions table columns:' as info;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'practice_questions' ORDER BY ordinal_position;

-- Check current devtools in questions table
SELECT 'CURRENT devtools in questions table:' as status;
SELECT skill, level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level;

-- Check devtools in practice_questions table  
SELECT 'devtools in practice_questions table:' as status;
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%devtools%'
GROUP BY skill, level;
