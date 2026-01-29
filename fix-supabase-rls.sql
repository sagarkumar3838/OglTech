-- ============================================
-- Fix Row Level Security for Public Access
-- ============================================

-- Drop existing policies for careers
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON careers;
DROP POLICY IF EXISTS "Authenticated users can insert careers" ON careers;
DROP POLICY IF EXISTS "Authenticated users can update careers" ON careers;

-- Create new policy that allows anyone to read careers (no auth required)
CREATE POLICY "Anyone can view careers" 
ON careers 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert careers" 
ON careers 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update careers" 
ON careers 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Verify the policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'careers';
