-- ============================================
-- STEP 2: Create New RLS Policies
-- Run this AFTER step 1
-- ============================================

-- Create SELECT policy
CREATE POLICY "Users can view their own progress"
ON user_progress 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

-- Create INSERT policy
CREATE POLICY "Users can insert their own progress"
ON user_progress 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- Create UPDATE policy
CREATE POLICY "Users can update their own progress"
ON user_progress 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
