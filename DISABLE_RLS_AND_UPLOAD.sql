-- ========================================
-- DISABLE RLS TO ALLOW QUESTION UPLOADS
-- ========================================

-- Step 1: Disable RLS on practice_questions table
ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'practice_questions';

-- Step 3: Grant permissions (if needed)
GRANT ALL ON practice_questions TO anon;
GRANT ALL ON practice_questions TO authenticated;
GRANT ALL ON practice_questions TO service_role;

-- ========================================
-- NOW YOU CAN UPLOAD YOUR QUESTIONS!
-- Run: UPLOAD_VALID_QUESTIONS.bat
-- ========================================

-- After upload, you can re-enable RLS if needed:
-- ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
-- 
-- And add a policy to allow public read access:
-- CREATE POLICY "Allow public read access" 
-- ON practice_questions FOR SELECT 
-- USING (true);
