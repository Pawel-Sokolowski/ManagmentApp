# Automatic PostgreSQL Installation Script for Office Management System
# This script downloads and installs PostgreSQL silently with predefined settings

param(
    [string]$InstallDir = "C:\Program Files\PostgreSQL\15",
    [string]$DataDir = "C:\Program Files\PostgreSQL\15\data",
    [string]$Port = "5432",
    [string]$Password = "postgres123!",
    [string]$Locale = "en_US.UTF-8",
    [switch]$Silent = $true
)

$ErrorActionPreference = "Stop"

# PostgreSQL download URL (version 15.x - latest stable)
$PostgreSQLVersion = "15.10-1"
$DownloadUrl = "https://get.enterprisedb.com/postgresql/postgresql-$PostgreSQLVersion-windows-x64.exe"
$InstallerPath = "$env:TEMP\postgresql-installer.exe"

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    switch ($Type) {
        "Success" { Write-Host "[$timestamp] ✓ $Message" -ForegroundColor Green }
        "Error"   { Write-Host "[$timestamp] ✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[$timestamp] ⚠ $Message" -ForegroundColor Yellow }
        default   { Write-Host "[$timestamp] ℹ $Message" -ForegroundColor Cyan }
    }
}

function Test-PostgreSQLInstalled {
    # Check if PostgreSQL is already installed
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlPath) {
        Write-Status "PostgreSQL is already installed at: $($psqlPath.Source)" "Success"
        return $true
    }
    
    # Check common installation paths
    $commonPaths = @(
        "C:\Program Files\PostgreSQL\*\bin\psql.exe",
        "C:\Program Files (x86)\PostgreSQL\*\bin\psql.exe",
        "$env:ProgramFiles\PostgreSQL\*\bin\psql.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            Write-Status "PostgreSQL found at: $path" "Success"
            return $true
        }
    }
    
    return $false
}

function Add-PostgreSQLToPath {
    param([string]$BinPath)
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($currentPath -notlike "*$BinPath*") {
        Write-Status "Adding PostgreSQL to system PATH..."
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$BinPath", "Machine")
        $env:Path = "$env:Path;$BinPath"
        Write-Status "PostgreSQL added to PATH" "Success"
    }
}

function Download-PostgreSQL {
    Write-Status "Downloading PostgreSQL $PostgreSQLVersion..."
    Write-Status "URL: $DownloadUrl"
    
    try {
        # Use .NET WebClient for better progress reporting
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($DownloadUrl, $InstallerPath)
        Write-Status "Download completed: $InstallerPath" "Success"
        return $true
    } catch {
        Write-Status "Failed to download PostgreSQL: $($_.Exception.Message)" "Error"
        
        # Try alternate download method
        Write-Status "Trying alternate download method..."
        try {
            Invoke-WebRequest -Uri $DownloadUrl -OutFile $InstallerPath -UseBasicParsing
            Write-Status "Download completed (alternate method)" "Success"
            return $true
        } catch {
            Write-Status "Alternate download failed: $($_.Exception.Message)" "Error"
            return $false
        }
    }
}

function Install-PostgreSQL {
    Write-Status "Starting PostgreSQL installation..."
    Write-Status "Installation directory: $InstallDir"
    Write-Status "Data directory: $DataDir"
    Write-Status "Port: $Port"
    
    # Create installation options file for silent install
    $optionsFile = "$env:TEMP\postgresql-install-options.txt"
    @"
mode=unattended
unattendedmodeui=none
superpassword=$Password
servicename=postgresql
servicepassword=$Password
serverport=$Port
prefix=$InstallDir
datadir=$DataDir
locale=$Locale
"@ | Out-File -FilePath $optionsFile -Encoding ASCII
    
    # Run installer
    Write-Status "Running PostgreSQL installer (this may take 5-10 minutes)..."
    try {
        $process = Start-Process -FilePath $InstallerPath -ArgumentList "--mode unattended --unattendedmodeui none --superpassword `"$Password`" --servicename postgresql --servicepassword `"$Password`" --serverport $Port --prefix `"$InstallDir`" --datadir `"$DataDir`" --locale `"$Locale`"" -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Status "PostgreSQL installed successfully" "Success"
            
            # Add to PATH
            $binPath = Join-Path $InstallDir "bin"
            Add-PostgreSQLToPath -BinPath $binPath
            
            # Wait for service to start
            Write-Status "Waiting for PostgreSQL service to start..."
            Start-Sleep -Seconds 5
            
            # Check service status
            $service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
            if ($service -and $service.Status -eq "Running") {
                Write-Status "PostgreSQL service is running" "Success"
            } else {
                Write-Status "PostgreSQL service may not be running. Attempting to start..." "Warning"
                Start-Service -Name "postgresql*" -ErrorAction SilentlyContinue
            }
            
            return $true
        } else {
            Write-Status "PostgreSQL installation failed with exit code: $($process.ExitCode)" "Error"
            return $false
        }
    } catch {
        Write-Status "Failed to run installer: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Test-PostgreSQLConnection {
    Write-Status "Testing PostgreSQL connection..."
    
    $env:PGPASSWORD = $Password
    try {
        $result = & psql -h localhost -p $Port -U postgres -d postgres -c "SELECT version();" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "PostgreSQL connection successful" "Success"
            return $true
        } else {
            Write-Status "PostgreSQL connection failed" "Error"
            return $false
        }
    } catch {
        Write-Status "Failed to test connection: $($_.Exception.Message)" "Error"
        return $false
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

function Cleanup {
    Write-Status "Cleaning up temporary files..."
    if (Test-Path $InstallerPath) {
        Remove-Item $InstallerPath -Force -ErrorAction SilentlyContinue
    }
    $optionsFile = "$env:TEMP\postgresql-install-options.txt"
    if (Test-Path $optionsFile) {
        Remove-Item $optionsFile -Force -ErrorAction SilentlyContinue
    }
}

# Main execution
try {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "PostgreSQL Automatic Installation" -ForegroundColor Cyan
    Write-Host "Office Management System" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if already installed
    if (Test-PostgreSQLInstalled) {
        Write-Status "PostgreSQL is already installed. Skipping installation." "Success"
        Write-Host ""
        Write-Status "If you need to reconfigure PostgreSQL, please:" "Info"
        Write-Status "  1. Uninstall existing PostgreSQL" "Info"
        Write-Status "  2. Run this script again" "Info"
        Write-Host ""
        exit 0
    }
    
    # Download PostgreSQL
    if (-not (Download-PostgreSQL)) {
        Write-Status "Failed to download PostgreSQL installer" "Error"
        Write-Status "Please download manually from: https://www.postgresql.org/download/windows/" "Info"
        exit 1
    }
    
    # Install PostgreSQL
    if (-not (Install-PostgreSQL)) {
        Write-Status "PostgreSQL installation failed" "Error"
        Cleanup
        exit 1
    }
    
    # Test connection
    Start-Sleep -Seconds 3
    if (-not (Test-PostgreSQLConnection)) {
        Write-Status "PostgreSQL installed but connection test failed" "Warning"
        Write-Status "You may need to start the PostgreSQL service manually" "Warning"
    }
    
    # Cleanup
    Cleanup
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "PostgreSQL Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Status "PostgreSQL Details:" "Success"
    Write-Status "  Host: localhost" "Success"
    Write-Status "  Port: $Port" "Success"
    Write-Status "  Username: postgres" "Success"
    Write-Status "  Password: $Password" "Success"
    Write-Status "  Installation: $InstallDir" "Success"
    Write-Host ""
    Write-Status "IMPORTANT: Please save these credentials!" "Warning"
    Write-Host ""
    
    exit 0
    
} catch {
    Write-Status "Unexpected error: $($_.Exception.Message)" "Error"
    Cleanup
    exit 1
}
