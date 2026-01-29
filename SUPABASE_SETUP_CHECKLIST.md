# Supabase Setup Checklist

## ✅ Step 1: Get the Correct Supabase Anon Key

**Current Issue:** The key you provided (`sb_publishable_orslwTcs6u2zEzXK1J3cYQ_FjB6wBPV`) is not in the correct JWT format.

**What to do:**
1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api
2. Find the **"anon public"** key (it should be a long string starting with `eyJ...`)
3. Copy the FULL key (it has 3 parts separated by dots)
4. Paste it here so I can update your files

**Expected format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MzU5NzcsImV4cCI6MjA1MzAxMTk3N30.SIGNATURE_PART_HERE
```

---

## ✅ Step 2: Fix Row Level Security (Optional)

If you're having trouble accessing careers even with the correct key, run this SQL in Supabase:

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/sql/new
2. Copy and paste the content from `fix-supabase-rls.sql`
3. Click "Run"

This will allow public access to the careers table (no authentication required).

---

## ✅ Step 3: Verify Data in Supabase

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor
2. Click on **"careers"** table
3. You should see **8 rows** with the OGL careers

If you don't see the careers:
- The SQL schema might not have been executed
- Re-run the `supabase-schema.sql` file

---

## ✅ Step 4: Test the Connection

Once you have the correct anon key:

```bash
# Update the key in .env files first
npx tsx scripts/test-supabase-connection.ts
```

You should see:
```
✅ Successfully connected to Supabase!
Found 8 careers:
  - OGL Developer (Mid-Level)
  - OGL Tester (Entry-Level)
  - OGL Frontend Developer (Mid-Level)
  ...
```

---

## ✅ Step 5: Build and Test Frontend

```bash
cd client
npm run build
npm run dev
```

Open http://localhost:5173 and check:
- Careers page shows all 8 careers
- Dashboard loads without errors
- Career detail pages work

---

## ✅ Step 6: Migrate Firebase Data (If Needed)

If you have existing data in Firebase (questions, evaluations, user progress):

### Option A: Check Firebase First

1. Go to: https://console.firebase.google.com/project/mentorai1998/firestore
2. Check if you have data in these collections:
   - questions
   - evaluations
   - user_progress
   - submissions
   - scorecards
   - evaluation_cache

### Option B: Run Migration Script

If you have data to migrate:

1. Update Firestore rules temporarily to allow reads:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
       }
     }
   }
   ```

2. Run migration:
   ```bash
   npx tsx scripts/migrate-firebase-to-supabase.ts
   ```

3. Restore Firestore rules after migration

---

## ✅ Step 7: Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at: https://mentorai1998.web.app

---

## 🔍 Troubleshooting

### "Invalid API key" error
- ❌ You're using the wrong key format
- ✅ Get the full JWT token from Supabase dashboard

### Careers not showing
- Check Supabase Table Editor - do you see 8 careers?
- Check browser console for errors
- Verify the anon key is correct

### "Row Level Security policy violation"
- Run the `fix-supabase-rls.sql` script
- This makes careers publicly readable

### Firebase permission denied
- This is expected - Firebase is no longer being used
- All data should be in Supabase now

---

## 📊 Current Status

### ✅ Completed:
- [x] Supabase database created
- [x] SQL schema executed
- [x] 8 careers seeded in Supabase
- [x] Frontend updated to use Supabase
- [x] Build successful

### ⏳ Pending:
- [ ] Get correct Supabase anon key
- [ ] Test Supabase connection
- [ ] Verify careers load in frontend
- [ ] Migrate Firebase data (if any)
- [ ] Deploy to production

---

## 🎯 Next Action

**Please provide the correct Supabase anon key from your dashboard!**

Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api

Copy the **"anon public"** key and paste it here.
