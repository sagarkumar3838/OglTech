@echo off
echo ============================================
echo Clearing Build Cache
echo ============================================
echo.

cd client

echo Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ Cleared node_modules\.vite
) else (
    echo - node_modules\.vite not found
)

echo.
echo Clearing dist folder...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✓ Cleared dist
) else (
    echo - dist not found
)

cd ..

echo.
echo ============================================
echo Cache cleared successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Restart your dev server: npm run dev
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Hard refresh (Ctrl+Shift+R)
echo.
pause
