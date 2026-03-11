-- ============================================
-- ADD MULTIPLE CORRECT ANSWERS SUPPORT
-- ============================================
-- This migration adds support for questions with multiple correct answers

-- Step 1: Add new column for multiple correct answers
ALTER TABLE practice_questions 
ADD COLUMN IF NOT EXISTS correct_answers TEXT[] DEFAULT NULL;

-- Step 2: Migrate existing single answers to array format
-- This preserves existing data by converting single answer to array
UPDATE practice_questions 
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL AND correct_answer IS NOT NULL;

-- Step 3: Add a check constraint to ensure at least one correct answer exists
ALTER TABLE practice_questions
ADD CONSTRAINT check_has_correct_answer 
CHECK (
  (correct_answer IS NOT NULL AND correct_answer != '') 
  OR 
  (correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 0)
);

-- Step 4: Add question_type to distinguish single vs multiple answer questions
ALTER TABLE practice_questions
ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'single' 
CHECK (question_type IN ('single', 'multiple'));

-- Step 5: Update question_type based on correct_answers array length
UPDATE practice_questions
SET question_type = CASE 
  WHEN correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 1 THEN 'multiple'
  ELSE 'single'
END;

-- Step 6: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_questions_question_type 
ON practice_questions(question_type);

-- Step 7: Create helper function to check if answer is correct
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

-- Step 8: Create helper function to get correct answers for a question
CREATE OR REPLACE FUNCTION get_correct_answers(question_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  question_record RECORD;
BEGIN
  SELECT correct_answer, correct_answers, question_type 
  INTO question_record
  FROM practice_questions 
  WHERE id = question_id;
  
  IF question_record.question_type = 'single' THEN
    RETURN ARRAY[question_record.correct_answer];
  ELSE
    RETURN question_record.correct_answers;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Update the stats view to include question types
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

-- Step 10: Grant permissions
GRANT EXECUTE ON FUNCTION is_answer_correct(UUID, TEXT[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_correct_answers(UUID) TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Multiple correct answers support added successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Summary:';
    RAISE NOTICE '  - Added correct_answers column (TEXT[])';
    RAISE NOTICE '  - Added question_type column (single/multiple)';
    RAISE NOTICE '  - Migrated existing data to new format';
    RAISE NOTICE '  - Created helper functions for answer validation';
    RAISE NOTICE '';
    RAISE NOTICE '📝 CSV Format for Multiple Answers:';
    RAISE NOTICE '  - Single answer: correct_answer = "A"';
    RAISE NOTICE '  - Multiple answers: correct_answer = "A,B,D" or "A|B|D"';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Usage:';
    RAISE NOTICE '  - SELECT is_answer_correct(question_id, ARRAY[''A'', ''B'']);';
    RAISE NOTICE '  - SELECT get_correct_answers(question_id);';
END $$;
