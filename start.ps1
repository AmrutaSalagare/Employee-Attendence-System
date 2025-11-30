# Start Employee Attendance System
Write-Host "Starting Employee Attendance System..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'D:\TapAcademy\employee-attendance-system\backend'; npm run dev" -PassThru

# Wait a moment
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Application..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'D:\TapAcademy\employee-attendance-system\frontend'; npm start" -PassThru

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
