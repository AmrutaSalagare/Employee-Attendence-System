@echo off
echo Starting Employee Attendance System...
echo.
echo Starting Backend Server...
cd backend
start cmd /k "npm run dev"
echo.
echo Starting Frontend Application...
cd ..\frontend
start cmd /k "npm start"
echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
