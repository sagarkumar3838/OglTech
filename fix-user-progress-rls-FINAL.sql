-- ============================================
-- Fix User Progress RLS Policies - FINAL VERSION
-- This handles both UUID and TEXT user_id types
-- ============================================

-- First, check what type user_id is
DO $$
DECLARE
    user_id_type text;
BEGIN
    SELECT data_type INTO user_id_type
    FROM information_schema.columns
    WHERE table_name = 'user_progress' 
    AND column_name = 'user_id';
    
    RAISE NOTICE 'user_id column type: %', user_id_type;
END $$;

-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Allow users to read own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to update own progress" ON user_progress;

-- ============================================
-- OPTION 1: If user_id is UUID type
-- ============================================
-- Uncomment these if user_id is UUID:
/*
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
*/

-- ============================================
-- OPTION 2: If user_id is TEXT type (DEFAULT)
-- ============================================
-- Use these if user_id is TEXT (most common):
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Add missing column (ignore error if it already exists)
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify policies were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_progress'
ORDER BY policyname;

-- Show sample of what the policies will match
SELECT 
    'Current auth.uid()' as description,
    auth.uid() as value,
    pg_typeof(auth.uid()) as type
UNION ALL
SELECT 
    'Sample user_id from table',
    user_id::text,
    pg_typeof(user_id)
FROM user_progress
LIMIT 1;
