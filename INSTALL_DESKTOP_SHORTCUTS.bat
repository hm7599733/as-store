@echo off
setlocal
title Install AS Store & Admin Desktop Shortcuts
cd /d "%~dp0"

echo ========================================================
echo       INSTALLING SEPARATE DESKTOP SHORTCUTS             
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher\create_desktop_shortcuts.ps1"

echo.
echo Press any key to close this window...
pause >nul
endlocal
