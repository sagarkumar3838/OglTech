-- ============================================================================
-- COMPLETE FIX FOR POSTGRESQL QUESTIONS
-- ============================================================================
-- This script will:
-- 1. Show current status
-- 2. Delete ALL PostgreSQL questions
-- 3. Let you re-upload clean data
-- ============================================================================

-- STEP 1: Check current status
-- ============================================================================
SELECT 
    'BEFORE DELETE' as status,
    level,
    COUNT(*) as total,
    COUNT(CASE WHEN correct_answer IN ('A', 'B', 'C', 'D') THEN 1 END) as valid,
    COUNT(CASE WHEN correct_answer NOT IN ('A', 'B', 'C', 'D') THEN 1 END) as invalid
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY level
ORDER BY level;


-- STEP 2: Show what correct_answer values exist
-- ============================================================================
SELECT 
    level,
    correct_answer,
    COUNT(*) as count
FROM practice_questions
WHERE skill = 'postgresql'
GROUP BY level, correct_answer
ORDER BY level, count DESC;


-- STEP 3: DELETE ALL POSTGRESQL QUESTIONS (UNCOMMENT TO RUN)
-- ============================================================================
-- WARNING: This will delete ALL PostgreSQL questions!
-- Uncomment the line below to execute:

/*
DELETE FROM practice_questions
WHERE skill = 'postgresql';
*/


-- STEP 4: Verify deletion (run after Step 3)
-- ============================================================================
SELECT 
    'AFTER DELETE' as status,
    COUNT(*) as remaining_postgresql_questions
FROM practice_questions
WHERE skill = 'postgresql';

-- Expected: 0


-- ============================================================================
-- AFTER RUNNING THIS:
-- ============================================================================
-- 1. Create NEW CSV files with ONLY valid questions (correct_answer = A/B/C/D)
-- 2. Upload using: npx tsx scripts/upload-csv-no-duplicates.ts questions/postgresql-beginner.csv
-- 3. Target: 100 questions per level (beginner, intermediate, advanced)
-- ============================================================================
