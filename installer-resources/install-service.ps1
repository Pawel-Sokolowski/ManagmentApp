# Office Management System - Windows Service Installer
# This script installs the application as a Windows Service using NSSM

<#
.SYNOPSIS
    Installs Office Management System as a Windows Service
.DESCRIPTION
    This script uses NSSM (Non-Sucking Service Manager) to install and configure
    the Office Management System as a Windows Service for automatic startup.
.NOTES
    Requires Administrator privileges
    NSSM must be downloaded separately from: https://nssm.cc/download
#>

# Require Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "This script requires Administrator privileges!"
    Write-Host "Please run PowerShell as Administrator and try again."
    Pause
    Exit
}

$ServiceName = "OfficeManagementSystem"
$DisplayName = "Office Management System"
$Description = "Office Management System - Business Management Application"

# Get installation directory
$InstallDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeExe = "node.exe"
$ServerScript = Join-Path $InstallDir "server\index.js"
$StartScript = Join-Path $InstallDir "start-server.bat"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Office Management System" -ForegroundColor Cyan
Write-Host "Windows Service Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if service already exists
$ExistingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if ($ExistingService) {
    Write-Host "Service '$ServiceName' already exists!" -ForegroundColor Yellow
    $Response = Read-Host "Do you want to reinstall? (Y/N)"
    
    if ($Response -eq "Y" -or $Response -eq "y") {
        Write-Host "Stopping and removing existing service..." -ForegroundColor Yellow
        Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        # Try using NSSM to remove
        $nssmPath = "nssm.exe"
        if (Get-Command $nssmPath -ErrorAction SilentlyContinue) {
            & $nssmPath remove $ServiceName confirm
        } else {
            # Fallback to sc.exe
            sc.exe delete $ServiceName
        }
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Installation cancelled."
        Pause
        Exit
    }
}

# Check for Node.js
$NodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $NodePath) {
    Write-Host "ERROR: Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/"
    Pause
    Exit
}

Write-Host "[OK] Node.js found at: $NodePath" -ForegroundColor Green
Write-Host ""

# Check for NSSM
$NSSMPath = "nssm.exe"
$NSSMFound = $false

# Check if NSSM is in PATH
if (Get-Command $NSSMPath -ErrorAction SilentlyContinue) {
    $NSSMFound = $true
    Write-Host "[OK] NSSM found in system PATH" -ForegroundColor Green
} else {
    # Check in installation directory
    $LocalNSSM = Join-Path $InstallDir "nssm.exe"
    if (Test-Path $LocalNSSM) {
        $NSSMPath = $LocalNSSM
        $NSSMFound = $true
        Write-Host "[OK] NSSM found in installation directory" -ForegroundColor Green
    }
}

if (-not $NSSMFound) {
    Write-Host "WARNING: NSSM not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "NSSM is required to install as a Windows Service."
    Write-Host "Download NSSM from: https://nssm.cc/download"
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Download NSSM and place nssm.exe in this directory"
    Write-Host "2. Install NSSM and add it to system PATH"
    Write-Host "3. Use manual service installation (see documentation)"
    Write-Host ""
    
    $Response = Read-Host "Do you want to create a manual service instead? (Y/N)"
    if ($Response -eq "Y" -or $Response -eq "y") {
        # Create manual service using New-Service
        Write-Host ""
        Write-Host "Creating Windows Service (manual method)..." -ForegroundColor Yellow
        
        # This requires a wrapper executable, so we'll create a scheduled task instead
        Write-Host ""
        Write-Host "Creating scheduled task for automatic startup..." -ForegroundColor Cyan
        
        $TaskName = "OfficeManagementSystem"
        $Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$StartScript`"" -WorkingDirectory $InstallDir
        $Trigger = New-ScheduledTaskTrigger -AtStartup
        $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        $Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        
        Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Force
        
        Write-Host "[OK] Scheduled task created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "The application will now start automatically on system boot."
        Write-Host "To start now, run: schtasks /run /tn $TaskName"
        Write-Host ""
        Pause
        Exit
    } else {
        Write-Host "Installation cancelled."
        Pause
        Exit
    }
}

# Install service using NSSM
Write-Host "Installing Windows Service using NSSM..." -ForegroundColor Cyan
Write-Host ""

# Install the service
& $NSSMPath install $ServiceName $NodePath $ServerScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Service installed" -ForegroundColor Green
    
    # Configure service
    & $NSSMPath set $ServiceName DisplayName $DisplayName
    & $NSSMPath set $ServiceName Description $Description
    & $NSSMPath set $ServiceName AppDirectory $InstallDir
    & $NSSMPath set $ServiceName Start SERVICE_AUTO_START
    
    # Set environment variables
    $EnvFile = Join-Path $InstallDir ".env"
    if (Test-Path $EnvFile) {
        Write-Host "Loading environment variables from .env..." -ForegroundColor Cyan
        
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^([^=]+)=(.+)$") {
                $key = $matches[1]
                $value = $matches[2]
                & $NSSMPath set $ServiceName AppEnvironmentExtra $key=$value
            }
        }
    }
    
    # Set stdout and stderr logging
    $LogDir = Join-Path $InstallDir "logs"
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir | Out-Null
    }
    
    & $NSSMPath set $ServiceName AppStdout (Join-Path $LogDir "service-output.log")
    & $NSSMPath set $ServiceName AppStderr (Join-Path $LogDir "service-error.log")
    & $NSSMPath set $ServiceName AppRotateFiles 1
    & $NSSMPath set $ServiceName AppRotateBytes 1048576  # 1MB
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Service Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Name: $ServiceName"
    Write-Host "Display Name: $DisplayName"
    Write-Host ""
    
    $Response = Read-Host "Do you want to start the service now? (Y/N)"
    if ($Response -eq "Y" -or $Response -eq "y") {
        Write-Host ""
        Write-Host "Starting service..." -ForegroundColor Cyan
        Start-Service -Name $ServiceName
        Start-Sleep -Seconds 3
        
        $Service = Get-Service -Name $ServiceName
        if ($Service.Status -eq "Running") {
            Write-Host "[OK] Service is running!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Access the application at: http://localhost:3001"
        } else {
            Write-Host "WARNING: Service failed to start" -ForegroundColor Yellow
            Write-Host "Check logs at: $LogDir"
        }
    }
    
    Write-Host ""
    Write-Host "Service Management Commands:" -ForegroundColor Cyan
    Write-Host "  Start:   Start-Service -Name $ServiceName"
    Write-Host "  Stop:    Stop-Service -Name $ServiceName"
    Write-Host "  Restart: Restart-Service -Name $ServiceName"
    Write-Host "  Remove:  nssm remove $ServiceName"
    Write-Host ""
    
} else {
    Write-Host "ERROR: Failed to install service" -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE"
}

Pause
