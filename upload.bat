@echo off
cls
echo ========================================
echo   Updating Imposter Game to GitHub...
echo ========================================

:: 1. Stage all changes
git add .

:: 2. Ask for a commit message
set /p msg="What did you change? (Write a short message): "

:: 3. Commit with the message
git commit -m "%msg%"

:: 4. Push to the main branch
echo Sending to GitHub...
git push origin main

echo ========================================
echo   Done! Vercel will update the site now.
echo ========================================
pause