@echo off
echo ========================================
echo Fixing Ansible Advanced CSV - Remove BOM
echo ========================================
echo.
echo Issue: UTF-8 BOM detected in file
echo This causes CSV parsers to fail
echo.

echo Running fix script...
npx tsx scripts/fix-ansible-csv-bom.ts

echo.
echo ========================================
echo Fix Complete!
echo ========================================
pause
