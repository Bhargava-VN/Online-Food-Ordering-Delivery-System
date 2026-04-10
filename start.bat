@echo off
echo ===========================================
echo    Starting CraveDash (Food Delivery)
echo ===========================================

:: Navigate to the directory where this script is located
cd /d "%~dp0"

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && npm run dev"

echo Both servers are booting up in separate terminal windows!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo You can safely close this window. The servers will keep running in the newly opened windows.
pause
