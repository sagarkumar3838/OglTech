# Ansible Advanced CSV Fix - BOM Issue

## Problem Identified

The `questions/ansible-advanced.csv` file was showing **0 questions** when uploaded or parsed, despite containing 364 valid questions.

### Root Cause: UTF-8 BOM (Byte Order Mark)

**What is a BOM?**
- A BOM is an invisible character sequence at the start of a file
- UTF-8 BOM bytes: `EF BB BF` (in hexadecimal)
- Many text editors add this automatically when saving as UTF-8
- Most CSV parsers and upload scripts fail when BOM is present

**Why it causes "0 questions":**
1. CSV parser reads the first line (header)
2. BOM makes the header unrecognizable: `skill,level,...` instead of `skill,level,...`
3. Parser thinks the header is invalid
4. All subsequent rows are rejected
5. Result: 0 valid questions found

## File Analysis

### Before Fix
```
First 3 bytes: EF BB BF (UTF-8 BOM)
Total lines: 365
Questions: 364
Header: skill,level,... (BOM prefix invisible but present)
Status: ✗ UNPARSEABLE
```

### After Fix
```
First 3 bytes: 73 6B 69 (s k i - no BOM)
Total lines: 365
Questions: 364
Header: skill,level,... (clean)
Status: ✓ READY FOR UPLOAD
```

## Fix Applied

### Script Created
- **File**: `scripts/fix-ansible-csv-bom.ts`
- **Batch file**: `FIX_ANSIBLE_BOM.bat`

### What the Script Does
1. Reads file as binary buffer
2. Detects UTF-8 BOM (bytes EF BB BF)
3. Removes BOM by reading from byte 3 onwards
4. Validates header structure
5. Counts valid questions
6. Creates backup of original file
7. Writes clean CSV without BOM

## Results

✓ **BOM successfully removed**
✓ **364 valid questions preserved**
✓ **Header now parseable**
✓ **File ready for database upload**

### Files Created
- `questions/ansible-advanced.csv.backup` - Original file with BOM
- `questions/ansible-advanced-fixed.csv` - Fixed version without BOM
- `questions/ansible-advanced.csv` - Replaced with fixed version

## Why This Happens

Common causes of BOM in CSV files:
1. **Excel**: "Save As" → "CSV UTF-8" adds BOM
2. **Notepad**: "Save As" → "UTF-8" adds BOM
3. **Some text editors**: Default UTF-8 encoding includes BOM

## How to Prevent

When creating/editing CSV files:
- Use "UTF-8 without BOM" encoding
- Use VS Code (defaults to no BOM)
- Use Notepad++ with "UTF-8 without BOM"
- Avoid Excel's "CSV UTF-8" format

## Testing the Fix

You can verify the fix worked:

```powershell
# Check for BOM
$bytes = [System.IO.File]::ReadAllBytes("questions/ansible-advanced.csv")
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "BOM present"
} else {
    Write-Host "No BOM - file is clean"
}
```

## Next Steps

The file is now ready for upload:
- Use your existing upload scripts
- CSV parsers will now correctly read all 364 questions
- No more "0 questions" error

## Technical Details

**BOM Bytes Explained:**
- `EF BB BF` = UTF-8 BOM signature
- Translates to character: `U+FEFF` (Zero Width No-Break Space)
- Invisible in most text editors
- Breaks CSV parsing because header becomes: `skill` instead of `skill`

**Why CSV Parsers Fail:**
- Header validation fails: `skill` ≠ `skill`
- Column mapping breaks
- All rows rejected as invalid
- Result: 0 questions imported

This is a common issue with CSV files and the fix ensures compatibility with all CSV parsers and database import tools.
