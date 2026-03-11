-- ============================================
-- ADD MULTIPLE CORRECT ANSWERS SUPPORT (FIXED)
-- ============================================
-- This migration adds support for questions with multiple correct answers
-- FIXED: Handles existing question_type column

-- Step 1: Add new column for multiple correct answers (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'practice_questions' 
        AND column_name = 'correct_answers'
    ) THEN
        ALTER TABLE practice_questions 
        ADD COLUMN correct_answers TEXT[] DEFAULT NULL;
        RAISE NOTICE '✅ Added correct_answers column';
    ELSE
        RAISE NOTICE 'ℹ️  correct_answers column already exists';
    END IF;
END $$;

-- Step 2: Migrate existing single answers to array format
-- This preserves existing data by converting single answer to array
UPDATE practice_questions 
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL AND correct_answer IS NOT NULL;

-- Step 3: Drop existing check constraint on question_type if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'practice_questions' 
        AND constraint_name LIKE '%question_type%'
    ) THEN
        ALTER TABLE practice_questions 
        DROP CONSTRAINT IF EXISTS practice_questions_question_type_check;
        RAISE NOTICE '✅ Dropped old question_type constraint';
    END IF;
END $$;

-- Step 4: Add question_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'practice_questions' 
        AND column_name = 'question_type'
    ) THEN
        ALTER TABLE practice_questions
        ADD COLUMN question_type TEXT DEFAULT 'single';
        RAISE NOTICE '✅ Added question_type column';
    ELSE
        RAISE NOTICE 'ℹ️  question_type column already exists';
    END IF;
END $$;

-- Step 5: Add new check constraint for question_type
ALTER TABLE practice_questions
DROP CONSTRAINT IF EXISTS check_question_type;

ALTER TABLE practice_questions
ADD CONSTRAINT check_question_type 
CHECK (question_type IN ('single', 'multiple'));

-- Step 6: Update question_type based on correct_answers array length
UPDATE practice_questions
SET question_type = CASE 
  WHEN correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 1 THEN 'multiple'
  ELSE 'single'
END;

-- Step 7: Add a check constraint to ensure at least one correct answer exists
ALTER TABLE practice_questions
DROP CONSTRAINT IF EXISTS check_has_correct_answer;

ALTER TABLE practice_questions
ADD CONSTRAINT check_has_correct_answer 
CHECK (
  (correct_answer IS NOT NULL AND correct_answer != '') 
  OR 
  (correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 0)
);

-- Step 8: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_questions_question_type 
ON practice_questions(question_type);

CREATE INDEX IF NOT EXISTS idx_practice_questions_correct_answers 
ON practice_questions USING GIN(correct_answers);

-- Step 9: Create helper function to check if answer is correct
CREATE OR REPLACE FUNCTION is_answer_correct(
  question_id UUID,
  user_answers TEXT[]
) RETURNS BOOLEAN AS $$
DECLARE
  question_record RECORD;
  correct BOOLEAN;
BEGIN
  -- Get the question
  SELECT correct_answer, correct_answers, question_type 
  INTO question_record
  FROM practice_questions 
  WHERE id = question_id;
  
  -- Return false if question not found
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check based on question type
  IF question_record.question_type = 'single' THEN
    -- Single answer: check if user provided exactly one answer and it matches
    correct := (
      array_length(user_answers, 1) = 1 
      AND user_answers[1] = question_record.correct_answer
    );
  ELSE
    -- Multiple answers: check if user answers match all correct answers
    correct := (
      question_record.correct_answers @> user_answers 
      AND user_answers @> question_record.correct_answers
    );
  END IF;
  
  RETURN correct;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create helper function to get correct answers for a question
CREATE OR REPLACE FUNCTION get_correct_answers(question_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  question_record RECORD;
BEGIN
  SELECT correct_answer, correct_answers, question_type 
  INTO question_record
  FROM practice_questions 
  WHERE id = question_id;
  
  -- Return empty array if question not found
  IF NOT FOUND THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  IF question_record.question_type = 'single' THEN
    RETURN ARRAY[question_record.correct_answer];
  ELSE
    RETURN question_record.correct_answers;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Update the stats view to include question types
DROP VIEW IF EXISTS practice_questions_stats;
CREATE OR REPLACE VIEW practice_questions_stats AS
SELECT 
    skill,
    level,
    type,
    question_type,
    COUNT(*) as total_questions,
    COUNT(DISTINCT topic) as total_topics,
    COUNT(*) FILTER (WHERE question_type = 'single') as single_answer_questions,
    COUNT(*) FILTER (WHERE question_type = 'multiple') as multiple_answer_questions
FROM practice_questions
WHERE is_active = TRUE
GROUP BY skill, level, type, question_type
ORDER BY skill, level, type;

-- Step 12: Grant permissions
GRANT EXECUTE ON FUNCTION is_answer_correct(UUID, TEXT[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_correct_answers(UUID) TO anon, authenticated;

-- Success message
DO $$
DECLARE
    total_questions INTEGER;
    single_count INTEGER;
    multiple_count INTEGER;
    migrated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_questions FROM practice_questions;
    SELECT COUNT(*) INTO single_count FROM practice_questions WHERE question_type = 'single';
    SELECT COUNT(*) INTO multiple_count FROM practice_questions WHERE question_type = 'multiple';
    SELECT COUNT(*) INTO migrated_count FROM practice_questions WHERE correct_answers IS NOT NULL;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ MULTIPLE CORRECT ANSWERS SUPPORT ADDED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Migration Summary:';
    RAISE NOTICE '  - Total questions: %', total_questions;
    RAISE NOTICE '  - Single answer: %', single_count;
    RAISE NOTICE '  - Multiple answer: %', multiple_count;
    RAISE NOTICE '  - Migrated to array: %', migrated_count;
    RAISE NOTICE '';
    RAISE NOTICE '📝 CSV Format for Multiple Answers:';
    RAISE NOTICE '  - Single answer: correct_answer = "A"';
    RAISE NOTICE '  - Multiple answers: correct_answer = "A,B,D" or "A|B|D"';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Usage:';
    RAISE NOTICE '  - Upload: npm run upload:multiple-answers';
    RAISE NOTICE '  - Validate: SELECT is_answer_correct(question_id, ARRAY[''A'', ''B'']);';
    RAISE NOTICE '  - Get answers: SELECT get_correct_answers(question_id);';
    RAISE NOTICE '';
    RAISE NOTICE '✨ Ready to use!';
    RAISE NOTICE '';
END $$;
