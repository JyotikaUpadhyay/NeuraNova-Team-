@echo off
title NeuraNova Energy Resilience Multi-Agent System
echo ======================================================================
echo    NEURANOVA ENERGY RESILIENCE - AUTONOMOUS MULTI-AGENT PLATFORM
echo ======================================================================
echo.

cd /d "%~dp0"

echo Checking backend dependencies...
if not exist "backend\node_modules" (
    echo [Setup] Installing backend packages (first-time initialization)...
    cd backend
    call npm install
    cd ..
)

echo Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [Setup] Installing frontend packages (first-time initialization)...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [1/2] Launching Backend API & Multi-Agent Orchestrator (Port 5000)...
start "NeuraNova Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Launching React Dashboard & AI Copilot (Port 5173)...
start "NeuraNova Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo  All services started!
echo  - Frontend Dashboard: http://localhost:5173
echo  - Backend API:        http://localhost:5000
echo  - Health Check:       http://localhost:5000/api/health
echo ======================================================================
echo.
pause
