# Quick Upload Fix 🚀

## The Problem
You ran the command from inside the `scripts/` folder, which caused the path to duplicate:
```
C:\Users\death\Desktop\oglTech\scripts\scripts\upload-all-questions.ts
```

## The Solution

### Option 1: Run from Root Directory (Recommended)
```bash
# Make sure you're in the root directory
cd C:\Users\death\Desktop\oglTech

# Then run the batch file
UPLOAD_QUESTIONS_SIMPLE.bat
```

### Option 2: Run Directly with npx
```bash
# From root directory
cd C:\Users\death\Desktop\oglTech
npx tsx scripts/upload-all-questions.ts
```

### Option 3: If You're in scripts/ folder
```bash
# Go back to root first
cd ..

# Then run
npx tsx scripts/upload-all-questions.ts
```

## Verify Your Location
Before running, check where you are:
```bash
# PowerShell
pwd

# Should show: C:\Users\death\Desktop\oglTech
# NOT: C:\Users\death\Desktop\oglTech\scripts
```

## After Upload
Check Supabase with this SQL:
```sql
SELECT COUNT(*) as total FROM practice_questions;
SELECT skill, COUNT(*) as count FROM practice_questions GROUP BY skill ORDER BY count DESC;
```

---
**Quick Command (Copy & Paste):**
```bash
cd C:\Users\death\Desktop\oglTech && npx tsx scripts/upload-all-questions.ts
```
