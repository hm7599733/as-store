$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "AS Store.lnk"
$TargetBat = Join-Path (Split-Path -Parent $PSScriptRoot) "START_APP.bat"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetBat
$Shortcut.WorkingDirectory = Split-Path -Parent $PSScriptRoot
$Shortcut.Description = "Launch AS Store E-Commerce Platform"
$Shortcut.Save()

Write-Host "[OK] Desktop shortcut created at: $ShortcutPath" -ForegroundColor Green
