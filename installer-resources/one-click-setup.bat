@echo off
SETLOCAL EnableDelayedExpansion

REM ========================================
REM One-Click Automatic Setup
REM Office Management System
REM ========================================

echo.
echo ========================================
echo Office Management System
echo Automatic Installation Wizard
echo ========================================
echo.

REM Get installation directory (script is run from install dir)
set "INSTALL_DIR=%~dp0"
set "LOG_FILE=%INSTALL_DIR%data\logs\setup.log"

REM Create log directory
if not exist "%INSTALL_DIR%data\logs" (
    mkdir "%INSTALL_DIR%data\logs" 2>nul
)

REM Start logging
echo [%date% %time%] Starting automatic setup >> "%LOG_FILE%" 2>&1

REM ========================================
REM Step 1: Check/Install PostgreSQL
REM ========================================
echo Step 1/4: Checking PostgreSQL installation...
echo [%date% %time%] Checking PostgreSQL >> "%LOG_FILE%" 2>&1

where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL not found. Installing automatically...
    echo [%date% %time%] PostgreSQL not found, starting installation >> "%LOG_FILE%" 2>&1
    
    REM Check if PowerShell script exists
    if exist "%INSTALL_DIR%install-postgresql.ps1" (
        echo Running PostgreSQL installer (this may take 5-10 minutes)...
        echo Please wait...
        
        REM Run PowerShell script with elevated privileges
        powershell -ExecutionPolicy Bypass -File "%INSTALL_DIR%install-postgresql.ps1" -Silent >> "%LOG_FILE%" 2>&1
        
        if !ERRORLEVEL! EQU 0 (
            echo [OK] PostgreSQL installed successfully
            echo [%date% %time%] PostgreSQL installed >> "%LOG_FILE%" 2>&1
            
            REM Refresh environment variables
            call "%INSTALL_DIR%refresh-env.bat" 2>nul
        ) else (
            echo [ERROR] PostgreSQL installation failed
            echo [%date% %time%] PostgreSQL installation failed >> "%LOG_FILE%" 2>&1
            echo.
            echo Please install PostgreSQL manually from:
            echo https://www.postgresql.org/download/windows/
            echo.
            echo After installation, run setup-database.bat
            pause
            exit /b 1
        )
    ) else (
        echo [ERROR] PostgreSQL installer script not found
        echo [%date% %time%] install-postgresql.ps1 not found >> "%LOG_FILE%" 2>&1
        echo.
        echo Please install PostgreSQL manually from:
        echo https://www.postgresql.org/download/windows/
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] PostgreSQL is already installed
    echo [%date% %time%] PostgreSQL already installed >> "%LOG_FILE%" 2>&1
)

echo.

REM ========================================
REM Step 2: Configure Database Settings
REM ========================================
echo Step 2/4: Configuring database settings...
echo [%date% %time%] Configuring database >> "%LOG_FILE%" 2>&1

REM Use default configuration for one-click install
set "DB_HOST=localhost"
set "DB_PORT=5432"
set "DB_NAME=office_management"
set "DB_USER=postgres"
set "DB_PASSWORD=postgres123!"

REM Check if custom config exists
set "CONFIG_FILE=%INSTALL_DIR%data\db-config.txt"
if exist "%CONFIG_FILE%" (
    echo Loading existing configuration...
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        set "%%a=%%b"
    )
) else (
    REM Save default configuration
    (
        echo DB_HOST=!DB_HOST!
        echo DB_PORT=!DB_PORT!
        echo DB_NAME=!DB_NAME!
        echo DB_USER=!DB_USER!
        echo DB_PASSWORD=!DB_PASSWORD!
    ) > "%CONFIG_FILE%"
)

echo [OK] Database configuration ready
echo [%date% %time%] Database config: %DB_HOST%:%DB_PORT%/%DB_NAME% >> "%LOG_FILE%" 2>&1
echo.

REM ========================================
REM Step 3: Create Database and Schema
REM ========================================
echo Step 3/4: Creating database and initializing schema...
echo [%date% %time%] Creating database >> "%LOG_FILE%" 2>&1

REM Set PostgreSQL password
set "PGPASSWORD=%DB_PASSWORD%"

REM Test connection with retry
set "RETRY_COUNT=0"
set "MAX_RETRIES=3"

:retry_connection
echo Testing PostgreSQL connection (attempt %RETRY_COUNT%/%MAX_RETRIES%)...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Connected to PostgreSQL
    echo [%date% %time%] PostgreSQL connection successful >> "%LOG_FILE%" 2>&1
    goto connection_success
)

set /a RETRY_COUNT+=1
if %RETRY_COUNT% LSS %MAX_RETRIES% (
    echo Waiting for PostgreSQL to start...
    timeout /t 5 /nobreak >nul
    goto retry_connection
)

echo [ERROR] Cannot connect to PostgreSQL
echo [%date% %time%] Connection failed after %MAX_RETRIES% attempts >> "%LOG_FILE%" 2>&1
echo.
echo Please check:
echo   1. PostgreSQL service is running
echo   2. Password is correct (default: postgres123!)
echo   3. Port 5432 is not blocked
echo.
set "PGPASSWORD="
pause
exit /b 1

:connection_success

REM Create database if it doesn't exist
echo Creating database '%DB_NAME%'...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" 2>nul | find "1" >nul
if %ERRORLEVEL% NEQ 0 (
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;" >> "%LOG_FILE%" 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo [OK] Database created
        echo [%date% %time%] Database created >> "%LOG_FILE%" 2>&1
    ) else (
        echo [ERROR] Failed to create database
        echo [%date% %time%] Database creation failed >> "%LOG_FILE%" 2>&1
        set "PGPASSWORD="
        pause
        exit /b 1
    )
) else (
    echo [OK] Database already exists
    echo [%date% %time%] Database already exists >> "%LOG_FILE%" 2>&1
)

REM Clean up password variable
set "PGPASSWORD="
echo.

REM ========================================
REM Step 4: Initialize Schema and Data
REM ========================================
echo Step 4/4: Initializing database schema and demo users...
echo [%date% %time%] Initializing schema >> "%LOG_FILE%" 2>&1

REM Create .env file
(
    echo DB_HOST=%DB_HOST%
    echo DB_PORT=%DB_PORT%
    echo DB_NAME=%DB_NAME%
    echo DB_USER=%DB_USER%
    echo DB_PASSWORD=%DB_PASSWORD%
    echo PORT=3001
    echo NODE_ENV=production
) > "%INSTALL_DIR%.env"

REM Check if node_modules exists, if not try to use bundled or skip
if not exist "%INSTALL_DIR%node_modules" (
    echo Installing dependencies...
    cd /d "%INSTALL_DIR%"
    call npm install --production --silent >> "%LOG_FILE%" 2>&1
)

REM Run database setup script
echo Running schema initialization...
cd /d "%INSTALL_DIR%"
node scripts\setup-database.js >> "%LOG_FILE%" 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Database setup complete
    echo [%date% %time%] Schema initialized successfully >> "%LOG_FILE%" 2>&1
) else (
    echo [WARNING] Database setup may have encountered issues
    echo [%date% %time%] Schema initialization had errors >> "%LOG_FILE%" 2>&1
    echo Check log file: %LOG_FILE%
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Office Management System is ready to use!
echo.
echo Demo User Credentials:
echo   Administrator: admin@demo.com / admin123
echo   Manager:       manager@demo.com / manager123
echo   Accountant:    accountant@demo.com / accountant123
echo   Secretary:     secretary@demo.com / secretary123
echo   HR Manager:    hr@demo.com / hr123
echo   Owner:         owner@demo.com / owner123
echo.
echo Database Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   Username: %DB_USER%
echo.
echo Installation log: %LOG_FILE%
echo.
echo [%date% %time%] Installation completed successfully >> "%LOG_FILE%" 2>&1

REM Don't pause if running silently
if "%1"=="-silent" (
    exit /b 0
)

timeout /t 10
exit /b 0
