-- ============================================
-- DIAGNOSE AND FIX QUESTION_TYPE VALUES
-- ============================================

-- Step 1: Check what values exist in question_type column
SELECT 
    question_type,
    COUNT(*) as count
FROM practice_questions
GROUP BY question_type
ORDER BY count DESC;

-- Step 2: Show sample rows with invalid question_type
SELECT 
    id,
    skill,
    level,
    question_type,
    correct_answer
FROM practice_questions
WHERE question_type NOT IN ('single', 'multiple')
   OR question_type IS NULL
LIMIT 10;

-- Step 3: Fix all invalid question_type values
-- Set to 'single' by default
UPDATE practice_questions
SET question_type = 'single'
WHERE question_type NOT IN ('single', 'multiple')
   OR question_type IS NULL;

-- Step 4: Verify the fix
SELECT 
    question_type,
    COUNT(*) as count
FROM practice_questions
GROUP BY question_type
ORDER BY count DESC;

-- Step 5: Now you can add the constraint
ALTER TABLE practice_questions
DROP CONSTRAINT IF EXISTS check_question_type;

ALTER TABLE practice_questions
ADD CONSTRAINT check_question_type 
CHECK (question_type IN ('single', 'multiple'));

-- Success message
DO $$
DECLARE
    single_count INTEGER;
    multiple_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO single_count FROM practice_questions WHERE question_type = 'single';
    SELECT COUNT(*) INTO multiple_count FROM practice_questions WHERE question_type = 'multiple';
    
    RAISE NOTICE '✅ Question type values fixed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '  - Single answer questions: %', single_count;
    RAISE NOTICE '  - Multiple answer questions: %', multiple_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Now you can run: add-multiple-correct-answers-support-FIXED.sql';
END $$;
