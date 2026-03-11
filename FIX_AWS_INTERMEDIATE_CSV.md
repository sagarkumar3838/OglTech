# Fix AWS Intermediate CSV - 16 Errors

## Problems Identified

1. **Skill name**: `Aws` → should be `aws` (lowercase)
2. **Level**: `Intermediate` → should be `intermediate` (lowercase)
3. **Correct answers mismatch**: Many rows say correct answer is B, but explanation says A

## Errors in Your CSV

Looking at the data:
- Row 1: correct_answer=A, but explanation says "Target tracking..." (A is correct) ✓
- Row 2: correct_answer=B, but explanation says "NAT Gateway is AZ-specific..." (should be A)
- Row 3: correct_answer=A ✓
- Row 4: correct_answer=A ✓
- Row 5: correct_answer=A ✓
- Row 6: correct_answer=B, but explanation says "DAX is an in-memory cache..." (should be A)
- Row 7: correct_answer=A ✓
- Row 8: correct_answer=B, but explanation says "VPC peering connections are non-transitive..." (should be B) ✓
- Row 9: correct_answer=A ✓
- Row 10: correct_answer=A ✓
- Row 11: correct_answer=C, but explanation says "Immutable deployment..." (should be C) ✓
- Row 12: correct_answer=A ✓
- Row 13: correct_answer=A ✓
- Row 14: correct_answer=A ✓
- Row 15: correct_answer=A ✓
- Row 16: correct_answer=A ✓
- Row 17: correct_answer=A ✓
- Row 18: correct_answer=B, but explanation says "Overlapping CIDRs cause..." (should be A)
- Row 19: correct_answer=A ✓
- Row 20: correct_answer=A ✓
- Row 21: correct_answer=B, but explanation says "Blue/green swaps..." (should be A)
- Row 22: correct_answer=A ✓
- Row 23: correct_answer=A ✓
- Row 24: correct_answer=B, but explanation says "Publisher sets message attributes..." (should be A)
- Row 25: correct_answer=A ✓
- Row 26: correct_answer=A ✓
- Row 27: correct_answer=A ✓
- Row 28: correct_answer=B, but explanation says "Intrinsic function AWS::NoValue..." (should be A)
- Row 29: correct_answer=A ✓
- Row 30: correct_answer=A ✓
- Row 31: correct_answer=A ✓
- Row 32: correct_answer=A ✓
- Row 33: correct_answer=A ✓
- Row 34: correct_answer=A ✓
- Row 35: correct_answer=B, but explanation says "Rolling updates replace..." (should be A)
- Row 36: correct_answer=A ✓
- Row 37: correct_answer=A ✓
- Row 38: correct_answer=B, but explanation says "SNS FIFO topics guarantee..." (should be A)
- Row 39: correct_answer=A ✓
- Row 40: correct_answer=B, but explanation says "The controller creates..." (should be A)
- Row 41: correct_answer=A ✓
- Row 42: correct_answer=A ✓
- Row 43: correct_answer=B, but explanation says "Grace period prevents..." (should be A)
- Row 44: correct_answer=B, but explanation says "Slow start gradually increases..." (should be A)
- Row 45: correct_answer=B, but explanation says "Geo Restriction blocks..." (should be A)
- Row 46: correct_answer=A ✓
- Row 47: correct_answer=A ✓
- Row 48: correct_answer=A ✓
- Row 49: correct_answer=B, but explanation says "ECMP allows load balancing..." (should be A)
- Row 50: correct_answer=A ✓
- Row 51: correct_answer=B, but explanation says "Enhanced health provides..." (should be A)
- Row 52: correct_answer=A ✓

## Solution

### Option 1: Fix in Excel/Google Sheets
1. Open the CSV in Excel or Google Sheets
2. Replace all `Aws` with `aws` in skill column
3. Replace all `Intermediate` with `intermediate` in level column
4. Fix the 16 wrong correct_answer values (change B to A where explanation says A is correct)

### Option 2: Use Find & Replace
1. Open CSV in text editor (VS Code, Notepad++)
2. Find: `Aws,Intermediate,` Replace with: `aws,intermediate,`
3. Manually fix the 16 rows where correct_answer doesn't match explanation

### Option 3: Run SQL After Upload
Upload the CSV as-is, then run this SQL to fix:

```sql
-- Fix skill and level case
UPDATE practice_questions
SET 
  skill = 'aws',
  level = 'intermediate'
WHERE skill = 'Aws' AND level = 'Intermediate';

-- Fix wrong correct answers (you'll need to identify which specific questions)
```

## Recommendation

The easiest fix: Open the CSV in Excel, do a find-replace for the case issues, then manually review and fix the 16 correct_answer mismatches before uploading.
