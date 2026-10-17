# ==============================================================================
# AS Store - Application Orchestrator & Server Launcher
# ==============================================================================

$ErrorActionPreference = "Continue"

try {
    $host.UI.RawUI.WindowTitle = "AS Store Server Launcher"
} catch {}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                AS STORE - APPLICATION LAUNCHER                 " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location -Path $projectRoot
Write-Host ("[INIT] Working Directory: " + $projectRoot) -ForegroundColor Gray

# ------------------------------------------------------------------------------
# STEP 1: Port Cleanup (3000)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[STEP 1/3] Checking port 3000..." -ForegroundColor Yellow

$port = 3000
try {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            $pidToKill = $c.OwningProcess
            if ($pidToKill -and $pidToKill -gt 4) {
                Write-Host ("[CLEAN] Freeing existing server on port $port (PID: $pidToKill)...") -ForegroundColor Magenta
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
} catch {}

# ------------------------------------------------------------------------------
# STEP 2: Browser Auto-Open
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[STEP 2/3] Registering Browser Auto-Open background watcher..." -ForegroundColor Yellow

$appUrl = "http://localhost:3000"

$jobScript = {
    param($targetUrl, $targetPort)
    $maxAttempts = 60
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
        Start-Process $targetUrl
    }
}

Start-Job -ScriptBlock $jobScript -ArgumentList $appUrl, $port | Out-Null
Write-Host ("[OK] Browser will automatically open " + $appUrl + " once server is ready.") -ForegroundColor Green

# ------------------------------------------------------------------------------
# STEP 3: Server Execution
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[STEP 3/3] Starting AS Store Server..." -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Storefront URL  : http://localhost:3000" -ForegroundColor White
Write-Host " Admin Panel     : http://localhost:3000/admin" -ForegroundColor White
Write-Host " Stop Server     : Press Ctrl+C in this terminal" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$npmExec = "npm"
if (Get-Command "npm.cmd" -ErrorAction SilentlyContinue) {
    $npmExec = "npm.cmd"
}

& $npmExec run start
