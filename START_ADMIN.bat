@echo off
setlocal
title AS Admin Suite - Store Manager
cd /d "%~dp0"

echo ========================================================
echo           AS ADMIN SUITE - EXECUTIVE MANAGER            
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher\start_all.ps1" -Target admin

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Admin Suite exited with error code %ERRORLEVEL%.
    pause
)

endlocal
