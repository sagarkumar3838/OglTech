-- Check your scorecard data to see skill names and scores
SELECT 
  skill,
  level_attempted,
  overall_score,
  level_readiness,
  created_at
FROM scorecards
ORDER BY created_at DESC
LIMIT 20;

-- Check unique skill names
SELECT DISTINCT skill
FROM scorecards
ORDER BY skill;
