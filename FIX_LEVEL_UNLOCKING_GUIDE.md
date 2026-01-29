# Fix Level Unlocking Issue

## Problem
You scored 70% or higher on Basic HTML but Medium level is still locked.

## Root Cause
The skill names in your scorecards don't match the skill names in the career definition:
- **Scorecards have**: "html" (lowercase, normalized)
- **Career expects**: "HTML" (proper case)

This mismatch prevents the level unlocking logic from working.

## Solution

### Step 1: Fix Existing Scorecards
Run this SQL in Supabase SQL Editor:

```sql
-- Copy and paste from: fix-scorecard-skill-names.sql
```

This will:
- Update skill names to proper case (html → HTML, css → CSS, etc.)
- Normalize level names to lowercase (Easy → easy, Medium → medium)
- Fix all your existing test records

### Step 2: Refresh the Page
1. Go to: `http://localhost:3001/careers/ogl-content-developer`
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Check the browser console (F12) for debug logs showing unlocked levels

### Step 3: Verify It Works
You should see:
- ✅ Medium level unlocked (no lock icon)
- ✅ "AI Generated" and "From Database" buttons clickable
- ✅ Console logs showing: `🔓 Unlocking medium for HTML (scored 70%+ on easy)`

## How Level Unlocking Works Now

### Automatic Unlocking
- **Easy level**: Always unlocked for all skills
- **Medium level**: Unlocks when you score 70%+ on Easy
- **Hard level**: Unlocks when you score 70%+ on Medium

### Console Debugging
Open browser console (F12) to see:
```
📊 Building progress from scorecards: X scorecards found
Processing scorecard: skill="HTML", level="easy", score=70, passed=true
🔓 Unlocking medium for HTML (scored 70% on easy)
✅ Final progress: {...}
🔑 Checking HTML - medium: unlocked=true, unlocked_levels= ['easy', 'medium']
```

## Future Tests
All new tests will automatically:
- Save skill names in proper case (HTML, CSS, JavaScript, etc.)
- Save level names in lowercase (easy, medium, hard)
- Unlock next level when you score 70%+

## Troubleshooting

### Still Not Working?
1. Check your scorecard data:
   ```sql
   -- Run: check-scorecards-data.sql
   ```

2. Verify skill names match exactly:
   - Career skills: HTML, CSS, JavaScript, jQuery, OGL Knowledge
   - Your scorecards should use the same names

3. Check browser console for errors or debug logs

4. Try clearing browser cache and localStorage:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

### Need More Help?
Check the console logs - they show exactly what's happening with level unlocking.
