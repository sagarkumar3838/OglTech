-- COMPLETE FIX for Practice Page showing no questions
-- This handles multiple possible issues

-- ============================================
-- STEP 1: Disable RLS temporarily to check if that's the issue
-- ============================================
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Check if questions table is empty
-- ============================================
DO $$
DECLARE
  questions_count INTEGER;
  practice_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO questions_count FROM questions;
  SELECT COUNT(*) INTO practice_count FROM practice_questions;
  
  RAISE NOTICE 'Questions table has % rows', questions_count;
  RAISE NOTICE 'Practice_questions table has % rows', practice_count;
  
  -- If questions is empty but practice_questions has data, copy it
  IF questions_count = 0 AND practice_count > 0 THEN
    RAISE NOTICE 'Copying from practice_questions to questions...';
    
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
      youtube_telugu
    )
    SELECT 
      skill,
      level,
      'mcq' as type,
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
      youtube_telugu
    FROM practice_questions
    WHERE type = 'mcq' OR type IS NULL
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Copy completed!';
  END IF;
END $$;

-- ============================================
-- STEP 3: Ensure type column is set to 'mcq' for all questions
-- ============================================
UPDATE questions
SET type = 'mcq'
WHERE type IS NULL OR type = '';

-- ============================================
-- STEP 4: Fix level names (convert beginner/intermediate/advanced to easy/medium/hard)
-- ============================================
UPDATE questions
SET level = CASE 
  WHEN level = 'beginner' THEN 'easy'
  WHEN level = 'intermediate' THEN 'medium'
  WHEN level = 'advanced' THEN 'hard'
  ELSE level
END
WHERE level IN ('beginner', 'intermediate', 'advanced');

-- ============================================
-- STEP 5: Enable RLS with proper policies
-- ============================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to questions" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Public questions are viewable by everyone" ON questions;

-- Create a simple policy that allows everyone to read questions
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
-- STEP 7: Verify the fix
-- ============================================
SELECT 
  'Verification Results' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT level) as total_levels
FROM questions;

-- Show sample data
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level
LIMIT 20;

-- Test the exact query that Practice page uses
SELECT 
  'Test Query: JavaScript + Easy' as test_name,
  COUNT(*) as questions_found
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq';

SELECT 
  'Test Query: Java + Hard' as test_name,
  COUNT(*) as questions_found
FROM questions
WHERE skill = 'java'
  AND level = 'hard'
  AND type = 'mcq';
