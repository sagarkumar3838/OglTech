# Fixed: user_id=undefined Error

## Problem
The application was making API requests with `user_id=eq.undefined`, causing 400 errors when trying to fetch user progress data.

## Root Cause
The code was using `user.uid` (Firebase Auth property) instead of `user.id` (Supabase Auth property). Since the app migrated to Supabase Auth, the correct property is `user.id`.

## Files Fixed
1. **client/src/pages/CareerDetail.tsx** - Line 82
   - Changed: `user.uid` → `user.id`
   
2. **client/src/pages/OGLProgress.tsx** - Line 37
   - Changed: `user.uid` → `user.id`
   
3. **client/src/pages/Analytics.tsx** - Lines 49, 238, 266
   - Changed: `user.uid` → `user.id` (3 occurrences)
   
4. **client/src/pages/AIAssistant.tsx** - Line 60
   - Changed: `user.uid` → `user.id`

## Testing
After these changes, the user_progress API calls should work correctly:
- ✅ User progress will load on career detail pages
- ✅ OGL progress page will display correctly
- ✅ Analytics leaderboard will show user's rank
- ✅ AI Assistant will track user conversations

## Next Steps
1. Restart the development server if running
2. Clear browser cache/localStorage if needed
3. Log in again to test the fixes
4. Navigate to a career page and click "AI Generated" or "From Database" button
5. Verify no more 400 errors in the console
