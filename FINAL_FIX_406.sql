-- ============================================
-- FINAL FIX FOR 406 ERRORS
-- Run this in Supabase SQL Editor
-- ============================================

-- First, check what type user_id actually is
DO $$
DECLARE
    user_id_type text;
BEGIN
    SELECT data_type INTO user_id_type
    FROM information_schema.columns
    WHERE table_name = 'user_progress' 
    AND column_name = 'user_id';
    
    RAISE NOTICE 'user_id type is: %', user_id_type;
END $$;

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Public read access for media" ON media;
DROP POLICY IF EXISTS "Enable read access for all users" ON media;

-- Create policies for user_progress
-- Try both TEXT and UUID versions (one will work)

-- If user_id is TEXT:
DO $$
BEGIN
    EXECUTE 'CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT TO authenticated USING (auth.uid()::text = user_id)';
    RAISE NOTICE 'Created TEXT-based SELECT policy';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEXT SELECT policy failed, trying UUID...';
    EXECUTE 'CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id)';
    RAISE NOTICE 'Created UUID-based SELECT policy';
END $$;

DO $$
BEGIN
    EXECUTE 'CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id)';
    RAISE NOTICE 'Created TEXT-based INSERT policy';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEXT INSERT policy failed, trying UUID...';
    EXECUTE 'CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)';
    RAISE NOTICE 'Created UUID-based INSERT policy';
END $$;

DO $$
BEGIN
    EXECUTE 'CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE TO authenticated USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id)';
    RAISE NOTICE 'Created TEXT-based UPDATE policy';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEXT UPDATE policy failed, trying UUID...';
    EXECUTE 'CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
    RAISE NOTICE 'Created UUID-based UPDATE policy';
END $$;

-- Create policy for media (public read)
CREATE POLICY "Public read access for media"
ON media FOR SELECT
TO authenticated, anon
USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT SELECT ON media TO authenticated, anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add missing column
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Verify policies were created
SELECT 
    tablename, 
    policyname, 
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('user_progress', 'media')
ORDER BY tablename, policyname;
