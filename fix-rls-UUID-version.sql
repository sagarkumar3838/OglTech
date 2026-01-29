-- ============================================
-- Fix RLS for UUID user_id column
-- ============================================

-- Step 1: Enable RLS and drop old policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;

-- Step 2: Create policies for UUID comparison
CREATE POLICY "Users can view their own progress"
ON user_progress 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 3: Add column and grant permissions
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_progress';
