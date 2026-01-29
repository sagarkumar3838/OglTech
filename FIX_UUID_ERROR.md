# Fix UUID Error - Firebase UID to TEXT Migration

## Problem
The error `invalid input syntax for type uuid: "ZEtVWWro6TZn969BcJeYgWNu9jO2"` occurs because:
- Firebase UIDs are strings (like "ZEtVWWro6TZn969BcJeYgWNu9jO2")
- Supabase tables were configured to expect UUID format
- These are incompatible types

## Solution
Run the migration script to convert `user_id` columns from UUID to TEXT.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `fix-user-id-type.sql`
5. Click "Run" or press Ctrl+Enter
6. Verify success message appears

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push --file fix-user-id-type.sql
```

### Option 3: Manual SQL Execution

Connect to your Supabase database and run:

```sql
-- Fix user_id type from UUID to TEXT
ALTER TABLE user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE evaluations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE submissions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scorecards ALTER COLUMN user_id TYPE TEXT;

-- If you have evaluation_sessions table
ALTER TABLE evaluation_sessions ALTER COLUMN user_id TYPE TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON scorecards(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_sessions_user_id ON evaluation_sessions(user_id);
```

## Verification

After running the migration, verify it worked:

```sql
-- Check column types
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE column_name = 'user_id' 
  AND table_schema = 'public';
```

Expected result: All `user_id` columns should show `data_type = 'text'`

## Test the Fix

1. Restart your development server
2. Navigate to http://localhost:3000/dashboard
3. The UUID error should be gone
4. Dashboard should load successfully

## What Changed

### Before (UUID):
```sql
user_id UUID NOT NULL
```

### After (TEXT):
```sql
user_id TEXT NOT NULL  -- Firebase UID (string, not UUID)
```

## Impact

- ✅ No data loss
- ✅ Existing queries continue to work
- ✅ Firebase UIDs now work correctly
- ✅ Better performance with proper indexes
- ✅ Future-proof for other auth providers

## Rollback (if needed)

If you need to rollback (not recommended):

```sql
-- WARNING: This will fail if you have Firebase UIDs stored
ALTER TABLE user_progress ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE evaluations ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE submissions ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE scorecards ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
```

## Additional Notes

- This fix is necessary because Firebase Authentication uses string UIDs
- UUID is a specific format (e.g., "550e8400-e29b-41d4-a716-446655440000")
- Firebase UIDs are base62 encoded strings (e.g., "ZEtVWWro6TZn969BcJeYgWNu9jO2")
- TEXT type is more flexible and works with any string-based user ID system

## Files Updated

- ✅ `fix-user-id-type.sql` - Migration script
- ✅ `supabase-schema.sql` - Updated schema
- ✅ `add-session-table.sql` - Updated session table
- ✅ All user_id columns now use TEXT type

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify your Firebase UID format
3. Ensure all tables are migrated
4. Check for any foreign key constraints
