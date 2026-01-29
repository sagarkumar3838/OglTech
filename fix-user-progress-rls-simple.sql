-- ============================================
-- Fix User Progress RLS Policies (Simple Version)
-- ============================================

-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;

-- Create new policies for authenticated users
CREATE POLICY "Users can view their own progress"
ON user_progress
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Add missing column (ignore error if it already exists)
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;

-- Verify policies were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies
WHERE tablename = 'user_progress'
ORDER BY policyname;
