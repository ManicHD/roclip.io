@echo off
cd /d "%~dp0"

if not exist "node_modules" (
    echo Node modules not found. Installing dependencies...
    call npm install
)

echo Starting ClipRoblox...
npm run dev
pause
