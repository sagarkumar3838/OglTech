-- COPY ALL QUESTIONS from practice_questions to questions table
-- This is the MAIN FIX for empty questions table

-- ============================================
-- STEP 1: Check current state
-- ============================================
DO $$
DECLARE
  questions_count INTEGER;
  practice_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO questions_count FROM questions;
  SELECT COUNT(*) INTO practice_count FROM practice_questions;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'BEFORE COPY:';
  RAISE NOTICE 'questions table: % rows', questions_count;
  RAISE NOTICE 'practice_questions table: % rows', practice_count;
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- STEP 2: Disable RLS temporarily
-- ============================================
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Clear questions table (if needed)
-- ============================================
TRUNCATE TABLE questions CASCADE;

-- ============================================
-- STEP 4: Copy ALL questions from practice_questions
-- ============================================
INSERT INTO questions (
  skill,
  level,
  type,
  question,
  options,
  correct_answer,
  explanation,
  topic,
  mdn_link,
  youtube_english,
  youtube_hindi,
  youtube_kannada,
  youtube_tamil,
  youtube_telugu,
  created_at
)
SELECT 
  skill,
  -- Convert level names if needed
  CASE 
    WHEN level = 'beginner' THEN 'easy'
    WHEN level = 'intermediate' THEN 'medium'
    WHEN level = 'advanced' THEN 'hard'
    ELSE level
  END as level,
  -- Set type to 'mcq'
  COALESCE(type, 'mcq') as type,
  question,
  options,
  correct_answer,
  explanation,
  topic,
  mdn_link,
  youtube_english,
  youtube_hindi,
  youtube_kannada,
  youtube_tamil,
  youtube_telugu,
  COALESCE(created_at, NOW()) as created_at
FROM practice_questions
WHERE question IS NOT NULL
  AND options IS NOT NULL
  AND correct_answer IS NOT NULL;

-- ============================================
-- STEP 5: Enable RLS with public read policy
-- ============================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to questions" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Public questions are viewable by everyone" ON questions;

-- Create new public read policy
CREATE POLICY "Allow public read access to questions"
ON questions
FOR SELECT
TO public
USING (true);

-- ============================================
-- STEP 6: Grant permissions
-- ============================================
GRANT SELECT ON questions TO anon;
GRANT SELECT ON questions TO authenticated;

-- ============================================
-- STEP 7: Verify the copy
-- ============================================
DO $$
DECLARE
  questions_count INTEGER;
  practice_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO questions_count FROM questions;
  SELECT COUNT(*) INTO practice_count FROM practice_questions;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'AFTER COPY:';
  RAISE NOTICE 'questions table: % rows', questions_count;
  RAISE NOTICE 'practice_questions table: % rows', practice_count;
  RAISE NOTICE '========================================';
  
  IF questions_count > 0 THEN
    RAISE NOTICE '✅ SUCCESS! Questions copied successfully!';
  ELSE
    RAISE NOTICE '❌ WARNING: questions table is still empty!';
  END IF;
END $$;

-- ============================================
-- STEP 8: Show summary by skill and level
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- STEP 9: Test queries that Practice page uses
-- ============================================
-- Test JavaScript + Easy
SELECT 
  'JavaScript + Easy' as test,
  COUNT(*) as found
FROM questions
WHERE skill = 'javascript' AND level = 'easy' AND type = 'mcq';

-- Test Java + Hard
SELECT 
  'Java + Hard' as test,
  COUNT(*) as found
FROM questions
WHERE skill = 'java' AND level = 'hard' AND type = 'mcq';

-- Test Python + Medium
SELECT 
  'Python + Medium' as test,
  COUNT(*) as found
FROM questions
WHERE skill = 'python' AND level = 'medium' AND type = 'mcq';
