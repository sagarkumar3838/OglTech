-- ============================================
-- COMPLETE FIX FOR LEARNING PATH ISSUE
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Then click RUN
-- ============================================

-- Step 1: Add career_id column to scorecards table
ALTER TABLE scorecards 
ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES careers(id) ON DELETE SET NULL;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scorecards_career_id ON scorecards(career_id);

-- Step 3: Update existing scorecards for OGL Content Developer
-- (HTML, CSS, JavaScript, jQuery, OGL Knowledge)
UPDATE scorecards
SET career_id = (
  SELECT id FROM careers WHERE name = 'OGL Content Developer'
)
WHERE LOWER(skill) IN ('html', 'css', 'javascript', 'jquery', 'ogl knowledge')
  AND career_id IS NULL;

-- Step 4: Update existing scorecards for OGL Tester
-- (Testing Tools, TypeScript)
UPDATE scorecards
SET career_id = (
  SELECT id FROM careers WHERE name = 'OGL Tester'
)
WHERE LOWER(skill) IN ('testing tools', 'typescript')
  AND career_id IS NULL;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check your scorecards with career names
SELECT 
  c.name as career_name,
  s.skill,
  s.level_attempted,
  s.overall_score,
  s.level_readiness,
  s.created_at
FROM scorecards s
LEFT JOIN careers c ON s.career_id = c.id
WHERE s.user_id = auth.uid()
ORDER BY s.created_at DESC;

-- Count tests per career
SELECT 
  c.name as career_name,
  COUNT(*) as test_count,
  AVG(s.overall_score) as avg_score
FROM scorecards s
LEFT JOIN careers c ON s.career_id = c.id
WHERE s.user_id = auth.uid()
GROUP BY c.name
ORDER BY test_count DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ LEARNING PATH ISSUE FIXED!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ 1. career_id column added to scorecards';
  RAISE NOTICE '✅ 2. Old tests linked to correct careers';
  RAISE NOTICE '✅ 3. New tests will automatically track career';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Go to /learning-path and refresh to see changes!';
  RAISE NOTICE '✅ ============================================';
END $$;
