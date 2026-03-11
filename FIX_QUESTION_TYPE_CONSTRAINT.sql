-- ============================================
-- FIX QUESTION_TYPE CONSTRAINT ERROR
-- ============================================
-- Run this to fix the constraint error you're experiencing

-- Step 1: Drop the old constraint
ALTER TABLE practice_questions 
DROP CONSTRAINT IF EXISTS practice_questions_question_type_check;

-- Step 2: Add the correct constraint
ALTER TABLE practice_questions
ADD CONSTRAINT check_question_type 
CHECK (question_type IN ('single', 'multiple'));

-- Step 3: Verify it worked
DO $$
BEGIN
    RAISE NOTICE '✅ Constraint fixed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Now you can run: add-multiple-correct-answers-support-FIXED.sql';
END $$;
