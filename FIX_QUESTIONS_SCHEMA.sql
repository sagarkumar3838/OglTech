-- Fix Questions Table Schema for Practice Page
-- The table has question_text but Practice page expects question
-- The table has separate option_a, option_b, etc. but Practice expects options as JSON

-- Step 1: Add missing columns if they don't exist
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question TEXT,
ADD COLUMN IF NOT EXISTS options JSONB,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'mcq';

-- Step 2: Copy question_text to question if question is null
UPDATE questions
SET question = question_text
WHERE question IS NULL AND question_text IS NOT NULL;

-- Step 3: Build options JSON from option_a, option_b, option_c, option_d
-- This creates an array format: ["option A", "option B", "option C", "option D"]
UPDATE questions
SET options = jsonb_build_array(
  COALESCE(option_a, ''),
  COALESCE(option_b, ''),
  COALESCE(option_c, ''),
  COALESCE(option_d, '')
)
WHERE options IS NULL 
  AND (option_a IS NOT NULL OR option_b IS NOT NULL OR option_c IS NOT NULL OR option_d IS NOT NULL);

-- Step 4: Ensure type is set to 'mcq'
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL;

-- Step 5: Map level values to easy/medium/hard if needed
-- Check current level values first
SELECT DISTINCT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;

-- If levels are "Basic", "Intermediate", "Advanced", map them:
UPDATE questions
SET level = CASE 
  WHEN level = 'Basic' THEN 'easy'
  WHEN level = 'Intermediate' THEN 'medium'
  WHEN level = 'Advanced' THEN 'hard'
  WHEN level = 'beginner' THEN 'easy'
  WHEN level = 'intermediate' THEN 'medium'
  WHEN level = 'advanced' THEN 'hard'
  ELSE level
END
WHERE level IN ('Basic', 'Intermediate', 'Advanced', 'beginner', 'intermediate', 'advanced');

-- Step 6: Verify the fix
SELECT 
  'Schema Fix Complete!' as status,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN question IS NOT NULL THEN 1 END) as has_question,
  COUNT(CASE WHEN options IS NOT NULL THEN 1 END) as has_options,
  COUNT(CASE WHEN type = 'mcq' THEN 1 END) as mcq_type
FROM questions;

-- Step 7: Check JavaScript easy questions (what Practice page loads)
SELECT 
  id,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  LEFT(options::text, 100) as options_preview,
  correct_answer
FROM questions
WHERE skill = 'javascript' 
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 5;

-- Step 8: Show level distribution after fix
SELECT 
  level,
  COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY level;
