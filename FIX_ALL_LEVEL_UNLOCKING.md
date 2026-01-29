# Fix Level Unlocking for ALL Skills

## Problem
Level unlocking is not working for HTML, CSS, JavaScript, jQuery, and OGL Knowledge. When you pass Easy level with 70%+, Medium level should unlock automatically.

## Root Cause
Your existing scorecards have:
- **Wrong skill names**: "html" instead of "HTML", "css" instead of "CSS"
- **Wrong level names**: "Easy" instead of "easy", "Medium" instead of "medium"

This mismatch prevents the level unlocking logic from working.

## Solution - 3 Simple Steps

### Step 1: Run SQL Fix in Supabase
1. Open Supabase SQL Editor
2. Copy and paste the entire contents of: `fix-scorecard-skill-names.sql`
3. Click "Run"
4. You should see:
   - ✅ Skill names and levels have been normalized!
   - A table showing all your skills with proper names
   - Unlock status for each skill/level

### Step 2: Refresh the Career Page
1. Go to: `http://localhost:3001/careers/ogl-content-developer`
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Open browser console (F12) to see debug logs

### Step 3: Verify It Works
Check the console logs - you should see:
```
📊 Building progress from scorecards: X scorecards found
Processing scorecard: skill="HTML", level="easy", score=98, passed=true
🔓 Unlocking medium for HTML (scored 98% on easy)
Processing scorecard: skill="CSS", level="easy", score=85, passed=true
🔓 Unlocking medium for CSS (scored 85% on easy)
✅ Final progress: {...}
```

## How Level Unlocking Works

### Automatic Unlocking Rules
- **Easy level**: ALWAYS unlocked for ALL skills
- **Medium level**: Unlocks when you score 70%+ on Easy
- **Hard level**: Unlocks when you score 70%+ on Medium

### Example Flow
1. You take HTML Easy test → Score 75%
2. System detects: score >= 70%
3. System unlocks: HTML Medium level
4. You can now take HTML Medium test

### Applies to ALL Skills
- ✅ HTML: Easy → Medium → Hard
- ✅ CSS: Easy → Medium → Hard
- ✅ JavaScript: Easy → Medium → Hard
- ✅ jQuery: Easy → Medium → Hard
- ✅ OGL Knowledge: Easy → Medium → Hard

## What the SQL Fix Does

### 1. Normalizes Skill Names
Converts all variations to proper case:
- "html" → "HTML"
- "css" → "CSS"
- "javascript" → "JavaScript"
- "jquery" → "jQuery"
- "oglknowledge" → "OGL Knowledge"

### 2. Normalizes Level Names
Converts all to lowercase:
- "Easy" → "easy"
- "Medium" → "medium"
- "Hard" → "hard"

### 3. Shows Unlock Status
Displays which levels should unlock based on your scores:
- ✅ Next level should unlock (score >= 70%)
- ❌ Need 70%+ to unlock next level (score < 70%)

## Future Tests
All new tests will automatically:
- Save skill names in proper case (HTML, CSS, etc.)
- Save level names in lowercase (easy, medium, hard)
- Unlock next level when you score 70%+

## Troubleshooting

### Still Not Unlocking?
1. **Check console logs** - They show exactly what's happening
2. **Verify skill names match**:
   ```sql
   SELECT DISTINCT skill FROM scorecards ORDER BY skill;
   ```
   Should show: CSS, HTML, JavaScript, jQuery, OGL Knowledge

3. **Check your scores**:
   ```sql
   SELECT skill, level_attempted, MAX(overall_score) as best_score
   FROM scorecards
   GROUP BY skill, level_attempted;
   ```
   Any score >= 70% should unlock the next level

### Clear Browser Cache
If levels still appear locked after SQL fix:
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Expected Results

After running the SQL fix and refreshing:

### HTML
- Easy: ✅ Unlocked (always)
- Medium: ✅ Unlocked (you scored 98% on Easy)
- Hard: 🔒 Locked (need to pass Medium first)

### CSS
- Easy: ✅ Unlocked (always)
- Medium: ✅ Unlocked (if you scored 70%+ on Easy)
- Hard: 🔒 Locked (need to pass Medium first)

### JavaScript, jQuery, OGL Knowledge
- Same pattern applies to all skills
- Pass Easy with 70%+ → Medium unlocks
- Pass Medium with 70%+ → Hard unlocks

## Console Debug Logs

The system now logs everything:
- 📊 How many scorecards were found
- Processing each scorecard with skill, level, score
- 🔓 When a level is unlocked
- 🔑 When checking if a level is unlocked
- ✅ Final progress data

Use these logs to debug any issues!
