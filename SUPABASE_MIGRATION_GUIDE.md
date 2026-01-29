# Supabase Migration Guide

## ✅ What's Already Done

1. ✅ SQL schema created (`supabase-schema.sql`)
2. ✅ SQL executed in Supabase (you confirmed this)
3. ✅ 8 OGL careers seeded in Supabase
4. ✅ Frontend updated to use Supabase (Careers.tsx, Dashboard.tsx, CareerDetail.tsx)
5. ✅ Supabase client configured (`client/src/config/supabase.ts`)

## 🔑 Step 1: Get the Correct Supabase API Key

Your current API key seems incorrect. Follow these steps:

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api

2. You'll see two keys:
   - **anon / public** key (this is what you need)
   - **service_role** key (DO NOT use this in frontend)

3. Copy the **anon public** key (it should be a long JWT token starting with `eyJ...`)

4. Update your `.env` files:

### Update `client/.env`:
```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=<paste_your_correct_anon_key_here>
```

### Update root `.env`:
```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=<paste_your_correct_anon_key_here>
```

## 📊 Step 2: Verify Data in Supabase

Go to your Supabase dashboard and check the tables:

1. **Table Editor**: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor

2. You should see these tables:
   - ✅ **careers** (should have 8 rows)
   - ✅ **user_progress** (empty for now)
   - ✅ **questions** (empty for now)
   - ✅ **evaluations** (empty for now)
   - ✅ **submissions** (empty for now)
   - ✅ **scorecards** (empty for now)
   - ✅ **evaluation_cache** (empty for now)

3. Click on **careers** table and verify you see:
   - OGL Developer
   - OGL Tester
   - OGL Frontend Developer
   - OGL Backend Developer
   - OGL DevOps Developer
   - OGL Cloud Developer
   - OGL QA Developer
   - OGL Content Developer

## 🔄 Step 3: Migrate Firebase Data (Optional)

If you have existing data in Firebase (questions, evaluations, user progress), you need to migrate it:

### Option A: Manual Migration (Recommended for small data)

1. Go to Firebase Console: https://console.firebase.google.com/project/mentorai1998/firestore

2. For each collection, export the data and manually insert into Supabase

### Option B: Automated Migration Script

1. Update Firestore rules to allow read access temporarily:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;  // Temporary for migration
       }
     }
   }
   ```

2. Fix the Supabase anon key in `scripts/migrate-firebase-to-supabase.ts`

3. Run the migration:
   ```bash
   npx tsx scripts/migrate-firebase-to-supabase.ts
   ```

4. Restore Firestore rules after migration

## 🧪 Step 4: Test the Application

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Test locally:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 and check:
   - ✅ Careers page shows all 8 careers
   - ✅ Dashboard shows career cards
   - ✅ Career detail pages load correctly

## 🚀 Step 5: Deploy

Once everything works locally:

```bash
firebase deploy --only hosting
```

Your app will be live at: https://mentorai1998.web.app

## 🔐 Important: Row Level Security (RLS)

The SQL schema already set up RLS policies:

- **Careers**: Everyone can read, authenticated users can write
- **User Progress**: Users can only see their own progress
- **Questions**: Authenticated users can read
- **Evaluations**: Users can only see their own evaluations
- **Submissions**: Users can only see their own submissions
- **Scorecards**: Users can only see their own scorecards

## 📝 Current Status

### ✅ Working:
- Supabase database created
- 8 careers seeded
- Frontend updated to use Supabase
- Build successful

### ⏳ Pending:
- Correct Supabase anon key needed
- Firebase data migration (if you have existing data)
- Testing with real user authentication
- Deployment

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Get the correct anon key from Supabase dashboard
- Make sure you're using the **anon/public** key, not service_role

### Error: "Row Level Security policy violation"
- Check that RLS policies were created (they should be from the SQL script)
- For careers table, reading should work without authentication

### Careers not showing
- Verify careers exist in Supabase Table Editor
- Check browser console for errors
- Verify Supabase URL and key are correct

## 📞 Next Steps

1. Get the correct Supabase anon key
2. Update `.env` files
3. Test the connection: `npx tsx scripts/test-supabase-connection.ts`
4. Build and test locally
5. Deploy to Firebase Hosting

---

**Need Help?** Check the Supabase dashboard for any errors or contact support.
