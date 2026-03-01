-- Prevent Future Duplicate Questions
-- Add a unique constraint to ensure no duplicate questions can be inserted

-- Step 1: Check if constraint already exists
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'practice_questions'
  AND constraint_type = 'UNIQUE';

-- Step 2: Add unique constraint (run AFTER cleaning duplicates)
-- This prevents the same question from being inserted twice
ALTER TABLE practice_questions
ADD CONSTRAINT unique_question_per_skill_level 
UNIQUE (skill, level, question_text);

-- Step 3: Verify constraint was added
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'practice_questions'
  AND constraint_name = 'unique_question_per_skill_level';

-- Note: After adding this constraint, any attempt to insert a duplicate
-- question will fail with an error, preventing duplicates automatically.
