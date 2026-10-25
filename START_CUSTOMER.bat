@echo off
setlocal
title AS Store - Customer Storefront
cd /d "%~dp0"

echo ========================================================
echo             AS STORE - CUSTOMER STOREFRONT             
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher\start_all.ps1" -Target customer

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Application exited with error code %ERRORLEVEL%.
    pause
)

endlocal
