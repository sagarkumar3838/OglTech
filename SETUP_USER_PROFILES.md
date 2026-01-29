# User Profiles & Leaderboard Setup Guide

## ⚠️ IMPORTANT: SQL Fix Applied

The SQL file has been fixed to avoid PostgreSQL reserved keyword conflicts:
- Changed `current_role` to `user_role`
- All TypeScript files updated accordingly

## Step 1: Run Database Migration

Run the SQL migration to create the necessary tables:

```bash
# In Supabase SQL Editor, paste and run the entire content of:
add-user-profiles-table.sql
```

This will create:
- `user_profiles` table - Stores user profile information
- `user_course_enrollments` table - Tracks course progress
- `leaderboard` view - Real-time leaderboard rankings

## Step 2: Create Storage Bucket (Optional)

If you want to enable avatar uploads:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `user-avatars`
3. Set it to **Public**
4. Add policy to allow authenticated users to upload

## Step 3: Test the Flow

### User Journey:
1. **Sign Up** → User creates account
2. **Complete Profile** (`/profile`) → User fills out profile with:
   - Avatar upload
   - Full name, bio
   - Current role, experience level
   - Skills, interests, learning goals
   - Social links (GitHub, LinkedIn, Twitter)
3. **Dashboard** (`/dashboard`) → Shows:
   - User profile with real data
   - Course enrollments
   - Test scores and stats
   - Recent activity
4. **Choose Career** → User selects OGL Content Developer
5. **Take Test** → User completes evaluation
6. **View Results** → Score is saved to database
7. **Leaderboard** (`/analytics`) → Real-time rankings update

## Features Implemented

### ✅ Profile Page (`/profile`)
- Multi-step wizard (4 steps)
- Avatar upload with preview
- Real-time data saving to Supabase
- Form validation
- Toast notifications

### ✅ Dashboard (`/dashboard`)
- Loads real user profile data
- Shows actual course enrollments
- Displays real test scores
- Dynamic stats calculation
- Profile picture display
- Social links integration

### ✅ Analytics/Leaderboard (`/analytics`)
- Real-time leaderboard updates
- Filter by experience level (Beginner, Intermediate, Advanced, Expert)
- User rank display
- Top 3 highlighted with special styling
- Stats overview (total learners, tests, avg score)
- Motivational UI elements

### ✅ Real-time Updates
- Leaderboard updates when any user completes a test
- Profile changes reflect immediately
- Course progress syncs across sessions

## Database Schema

### user_profiles
- Stores all user profile information
- Linked to Firebase Auth UID
- Public read, user can only edit own profile

### user_course_enrollments
- Tracks which courses user is enrolled in
- Progress percentage
- Completed lessons count
- Status (not_started, in_progress, completed, locked)

### leaderboard (View)
- Aggregates data from profiles, submissions, and scorecards
- Calculates rankings based on average score and test count
- Updates automatically when new scores are added

## Next Steps

1. Run the SQL migration
2. Test profile creation
3. Take a test to generate scorecard
4. Check leaderboard updates
5. Verify real-time functionality

## Notes

- All data is user-specific (no fake/dummy data)
- Profile completion is required before accessing dashboard
- Leaderboard updates in real-time using Supabase subscriptions
- Avatar images are stored in Supabase Storage
