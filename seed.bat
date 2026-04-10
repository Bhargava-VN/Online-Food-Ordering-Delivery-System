@echo off
echo ===========================================
echo    Seeding Database for CraveDash
echo ===========================================

cd /d "%~dp0"

echo Running database seeding script...
cmd /k "cd server && npm run seed"
