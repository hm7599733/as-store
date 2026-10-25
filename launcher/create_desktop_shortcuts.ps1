# ==============================================================================
# AS Store - Desktop Shortcut Generator
# Generates separate shortcuts for Customer Storefront & Admin Suite
# ==============================================================================

$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$projectRoot = Split-Path -Parent $PSScriptRoot

$customerBat = Join-Path $projectRoot "START_CUSTOMER.bat"
$adminBat = Join-Path $projectRoot "START_ADMIN.bat"
$customerIcon = Join-Path $projectRoot "public\customer.ico"
$adminIcon = Join-Path $projectRoot "public\admin.ico"

# 1. Customer Shortcut
$customerShortcutPath = Join-Path $DesktopPath "AS Store - Customer.lnk"
$customerShortcut = $WshShell.CreateShortcut($customerShortcutPath)
$customerShortcut.TargetPath = $customerBat
$customerShortcut.WorkingDirectory = $projectRoot
$customerShortcut.Description = "Launch AS Store Customer Shopping Experience"
if (Test-Path $customerIcon) {
    $customerShortcut.IconLocation = "$customerIcon,0"
}
$customerShortcut.Save()
Write-Host "[OK] Created Customer Shortcut: $customerShortcutPath" -ForegroundColor Green

# 2. Admin Shortcut
$adminShortcutPath = Join-Path $DesktopPath "AS Store - Admin Suite.lnk"
$adminShortcut = $WshShell.CreateShortcut($adminShortcutPath)
$adminShortcut.TargetPath = $adminBat
$adminShortcut.WorkingDirectory = $projectRoot
$adminShortcut.Description = "Launch AS Admin Suite (Real-time Orders & Store Manager)"
if (Test-Path $adminIcon) {
    $adminShortcut.IconLocation = "$adminIcon,0"
}
$adminShortcut.Save()
Write-Host "[OK] Created Admin Suite Shortcut: $adminShortcutPath" -ForegroundColor Green

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Desktop Shortcuts Successfully Created!" -ForegroundColor Cyan
Write-Host "  1. 'AS Store - Customer' -> Shopping storefront" -ForegroundColor White
Write-Host "  2. 'AS Store - Admin Suite' -> Executive admin manager" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
