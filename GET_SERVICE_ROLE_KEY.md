# Get Supabase Service Role Key

## Why You Need It
The service role key bypasses Row-Level Security (RLS) and is needed for admin operations like bulk uploads.

## How to Get It

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard

2. **Select your project**: `ksjgsgebjnpwyycnptom`

3. **Go to Settings** (gear icon in sidebar) → **API**

4. **Find "service_role" key** in the "Project API keys" section
   - It's labeled as `service_role` (secret)
   - Click the eye icon to reveal it
   - Copy the entire key

5. **Add to your `.env` file**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt...
   ```

## Security Warning
⚠️ **NEVER commit the service role key to git!**
- It has full admin access to your database
- Keep it in `.env` only (already in `.gitignore`)
- Don't share it publicly

## After Adding the Key

Run the upload script again:
```bash
npm run upload-csv-options client/dist/assets/ogl_developer_questions_adjusted.csv
```

It should now work!
