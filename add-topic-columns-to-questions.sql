-- ============================================
-- Add Topic and Explanation Columns to Questions Table
-- ============================================
-- This adds the necessary columns for topic-based learning
-- ============================================

-- Add topic column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS topic TEXT;

-- Add explanation column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Create index on topic for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Columns Added to Questions Table!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Added: topic (TEXT)';
  RAISE NOTICE '✅ Added: explanation (TEXT)';
  RAISE NOTICE '✅ Added: index on topic column';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Steps:';
  RAISE NOTICE '1. Run RUN_SEED_TOPICS_ONLY.sql to add topic links';
  RAISE NOTICE '2. Update existing questions with topics';
  RAISE NOTICE '3. Upload new questions with topic field';
  RAISE NOTICE '✅ ============================================';
END $$;
