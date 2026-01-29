# ✅ Onboarding SQL Fixed!

## Problem
The original SQL had a type mismatch error:
```
ERROR: operator does not exist: uuid = text
```

## Root Cause
- Your existing tables use `TEXT` for `user_id` (Firebase UID compatibility)
- The onboarding SQL was using `UUID` (Supabase auth.users.id)
- PostgreSQL couldn't compare UUID with TEXT

## Solution
Created **`create-onboarding-flow-system-FIXED.sql`** with:

### Changes Made:
1. ✅ Changed `user_id UUID` → `user_id TEXT` in both tables
2. ✅ Fixed RLS policies to cast: `auth.uid()::text = user_id`
3. ✅ Fixed trigger function to cast: `NEW.id::text`
4. ✅ Fixed view to join properly: `u.id::text = up.user_id`
5. ✅ Removed foreign key constraints (can't reference auth.users with TEXT)

### Tables Created:
- `user_onboarding_status` - Tracks onboarding progress
- `user_test_performance` - Detailed test scores per level
- `user_dashboard_stats` (view) - Real-time statistics

### Columns Added to user_profiles:
- `full_name`
- `phone`
- `location`
- `education_level`
- `years_of_experience`
- `job_title` (not current_role - that's reserved)
- `linkedin_url`
- `github_url`
- `portfolio_url`
- `bio`
- `profile_picture_url`
- `is_profile_complete`

## How to Use

### 1. Run the Fixed SQL
```bash
# Open Supabase Dashboard
# Go to SQL Editor
# Copy entire contents of: create-onboarding-flow-system-FIXED.sql
# Paste and click "Run"
```

### 2. Verify Success
You should see:
```
✅ Onboarding System Tables Created Successfully
✅ User Profiles Enhanced
✅ Onboarding flow system setup complete!
```

### 3. Check Tables
```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_onboarding_status', 'user_test_performance');

-- Check view
SELECT * FROM user_dashboard_stats LIMIT 1;

-- Check new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('full_name', 'job_title', 'is_profile_complete');
```

## What's Next?

After running the SQL successfully:

1. **Update Dashboard.tsx** - Add onboarding check and test performance display
2. **Create ProfileComplete.tsx** - Profile completion form
3. **Update Evaluation.tsx** - Record test performance
4. **Update App.tsx** - Add profile completion route

See **ONBOARDING_IMPLEMENTATION_STEPS.md** for detailed implementation guide.

## Type Compatibility Reference

Your database uses this pattern:
- `auth.users.id` = UUID (Supabase auth)
- `user_profiles.user_id` = TEXT (Firebase UID)
- `user_career_selections.user_id` = TEXT
- `user_test_results.user_id` = TEXT
- `user_skill_progress.user_id` = TEXT

**Always cast when joining:** `auth.uid()::text` or `u.id::text`

---

**Status:** ✅ READY TO RUN
**File:** `create-onboarding-flow-system-FIXED.sql`
