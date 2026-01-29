-- ============================================
-- Add career_id column to scorecards table
-- ============================================
-- This will help track which career each test belongs to
-- ============================================

-- Add career_id column to scorecards table
ALTER TABLE scorecards 
ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES careers(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scorecards_career_id ON scorecards(career_id);

-- Add comment
COMMENT ON COLUMN scorecards.career_id IS 'The career this test was taken for';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'scorecards' AND column_name = 'career_id';

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ career_id column added to scorecards table!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ New tests will now track which career they belong to';
  RAISE NOTICE '✅ Old tests without career_id will use skill matching';
  RAISE NOTICE '✅ ============================================';
END $$;
