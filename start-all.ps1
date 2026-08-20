# NeuraNova Energy Supply Chain Resilience - PowerShell Startup Script
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   NEURANOVA ENERGY RESILIENCE - AUTONOMOUS MULTI-AGENT PLATFORM" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check backend dependencies
if (!(Test-Path "$scriptDir\backend\node_modules")) {
    Write-Host "`n[Setup] Installing backend dependencies..." -ForegroundColor Yellow
    cmd.exe /c "cd /d `"$scriptDir\backend`" && npm.cmd install"
}

# Check frontend dependencies
if (!(Test-Path "$scriptDir\frontend\node_modules")) {
    Write-Host "`n[Setup] Installing frontend dependencies..." -ForegroundColor Yellow
    cmd.exe /c "cd /d `"$scriptDir\frontend`" && npm.cmd install"
}

Write-Host "`n[1/2] Starting Backend API Server (Port 5000)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir\backend`" && npm.cmd run dev"

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend UI & AI Copilot (Port 5173)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir\frontend`" && npm.cmd run dev"

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "  All systems operational!" -ForegroundColor Green
Write-Host "  - Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API:        http://localhost:5000" -ForegroundColor White
Write-Host "  - Health Status:      http://localhost:5000/api/health" -ForegroundColor White
Write-Host "======================================================================`n" -ForegroundColor Green
