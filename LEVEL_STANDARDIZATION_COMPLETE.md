# Level Standardization - Complete Solution

## The Problem

Your CSV files use: `Basic`, `Intermediate`, `Advanced`
Your app expects: `easy`, `medium`, `hard`

Result: Questions don't show up because level names don't match!

## The Solution

Run ONE SQL file to fix ALL skills at once.

## Steps

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste: `FIX_ALL_LEVELS_TO_EASY_MEDIUM_HARD.sql`
4. Click RUN

## What It Does

Converts ALL level names across ALL skills:
- `Basic` or `Beginner` → `easy`
- `Intermediate` → `medium`
- `Advanced` → `hard`

## Files

### Run This First
- `FIX_ALL_LEVELS_TO_EASY_MEDIUM_HARD.sql` - Converts all levels

### Check Results
- `CHECK_ALL_SKILLS_LEVELS.sql` - View all skills and levels

### Helper
- `FIX_ALL_LEVELS_NOW.bat` - Instructions

## After Running

All 123 skills will have standardized levels:
- Devtools: easy, medium, hard ✓
- HTML: easy, medium, hard ✓
- JavaScript: easy, medium, hard ✓
- All others: easy, medium, hard ✓

Your app will find all questions correctly!

## Verification

Run this query to confirm:
```sql
SELECT level, COUNT(*) FROM questions GROUP BY level;
```

You should see ONLY:
- easy: ~3,155 questions
- medium: ~3,155 questions  
- hard: ~3,154 questions

Total: 9,464 questions
