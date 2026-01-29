-- ============================================
-- STEP 1: Enable RLS and Drop Old Policies
-- ============================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Allow users to read own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Allow users to update own progress" ON user_progress;
