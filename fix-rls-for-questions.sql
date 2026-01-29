-- ============================================
-- FIX RLS POLICY FOR QUESTIONS TABLE
-- Allow anonymous users to read questions
-- ============================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view questions" ON questions;
DROP POLICY IF EXISTS "System can insert questions" ON questions;

-- Create new policies that allow public read access
CREATE POLICY "Anyone can view questions" 
ON questions FOR SELECT 
USING (true);

CREATE POLICY "Service role can insert questions" 
ON questions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update questions" 
ON questions FOR UPDATE 
USING (true);

CREATE POLICY "Service role can delete questions" 
ON questions FOR DELETE 
USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'questions';
