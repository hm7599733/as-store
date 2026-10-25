# ==============================================================================
# AS Store - Application Orchestrator & Server Launcher
# Supports: Customer Storefront & Dedicated Admin Suite
# ==============================================================================

param(
    [string]$Target = "customer"
)

$ErrorActionPreference = "Continue"

$isTargetAdmin = ($Target -eq "admin")
$targetLabel = if ($isTargetAdmin) { "AS ADMIN SUITE" } else { "AS STORE (CUSTOMER)" }
$targetPath = if ($isTargetAdmin) { "/admin/dashboard" } else { "" }
$appUrl = "http://localhost:3000$targetPath"

try {
    $host.UI.RawUI.WindowTitle = "AS Store Launcher - $targetLabel"
} catch {}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "              $targetLabel               " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location -Path $projectRoot
Write-Host ("[INIT] Working Directory: " + $projectRoot) -ForegroundColor Gray

$port = 3000

# Helper function to open app in Chrome / Edge App-Mode or default browser
function Open-TargetApp([string]$url, [bool]$appMode = $false) {
    $browserOpened = $false
    
    # Try Edge / Chrome App Mode for Admin / Customer standalone window
    $chromePath = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
    $chromePathX86 = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
    $edgePath = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
    $edgePathX86 = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"

    $browserExe = $null
    if (Test-Path $edgePath) { $browserExe = $edgePath }
    elseif (Test-Path $chromePath) { $browserExe = $chromePath }
    elseif (Test-Path $edgePathX86) { $browserExe = $edgePathX86 }
    elseif (Test-Path $chromePathX86) { $browserExe = $chromePathX86 }

    if ($browserExe -and $appMode) {
        try {
            Start-Process -FilePath $browserExe -ArgumentList "--app=$url"
            $browserOpened = $true
        } catch {}
    }

    if (-not $browserOpened) {
        Start-Process $url
    }
}

# ------------------------------------------------------------------------------
# STEP 1: Quick Health Check (Is server already up?)
# ------------------------------------------------------------------------------
Write-Host "[STEP 1/3] Checking server status on port $port..." -ForegroundColor Yellow

$serverAlreadyActive = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $ar = $tcp.BeginConnect("127.0.0.1", $port, $null, $null)
    $success = $ar.AsyncWaitHandle.WaitOne(600, $false)
    if ($success -and $tcp.Connected) {
        $tcp.EndConnect($ar)
        $serverAlreadyActive = $true
    }
    $tcp.Close()
} catch {}

if ($serverAlreadyActive) {
    Write-Host "[OK] AS Store Server is already running!" -ForegroundColor Green
    Write-Host ("[LAUNCH] Opening $targetLabel at: " + $appUrl) -ForegroundColor Cyan
    Open-TargetApp -url $appUrl -appMode $isTargetAdmin
    Write-Host "Done! Server will continue running in its existing process." -ForegroundColor Green
    Start-Sleep -Seconds 2
    exit 0
}

# ------------------------------------------------------------------------------
# STEP 2: Free dead/stale sockets if any
# ------------------------------------------------------------------------------
try {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            $pidToKill = $c.OwningProcess
            if ($pidToKill -and $pidToKill -gt 4) {
                Write-Host ("[CLEAN] Freeing stale port $port process (PID: $pidToKill)...") -ForegroundColor Magenta
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
} catch {}

# ------------------------------------------------------------------------------
# STEP 3: Auto-Open Background Watcher
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[STEP 2/3] Registering auto-open trigger for $targetLabel..." -ForegroundColor Yellow

$jobScript = {
    param($targetUrl, $targetPort, $adminMode)
    $maxAttempts = 75
    $connected = $false
    for ($i = 0; $i -lt $maxAttempts; $i++) {
        Start-Sleep -Seconds 1
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $async = $client.BeginConnect("127.0.0.1", $targetPort, $null, $null)
            $completed = $async.AsyncWaitHandle.WaitOne(800, $false)
            if ($completed -and $client.Connected) {
                $client.EndConnect($async)
                $client.Close()
                $connected = $true
                break
            }
            $client.Close()
        } catch {}
    }

    if ($connected) {
        Start-Sleep -Milliseconds 600
        
        # Try App mode if available
        $edgePath = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
        $chromePath = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
        $browserExe = $null
        if (Test-Path $edgePath) { $browserExe = $edgePath }
        elseif (Test-Path $chromePath) { $browserExe = $chromePath }

        if ($browserExe -and $adminMode) {
            try {
                Start-Process -FilePath $browserExe -ArgumentList "--app=$targetUrl"
                return
            } catch {}
        }
        Start-Process $targetUrl
    }
}

Start-Job -ScriptBlock $jobScript -ArgumentList $appUrl, $port, $isTargetAdmin | Out-Null
Write-Host ("[OK] App will automatically open at $appUrl once ready.") -ForegroundColor Green

# ------------------------------------------------------------------------------
# STEP 4: Server Startup
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[STEP 3/3] Starting Server..." -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Mode            : $targetLabel" -ForegroundColor White
Write-Host " Storefront URL  : http://localhost:3000" -ForegroundColor White
Write-Host " Admin Panel     : http://localhost:3000/admin" -ForegroundColor White
Write-Host " Stop Server     : Press Ctrl+C in this terminal" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$npmExec = "npm"
if (Get-Command "npm.cmd" -ErrorAction SilentlyContinue) {
    $npmExec = "npm.cmd"
}

# If production build exists, run 'npm run start', else fallback to 'npm run dev'
if (Test-Path ".next") {
    & $npmExec run start
} else {
    & $npmExec run dev
}
