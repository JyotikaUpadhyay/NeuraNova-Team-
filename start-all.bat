@echo off
title NeuraNova Energy Resilience Multi-Agent System

echo ================================================================
echo     NEURANOVA ENERGY RESILIENCE - AUTONOMOUS MULTI-AGENT PLATFORM
echo ================================================================
echo.

cd /d "%~dp0"

echo Checking backend dependencies...
if not exist "backend\src\node_modules" (
    echo [Setup] Installing backend packages...
    cd backend\src
    call npm install
    cd ..\..
)

echo Checking frontend dependencies...
if not exist "frontend\src\node_modules" (
    echo [Setup] Installing frontend packages...
    cd frontend\src
    call npm install
    cd ..\..
)

echo.
echo [1/2] Launching Backend API and Multi-Agent Orchestrator...
start "NeuraNova Backend" cmd /k "cd backend\src && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Launching React Dashboard and AI Copilot...
start "NeuraNova Frontend" cmd /k "cd frontend\src && npm run dev"

echo.
echo NeuraNova services are starting...