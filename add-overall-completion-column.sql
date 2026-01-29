-- ============================================
-- Add overall_completion column to user_progress
-- ============================================

-- Add overall_completion column if it doesn't exist
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN user_progress.overall_completion IS 'Overall completion percentage (0-100)';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND column_name = 'overall_completion';
