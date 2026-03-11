# C++ Advanced Question Issue - Visual Guide

## 🔍 What You're Seeing

```
Database Query Result:
┌──────┬───────────┬──────────────┬──────────┐
│ Skill│ Beginner  │ Intermediate │ Advanced │
├──────┼───────────┼──────────────┼──────────┤
│ c++  │    91     │      98      │    0     │ ← Shows 0!
│ cpp  │   122     │     133      │   240    │ ← Has 240!
└──────┴───────────┴──────────────┴──────────┘
```

## 🤔 Why This Happened

### Your CSV File Says:
```csv
C++,Advanced,When should you implement move constructors...
```
↓ (uppercase C++, uppercase Advanced)

### Database Created:
```
Skill: "C++" (uppercase)
Level: "Advanced" (uppercase)
```

### But Your App Looks For:
```
Skill: "cpp" (lowercase)
Level: "advanced" (lowercase)
```

### Result:
```
❌ "C++" ≠ "cpp"  (case-sensitive comparison)
❌ "Advanced" ≠ "advanced"  (case-sensitive comparison)
```

## 📊 The Split Explained

```
Your 684 C++ Questions Are Split:

┌─────────────────────────────────────┐
│  Skill: "c++" (lowercase with ++)   │
│  ├─ beginner: 91                    │
│  ├─ intermediate: 98                │
│  └─ advanced: 0                     │
│  Total: 189 questions               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Skill: "cpp" (lowercase no ++)     │
│  ├─ beginner: 122                   │
│  ├─ intermediate: 133               │
│  └─ advanced: 240  ← HERE THEY ARE! │
│  Total: 495 questions               │
└─────────────────────────────────────┘

Combined Total: 684 questions
```

## ✅ The Fix

### Step 1: Merge Database Entries

Run this SQL in Supabase:
```sql
-- FIX_CPP_MERGE_NOW.sql
UPDATE practice_questions
SET skill = 'cpp', level = LOWER(level)
WHERE LOWER(skill) IN ('c++', 'cpp', 'cplusplus');
```

### Step 2: Fix CSV Files

Run this batch file:
```batch
FIX_CPP_CSV_FILES.bat
```

This changes:
```csv
Before: C++,Advanced,question...
After:  cpp,advanced,question...
```

## 🎯 After the Fix

```
Database Query Result:
┌──────┬───────────┬──────────────┬──────────┐
│ Skill│ Beginner  │ Intermediate │ Advanced │
├──────┼───────────┼──────────────┼──────────┤
│ cpp  │   213     │     231      │   240    │ ✅ All merged!
└──────┴───────────┴──────────────┴──────────┘

Total: 684 questions (all under one skill name)
```

## 🚨 This Affects Other Skills Too!

Same issue exists for:
- `angular` vs `Angular`
- `aws` vs `Aws`
- `react` vs `React`
- And more...

**Recommended:** Run `FIX_COMPLETE_WITH_CONSTRAINT.sql` to fix ALL skills at once.

## 📝 Quick Action Checklist

- [ ] Run `FIX_CPP_MERGE_NOW.sql` in Supabase SQL Editor
- [ ] Run `FIX_CPP_CSV_FILES.bat` to fix CSV files
- [ ] Verify with `CHECK_ALL_SKILLS_BY_LEVEL.sql`
- [ ] Consider running `FIX_COMPLETE_WITH_CONSTRAINT.sql` for all skills

## 🔗 Related Files

- `CPP_ZERO_ADVANCED_EXPLAINED.md` - Detailed explanation
- `FIX_CPP_MERGE_NOW.sql` - SQL to merge C++ entries
- `FIX_CPP_CSV_FILES.bat` - Batch file to fix CSV files
- `FIX_COMPLETE_WITH_CONSTRAINT.sql` - Fix all skills at once
- `CHECK_ALL_SKILLS_BY_LEVEL.sql` - Verify the fix
