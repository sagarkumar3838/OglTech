-- ============================================
-- STEP 3: Grant Permissions and Add Column
-- Run this AFTER step 2
-- ============================================

-- Add missing column
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify policies
SELECT 
    policyname, 
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'user_progress'
ORDER BY policyname;
