# How to Get Your Supabase Anon Key

## Step 1: Go to Supabase Dashboard

Open this URL in your browser:
```
https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api
```

## Step 2: Find the API Keys Section

You'll see a section called **"Project API keys"** with two keys:

### 1. **anon / public** key
- This is what you need for the frontend
- It's a long JWT token (looks like: `eyJhbGc...` with dots separating three parts)
- This key is SAFE to use in your frontend code

### 2. **service_role** key  
- DO NOT use this in frontend
- This has admin access to your database

## Step 3: Copy the Correct Key

1. Look for the key labeled **"anon"** or **"public"**
2. Click the copy icon next to it
3. The key should be in JWT format: `eyJxxx.eyJyyy.zzz` (three parts separated by dots)

## Step 4: What You Gave Me

You provided: `sb_publishable_orslwTcs6u2zEzXK1J3cYQ_FjB6wBPV`

This looks like a **publishable key ID**, not the actual JWT token.

## Step 5: What I Need

I need the full JWT token that looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2plY3RpZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM3NDM1OTc3LCJleHAiOjIwNTMwMTE5Nzd9.SIGNATURE_HERE
```

## Screenshot Guide

When you're on the API settings page, you should see something like:

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ... [Copy button]

service_role secret  
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ... [Copy button]
```

Copy the **first one** (anon public).

## Alternative: Check Project Settings

If you can't find it on the API page, try:

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api
2. Look for "Project URL" and "API Keys"
3. The anon key should be visible there

---

**Once you have the correct key, paste it here and I'll update all the files!**
