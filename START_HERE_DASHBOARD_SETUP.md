# 🚀 Dashboard Setup - Start Here!

## Quick Overview
This guide will help you set up the new dashboard that shows:
- ✅ Your chosen career and qualification status
- 📊 Required skills with your current progress
- ⚠️ Weak areas where you need improvement
- 📝 Complete test history with pass/fail status
- 🎯 No dummy data - everything is real!

---

## 📋 Prerequisites
- ✅ Supabase project set up
- ✅ Application running on localhost:3000
- ✅ User account created and logged in

---

## 🎯 Setup Steps

### Step 1: Create Database Tables (Required)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the setup script**
   - Open file: `create-career-skill-requirements.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter

3. **Verify success**
   - You should see: "Career skill requirements table created and seeded successfully!"
   - Check that the table exists: Go to "Table Editor" → Look for `career_skill_requirements`

---

### Step 2: Select a Career (Required)

**Option A: Through the UI (Recommended)**
1. Go to http://localhost:3000/careers
2. Click on any career card (e.g., "OGL Content Developer")
3. Career will be automatically selected
4. Go to http://localhost:3000/dashboard

**Option B: Manually in Database**
```sql
-- Run in Supabase SQL Editor
-- Replace YOUR_USER_ID with your actual user ID

INSERT INTO user_career_selections (user_id, career_id, career_name, is_active, priority)
SELECT 
  'YOUR_USER_ID',
  id,
  name,
  true,
  1
FROM careers 
WHERE name = 'OGL Content Developer';
```

---

### Step 3: Add Sample Data (Optional - For Demo)

This step is **optional** but recommended to see all dashboard features immediately.

#### 3.1 Get Your User ID

**Method 1: Using the Helper Tool**
1. Open `get-user-id.html` in your browser
2. Click "Get My User ID"
3. Copy the ID shown

**Method 2: Browser Console**
1. Go to http://localhost:3000
2. Press F12 to open console
3. Type: `localStorage.getItem('user')`
4. Copy the `id` value

**Method 3: From Supabase**
```sql
SELECT DISTINCT user_id FROM user_progress LIMIT 1;
```

#### 3.2 Run Sample Data Script

1. Open file: `seed-sample-dashboard-data.sql`
2. Find and replace ALL instances of `'YOUR_USER_ID'` with your actual user ID
   - Use Find & Replace (Ctrl+H)
   - Find: `'YOUR_USER_ID'`
   - Replace with: `'your-actual-user-id-here'`
3. Copy the entire file
4. Paste into Supabase SQL Editor
5. Click "Run"

#### 3.3 What Sample Data Creates

The sample data simulates a realistic user journey:

**Career Selected:** OGL Content Developer

**Skills Progress:**
- ✅ HTML Basic: 85% (Passed)
- ✅ HTML Intermediate: 75% (Passed on 2nd attempt)
- ✅ CSS Basic: 80% (Passed)
- ❌ CSS Intermediate: 65% (Failed twice - Weak Area!)
- ✅ JavaScript Basic: 90% (Passed)
- ⏰ jQuery: Not started
- ⏰ OGL Knowledge: Not started

**Test History:** 7 tests total
- 5 Passed ✅
- 2 Failed ❌

**Qualification Status:** 40% (2/5 skills completed)

---

## 🎨 What You'll See on Dashboard

### 1. Career Header
```
OGL Content Developer
Full-stack developer role covering frontend and backend development

[Qualification Status]
Complete 3 more skills to qualify
Progress: ████████░░░░░░░░░░ 40% (2/5 Skills)
```

### 2. Skills Progress Section
Each skill shows:
- Skill name with status icon (✓ or ⏰ or ⚠️)
- Expected level vs Your level
- Number of attempts (including failed ones)
- Detailed scores for Basic/Intermediate/Advanced
- Recent test attempts with dates and scores
- "Start Test" or "Retry" button

### 3. Weak Areas Section (if any failures)
```
⚠️ Areas Needing Improvement

CSS - Intermediate
Best Score: 65% | 2 attempts
Last attempted: [date]
[Practice Now] button
```

### 4. Recent Test History
```
📊 Recent Test History

✅ JavaScript - Basic: 90% (18/20 correct) - [date]
❌ CSS - Intermediate: 65% (13/20 correct) - [date]
❌ CSS - Intermediate: 60% (12/20 correct) - [date]
✅ CSS - Basic: 80% (16/20 correct) - [date]
...
```

---

## 🧪 Testing the Dashboard

### Without Sample Data (Clean Start)
1. Dashboard shows "No Career Selected"
2. Click "Choose Career Path"
3. Select a career
4. Dashboard shows requirements but no progress
5. Take tests to populate data

### With Sample Data
1. Dashboard immediately shows progress
2. See completed and failed tests
3. Weak areas highlighted
4. Complete test history visible
5. Can retry failed tests

---

## 🔧 Troubleshooting

### Issue: "No Career Selected"
**Cause:** User hasn't selected a career yet
**Solution:** 
- Click "Choose Career Path" button
- Or go to /careers and select a career

### Issue: Dashboard shows career but no progress
**Cause:** User hasn't taken any tests yet
**Solution:** 
- This is normal for new users
- Click "Start Test" on any skill
- Or run the sample data script

### Issue: Sample data script fails
**Cause:** User ID not replaced or incorrect
**Solution:**
- Make sure you replaced ALL instances of 'YOUR_USER_ID'
- Verify your user ID is correct
- Check that you're logged in

### Issue: Can't find user ID
**Solution:**
- Open `get-user-id.html` in browser
- Or check browser console: `localStorage.getItem('user')`
- Or query Supabase: `SELECT DISTINCT user_id FROM user_progress`

### Issue: Tables don't exist
**Cause:** Setup script not run
**Solution:**
- Run `create-career-skill-requirements.sql` in Supabase
- Verify tables exist in Table Editor

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `create-career-skill-requirements.sql` | Main setup - Creates tables and seeds requirements |
| `seed-sample-dashboard-data.sql` | Optional - Creates sample test data for demo |
| `get-user-id.html` | Helper tool to find your user ID |
| `SETUP_DASHBOARD_DEMO.md` | Detailed setup instructions |
| `DASHBOARD_FEATURES_COMPLETE.md` | Complete feature documentation |
| `QUICK_DASHBOARD_SETUP.bat` | Windows batch script for guided setup |

---

## ✅ Success Checklist

- [ ] Ran `create-career-skill-requirements.sql` in Supabase
- [ ] Verified `career_skill_requirements` table exists
- [ ] Selected a career (through UI or database)
- [ ] Dashboard shows career name and requirements
- [ ] (Optional) Ran sample data script
- [ ] (Optional) Dashboard shows test history and weak areas

---

## 🎯 Next Steps

After setup:
1. ✅ Take tests to populate your real data
2. ✅ Dashboard automatically updates with your progress
3. ✅ Weak areas are highlighted automatically
4. ✅ Track your journey to qualification
5. ✅ No dummy data - everything reflects your actual performance!

---

## 💡 Tips

- **Start with sample data** to see all features immediately
- **Take real tests** to replace sample data with your actual progress
- **Check weak areas** regularly to focus your learning
- **Track improvement** by comparing test attempts over time
- **Aim for 70%+** on all required skill levels to qualify

---

## 🆘 Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Verify all prerequisites are met
3. Check browser console for errors (F12)
4. Verify Supabase tables exist
5. Ensure user is logged in

---

## 🎉 You're All Set!

Once setup is complete, your dashboard will show:
- Real career requirements
- Your actual test scores
- Areas where you need improvement
- Complete test history
- Progress toward qualification

**No dummy data - everything is real and personalized to you!**
