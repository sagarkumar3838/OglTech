-- ============================================
-- Fix RLS for Questions Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to questions" ON questions;
DROP POLICY IF EXISTS "Allow authenticated users to read questions" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows everyone to read questions
CREATE POLICY "Enable read access for all users" 
ON questions FOR SELECT 
USING (true);

-- Verify the policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'questions';

-- Test query
SELECT COUNT(*) as total_questions FROM questions;
SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;
