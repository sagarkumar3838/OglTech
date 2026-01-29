-- Fix user_id type from UUID to TEXT to support Firebase UIDs
-- Firebase UIDs are strings like "ZEtVWWro6TZn969BcJeYgWNu9jO2", not UUIDs

-- 1. Drop existing foreign key constraints if any
-- (none in current schema)

-- 2. Alter user_progress table
ALTER TABLE user_progress 
ALTER COLUMN user_id TYPE TEXT;

-- 3. Alter evaluation_sessions table
ALTER TABLE evaluation_sessions 
ALTER COLUMN user_id TYPE TEXT;

-- 4. Alter evaluation_submissions table
ALTER TABLE evaluation_submissions 
ALTER COLUMN user_id TYPE TEXT;

-- 5. Alter scorecards table
ALTER TABLE scorecards 
ALTER COLUMN user_id TYPE TEXT;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_sessions_user_id ON evaluation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_submissions_user_id ON evaluation_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON scorecards(user_id);

-- Success message
SELECT 'User ID columns successfully converted from UUID to TEXT' AS status;
