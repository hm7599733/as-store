@echo off
setlocal
title AS Store Launcher
cd /d "%~dp0"

echo ========================================================
echo                AS STORE - STARTING APP                  
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher\start_all.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Application exited with error code %ERRORLEVEL%.
    pause
)

endlocal
