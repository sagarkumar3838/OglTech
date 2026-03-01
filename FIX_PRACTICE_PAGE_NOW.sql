-- Quick Fix for Practice Page - Questions Not Showing
-- Run this in Supabase SQL Editor

-- Step 1: Check if questions table exists and has data
DO $$
DECLARE
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO question_count FROM questions;
  RAISE NOTICE 'Total questions in database: %', question_count;
  
  IF question_count = 0 THEN
    RAISE NOTICE '❌ NO QUESTIONS FOUND - You need to upload questions first!';
  ELSE
    RAISE NOTICE '✅ Questions exist in database';
  END IF;
END $$;

-- Step 2: Check JavaScript easy MCQ questions (default on Practice page)
SELECT 
  'JavaScript Easy MCQ Questions' as check_type,
  COUNT(*) as count
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq';

-- Step 3: Fix RLS policies - Allow public read access to questions
-- This is the most common issue

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to questions" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Public questions are viewable by everyone" ON questions;

-- Create new permissive policy for SELECT
CREATE POLICY "Allow public read access to questions"
ON questions FOR SELECT
TO public
USING (true);

-- Ensure RLS is enabled
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify the fix
SELECT 
  'Verification' as step,
  'RLS Enabled: ' || rowsecurity as rls_status
FROM pg_tables
WHERE tablename = 'questions';

-- Step 5: Show sample questions that should now be accessible
SELECT 
  id,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  LEFT(CAST(options AS TEXT), 100) as options_preview
FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 3;

-- Step 6: Check all available skills and levels
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
WHERE type = 'mcq'
GROUP BY skill, level
ORDER BY skill, level;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policy created successfully!';
  RAISE NOTICE '✅ Questions should now be accessible on Practice page';
  RAISE NOTICE 'Next: Refresh the Practice page and check if questions appear';
END $$;
