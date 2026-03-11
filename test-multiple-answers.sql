-- ============================================
-- TEST MULTIPLE CORRECT ANSWERS FEATURE
-- ============================================
-- Run this after migration to verify everything works

-- Test 1: Check if new columns exist
DO $$
BEGIN
    RAISE NOTICE '=== TEST 1: Checking Schema ===';
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'practice_questions' 
        AND column_name = 'correct_answers'
    ) THEN
        RAISE NOTICE '✅ correct_answers column exists';
    ELSE
        RAISE NOTICE '❌ correct_answers column missing';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'practice_questions' 
        AND column_name = 'question_type'
    ) THEN
        RAISE NOTICE '✅ question_type column exists';
    ELSE
        RAISE NOTICE '❌ question_type column missing';
    END IF;
END $$;

-- Test 2: Check if functions exist
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 2: Checking Functions ===';
    
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_answer_correct'
    ) THEN
        RAISE NOTICE '✅ is_answer_correct() function exists';
    ELSE
        RAISE NOTICE '❌ is_answer_correct() function missing';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'get_correct_answers'
    ) THEN
        RAISE NOTICE '✅ get_correct_answers() function exists';
    ELSE
        RAISE NOTICE '❌ get_correct_answers() function missing';
    END IF;
END $$;

-- Test 3: Insert test questions
DO $$
DECLARE
    single_q_id UUID;
    multiple_q_id UUID;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 3: Inserting Test Questions ===';
    
    -- Insert single answer question
    INSERT INTO practice_questions (
        skill, level, question_text,
        option_a, option_b, option_c, option_d,
        correct_answer, correct_answers, question_type,
        explanation, topic
    ) VALUES (
        'test', 'beginner', 'What is 2+2?',
        '3', '4', '5', '6',
        'B', ARRAY['B'], 'single',
        'Basic math', 'Math'
    ) RETURNING id INTO single_q_id;
    
    RAISE NOTICE '✅ Inserted single answer question: %', single_q_id;
    
    -- Insert multiple answer question
    INSERT INTO practice_questions (
        skill, level, question_text,
        option_a, option_b, option_c, option_d,
        correct_answer, correct_answers, question_type,
        explanation, topic
    ) VALUES (
        'test', 'beginner', 'Which are even numbers?',
        '2', '3', '4', '5',
        'A', ARRAY['A', 'C'], 'multiple',
        '2 and 4 are even', 'Math'
    ) RETURNING id INTO multiple_q_id;
    
    RAISE NOTICE '✅ Inserted multiple answer question: %', multiple_q_id;
    
    -- Test 4: Validate single answer
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 4: Testing Single Answer Validation ===';
    
    IF is_answer_correct(single_q_id, ARRAY['B']) THEN
        RAISE NOTICE '✅ Correct answer B validated successfully';
    ELSE
        RAISE NOTICE '❌ Correct answer B validation failed';
    END IF;
    
    IF NOT is_answer_correct(single_q_id, ARRAY['A']) THEN
        RAISE NOTICE '✅ Incorrect answer A rejected successfully';
    ELSE
        RAISE NOTICE '❌ Incorrect answer A was accepted (should fail)';
    END IF;
    
    -- Test 5: Validate multiple answers
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 5: Testing Multiple Answer Validation ===';
    
    IF is_answer_correct(multiple_q_id, ARRAY['A', 'C']) THEN
        RAISE NOTICE '✅ Correct answers A,C validated successfully';
    ELSE
        RAISE NOTICE '❌ Correct answers A,C validation failed';
    END IF;
    
    IF NOT is_answer_correct(multiple_q_id, ARRAY['A']) THEN
        RAISE NOTICE '✅ Partial answer A rejected successfully';
    ELSE
        RAISE NOTICE '❌ Partial answer A was accepted (should fail)';
    END IF;
    
    IF NOT is_answer_correct(multiple_q_id, ARRAY['A', 'B', 'C']) THEN
        RAISE NOTICE '✅ Extra answer B rejected successfully';
    ELSE
        RAISE NOTICE '❌ Extra answer B was accepted (should fail)';
    END IF;
    
    -- Test 6: Get correct answers
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 6: Testing Get Correct Answers ===';
    
    RAISE NOTICE 'Single answer question correct answers: %', get_correct_answers(single_q_id);
    RAISE NOTICE 'Multiple answer question correct answers: %', get_correct_answers(multiple_q_id);
    
    -- Clean up test data
    DELETE FROM practice_questions WHERE skill = 'test';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Test data cleaned up';
END $$;

-- Test 7: Check existing data migration
DO $$
DECLARE
    total_questions INTEGER;
    single_count INTEGER;
    multiple_count INTEGER;
    migrated_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST 7: Checking Data Migration ===';
    
    SELECT COUNT(*) INTO total_questions FROM practice_questions;
    SELECT COUNT(*) INTO single_count FROM practice_questions WHERE question_type = 'single';
    SELECT COUNT(*) INTO multiple_count FROM practice_questions WHERE question_type = 'multiple';
    SELECT COUNT(*) INTO migrated_count FROM practice_questions WHERE correct_answers IS NOT NULL;
    
    RAISE NOTICE 'Total questions: %', total_questions;
    RAISE NOTICE 'Single answer questions: %', single_count;
    RAISE NOTICE 'Multiple answer questions: %', multiple_count;
    RAISE NOTICE 'Questions with correct_answers array: %', migrated_count;
    
    IF migrated_count = total_questions THEN
        RAISE NOTICE '✅ All questions migrated successfully';
    ELSE
        RAISE NOTICE '⚠️  Some questions not migrated: % of %', total_questions - migrated_count, total_questions;
    END IF;
END $$;

-- Test 8: View statistics
SELECT 
    '=== TEST 8: Question Statistics ===' as test;

SELECT 
    skill,
    level,
    question_type,
    COUNT(*) as count
FROM practice_questions
GROUP BY skill, level, question_type
ORDER BY skill, level, question_type
LIMIT 20;

-- Final Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MULTIPLE ANSWERS FEATURE TEST COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'If all tests passed:';
    RAISE NOTICE '  ✅ Schema is correct';
    RAISE NOTICE '  ✅ Functions work properly';
    RAISE NOTICE '  ✅ Validation logic is correct';
    RAISE NOTICE '  ✅ Data migration successful';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Upload questions with multiple answers';
    RAISE NOTICE '  2. Update frontend to show checkboxes';
    RAISE NOTICE '  3. Test user experience';
    RAISE NOTICE '';
END $$;
