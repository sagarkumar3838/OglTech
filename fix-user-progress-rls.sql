-- ============================================
-- Fix User Progress RLS Policies
-- ============================================

-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;

-- Create new policies for authenticated users
-- Allow users to read their own progress
CREATE POLICY "Users can view their own progress"
ON user_progress
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Allow users to insert their own progress
CREATE POLICY "Users can insert their own progress"
ON user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own progress
CREATE POLICY "Users can update their own progress"
ON user_progress
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT USAGE ON SEQUENCE user_progress_id_seq TO authenticated;

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_progress';
