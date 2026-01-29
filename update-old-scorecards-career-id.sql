-- ============================================
-- Update Old Scorecards with career_id
-- ============================================
-- This will link your existing test results to the correct career
-- ============================================

-- First, let's see what we have
SELECT 
  id,
  skill,
  level_attempted,
  overall_score,
  career_id,
  created_at
FROM scorecards
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- ============================================
-- Update scorecards for OGL Content Developer
-- ============================================
-- Skills: HTML, CSS, JavaScript, jQuery, OGL Knowledge

UPDATE scorecards
SET career_id = (
  SELECT id FROM careers WHERE name = 'OGL Content Developer'
)
WHERE user_id = auth.uid()
  AND LOWER(skill) IN ('html', 'css', 'javascript', 'jquery', 'ogl knowledge')
  AND career_id IS NULL;

-- ============================================
-- Update scorecards for OGL Tester
-- ============================================
-- Skills: Testing Tools, JavaScript, TypeScript, HTML, CSS
-- Note: Only update if NOT already matched to OGL Content Developer

UPDATE scorecards
SET career_id = (
  SELECT id FROM careers WHERE name = 'OGL Tester'
)
WHERE user_id = auth.uid()
  AND LOWER(skill) IN ('testing tools', 'typescript')
  AND career_id IS NULL;

-- ============================================
-- Verify the updates
-- ============================================

SELECT 
  c.name as career_name,
  s.skill,
  s.level_attempted,
  s.overall_score,
  s.created_at
FROM scorecards s
LEFT JOIN careers c ON s.career_id = c.id
WHERE s.user_id = auth.uid()
ORDER BY s.created_at DESC;

-- ============================================
-- SUCCESS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Old scorecards updated with career_id!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Your tests are now linked to the correct careers';
  RAISE NOTICE '✅ Check the Learning Path to see your progress';
  RAISE NOTICE '✅ ============================================';
END $$;
