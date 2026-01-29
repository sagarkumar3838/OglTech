# Dashboard Demo Setup Guide

Follow these steps to see the complete dashboard with all features.

## Step 1: Setup Database Tables

### 1.1 Open Supabase SQL Editor
- Go to your Supabase project
- Click on "SQL Editor" in the left sidebar
- Click "New query"

### 1.2 Run Career Skill Requirements Setup
Copy and paste the entire contents of `create-career-skill-requirements.sql` and click "Run"

This will:
- Create the `career_skill_requirements` table
- Seed requirements for all 8 OGL careers
- Set up proper RLS policies

## Step 2: Add Sample Test Data (Optional)

To see the dashboard with test history and weak areas, run the sample data script:

### 2.1 Create Sample Data
Copy and paste the contents of `seed-sample-dashboard-data.sql` (created below) and click "Run"

This will create:
- A career selection for your user
- Sample skill progress data
- Sample test results (including some failed attempts)

**Note:** Replace `'YOUR_USER_ID'` in the script with your actual Firebase user ID

## Step 3: View the Dashboard

### 3.1 Navigate to Dashboard
- Go to http://localhost:3000/dashboard
- You should now see:
  - ✅ Career name and description
  - 📊 Qualification status
  - 📈 Skill progress with scores
  - ⚠️ Weak areas (if any failed tests)
  - 📝 Complete test history

### 3.2 What You'll See

**Career Header:**
- Career name: "OGL Content Developer"
- Description
- Qualification status with progress bar

**Skills Progress:**
Each skill card shows:
- Expected level vs Your level
- Number of attempts
- Pass/Fail status
- Scores for Basic/Intermediate/Advanced
- Recent test attempts with dates

**Weak Areas Section:**
- Skills where you scored < 70%
- Skills with multiple failed attempts
- Best score and attempt count
- "Practice Now" button

**Test History:**
- Last 10 tests taken
- Pass/Fail with color coding
- Scores and dates
- Time taken

## Step 4: Test the Flow

### 4.1 Without Sample Data (Clean Start)
1. Click "Choose Career Path" button
2. Select a career (e.g., "OGL Content Developer")
3. Dashboard shows requirements but no progress
4. Click "Start Test" on any skill
5. Take the test
6. Return to dashboard to see your results

### 4.2 With Sample Data
1. Dashboard immediately shows progress
2. See completed and failed tests
3. Identify weak areas
4. Click "Retry" on failed tests
5. Track improvement over time

## Troubleshooting

### Issue: "No Career Selected"
**Solution:** 
- Go to /careers page
- Click on any career card
- Career will be automatically selected

### Issue: No data showing
**Solution:**
- Check if tables exist in Supabase
- Verify user is logged in
- Check browser console for errors
- Ensure RLS policies are set correctly

### Issue: Can't see test history
**Solution:**
- Take at least one test first
- Check `user_test_results` table in Supabase
- Verify user_id matches your Firebase UID

## Getting Your User ID

To find your Firebase user ID:

### Method 1: Browser Console
```javascript
// Open browser console (F12)
// Paste this:
console.log(localStorage.getItem('user'));
```

### Method 2: From Supabase
```sql
-- Run in Supabase SQL Editor
SELECT DISTINCT user_id FROM user_career_selections;
```

### Method 3: From Code
Add this temporarily to Dashboard.tsx:
```typescript
console.log('User ID:', user?.id);
```

## Next Steps

After setup:
1. ✅ Dashboard shows real career data
2. ✅ Take tests to populate history
3. ✅ See weak areas automatically
4. ✅ Track progress toward qualification
5. ✅ No dummy data - everything is real!

## Files Created

- `create-career-skill-requirements.sql` - Main setup
- `seed-sample-dashboard-data.sql` - Sample data (optional)
- `DASHBOARD_FEATURES_COMPLETE.md` - Feature documentation
- This file - Setup guide
