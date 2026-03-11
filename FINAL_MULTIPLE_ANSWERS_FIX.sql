-- ============================================
-- FINAL MULTIPLE ANSWERS FIX (NO ERRORS!)
-- ============================================
-- This version works with your actual table structure

-- Step 1: Add correct_answers column if it doesn't exist
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
UPDATE practice_questions 
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL AND correct_answer IS NOT NULL;

-- Step 3: Add question_type column if it doesn't exist
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

-- Step 4: Fix any invalid question_type values BEFORE adding constraint
UPDATE practice_questions
SET question_type = 'single'
WHERE question_type NOT IN ('single', 'multiple')
   OR question_type IS NULL;

-- Step 5: Drop ALL existing constraints on question_type
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'practice_questions'::regclass 
        AND conname LIKE '%question_type%'
    LOOP
        EXECUTE 'ALTER TABLE practice_questions DROP CONSTRAINT IF EXISTS ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Step 6: Add the correct constraint
ALTER TABLE practice_questions
ADD CONSTRAINT check_question_type 
CHECK (question_type IN ('single', 'multiple'));

-- Step 7: Update question_type based on correct_answers array length
UPDATE practice_questions
SET question_type = CASE 
  WHEN correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 1 THEN 'multiple'
  ELSE 'single'
END;

-- Step 8: Add check constraint for correct answers
ALTER TABLE practice_questions
DROP CONSTRAINT IF EXISTS check_has_correct_answer;

ALTER TABLE practice_questions
ADD CONSTRAINT check_has_correct_answer 
CHECK (
  (correct_answer IS NOT NULL AND correct_answer != '') 
  OR 
  (correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 0)
);

-- Step 9: Create indexes
CREATE INDEX IF NOT EXISTS idx_practice_questions_question_type 
ON practice_questions(question_type);

CREATE INDEX IF NOT EXISTS idx_practice_questions_correct_answers 
ON practice_questions USING GIN(correct_answers);

-- Step 10: Create validation function
CREATE OR REPLACE FUNCTION is_answer_correct(
  question_id UUID,
  user_answers TEXT[]
) RETURNS BOOLEAN AS $$
DECLARE
  question_record RECORD;
  correct BOOLEAN;
BEGIN
  SELECT correct_answer, correct_answers, question_type 
  INTO question_record
  FROM practice_questions 
  WHERE id = question_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  IF question_record.question_type = 'single' THEN
    correct := (
      array_length(user_answers, 1) = 1 
      AND user_answers[1] = question_record.correct_answer
    );
  ELSE
    correct := (
      question_record.correct_answers @> user_answers 
      AND user_answers @> question_record.correct_answers
    );
  END IF;
  
  RETURN correct;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create get correct answers function
CREATE OR REPLACE FUNCTION get_correct_answers(question_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  question_record RECORD;
BEGIN
  SELECT correct_answer, correct_answers, question_type 
  INTO question_record
  FROM practice_questions 
  WHERE id = question_id;
  
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

-- Step 12: Update stats view (WITHOUT 'type' column)
DROP VIEW IF EXISTS practice_questions_stats;
CREATE OR REPLACE VIEW practice_questions_stats AS
SELECT 
    skill,
    level,
    question_type,
    COUNT(*) as total_questions,
    COUNT(DISTINCT topic) as total_topics,
    COUNT(*) FILTER (WHERE question_type = 'single') as single_answer_questions,
    COUNT(*) FILTER (WHERE question_type = 'multiple') as multiple_answer_questions
FROM practice_questions
WHERE is_active = TRUE
GROUP BY skill, level, question_type
ORDER BY skill, level;

-- Step 13: Grant permissions
GRANT EXECUTE ON FUNCTION is_answer_correct(UUID, TEXT[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_correct_answers(UUID) TO anon, authenticated;

-- Final verification and success message
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
    RAISE NOTICE '✅ MULTIPLE ANSWERS SUPPORT COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Final Status:';
    RAISE NOTICE '  - Total questions: %', total_questions;
    RAISE NOTICE '  - Single answer: %', single_count;
    RAISE NOTICE '  - Multiple answer: %', multiple_count;
    RAISE NOTICE '  - Migrated to array: %', migrated_count;
    RAISE NOTICE '';
    RAISE NOTICE '📝 CSV Format:';
    RAISE NOTICE '  - Single: correct_answer = "A"';
    RAISE NOTICE '  - Multiple: correct_answer = "A,B,D"';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next Steps:';
    RAISE NOTICE '  1. Upload: npm run upload:multiple-answers';
    RAISE NOTICE '  2. Test: Run test-multiple-answers.sql';
    RAISE NOTICE '';
    RAISE NOTICE '✨ Ready to use!';
    RAISE NOTICE '';
END $$;
