# 🚀 Quick Fix - One Step

## The Only Thing You Need to Do

Go to your **Supabase Dashboard** → **SQL Editor** and run this:

```sql
-- Fix UUID Error - Run this in Supabase SQL Editor
ALTER TABLE user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE evaluations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE submissions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scorecards ALTER COLUMN user_id TYPE TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON scorecards(user_id);

-- Done!
SELECT '✅ Fix applied successfully! Restart your app.' AS status;
```

## That's It!

After running the SQL above:

1. Restart your server: `cd server && npm run dev`
2. Restart your client: `cd client && npm run dev`
3. Go to http://localhost:3000/ai-assistant

Everything should work now! 🎉

---

## What This Fixes

- ✅ Dashboard UUID error
- ✅ AI Assistant route
- ✅ All database queries
- ✅ User progress tracking

## Need More Help?

See `QUICK_FIX_GUIDE.md` for detailed troubleshooting.
