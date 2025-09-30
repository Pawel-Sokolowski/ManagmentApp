@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo Office Management System
echo Database Setup Wizard
echo ========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in system PATH
    echo.
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add PostgreSQL bin directory to system PATH:
    echo Example: C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL found in system PATH
echo.

REM Load or prompt for database configuration
set "CONFIG_FILE=%~dp0data\db-config.txt"

if exist "%CONFIG_FILE%" (
    echo Loading database configuration from: %CONFIG_FILE%
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        set "%%a=%%b"
    )
) else (
    echo Database configuration file not found.
    echo Using default values...
    set "DB_HOST=localhost"
    set "DB_PORT=5432"
    set "DB_NAME=office_management"
    set "DB_USER=postgres"
    set "DB_PASSWORD=postgres"
)

echo.
echo Current Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.

REM Prompt to change configuration
set /p "CHANGE_CONFIG=Do you want to change these settings? (y/N): "
if /i "%CHANGE_CONFIG%"=="y" (
    set /p "DB_HOST=Enter PostgreSQL host [localhost]: " || set "DB_HOST=localhost"
    set /p "DB_PORT=Enter PostgreSQL port [5432]: " || set "DB_PORT=5432"
    set /p "DB_NAME=Enter database name [office_management]: " || set "DB_NAME=office_management"
    set /p "DB_USER=Enter PostgreSQL user [postgres]: " || set "DB_USER=postgres"
    set /p "DB_PASSWORD=Enter PostgreSQL password: "
    
    REM Save configuration
    (
        echo DB_HOST=!DB_HOST!
        echo DB_PORT=!DB_PORT!
        echo DB_NAME=!DB_NAME!
        echo DB_USER=!DB_USER!
        echo DB_PASSWORD=!DB_PASSWORD!
    ) > "%CONFIG_FILE%"
    echo Configuration saved to: %CONFIG_FILE%
    REM Restrict configuration file permissions to current user
    icacls "%CONFIG_FILE%" /inheritance:r /grant:r "%USERNAME%:R"
)

echo.
echo ========================================
echo Creating Database and Schema
echo ========================================
echo.

REM Set PostgreSQL password environment variable
set "PGPASSWORD=%DB_PASSWORD%"

REM Check PostgreSQL connection
echo Testing PostgreSQL connection...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT version();" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cannot connect to PostgreSQL
    echo Please check your credentials and ensure PostgreSQL is running
    echo.
    pause
    exit /b 1
)
echo [OK] Successfully connected to PostgreSQL
echo.

REM Create database if it doesn't exist
echo Creating database '%DB_NAME%'...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" | find "1" >nul
if %ERRORLEVEL% NEQ 0 (
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;"
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Database created successfully
    ) else (
        echo ERROR: Failed to create database
        pause
        exit /b 1
    )
) else (
    echo [INFO] Database already exists
)
echo.

REM Install Node.js dependencies (if not installed)
if not exist "%~dp0node_modules" (
    echo Installing Node.js dependencies...
    cd /d "%~dp0"
    call npm install --production
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Node.js dependencies
        echo Please ensure Node.js is installed
        pause
        exit /b 1
    )
)

REM Create .env file
echo Creating environment configuration...
(
    echo DB_HOST=%DB_HOST%
    echo DB_PORT=%DB_PORT%
    echo DB_NAME=%DB_NAME%
    echo DB_USER=%DB_USER%
    echo DB_PASSWORD=%DB_PASSWORD%
    echo PORT=3001
    echo NODE_ENV=production
) > "%~dp0.env"
echo [OK] Environment configuration created
echo.

REM Run database schema setup
echo Initializing database schema and demo data...
cd /d "%~dp0"
node scripts\setup-database.js
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database Setup Complete!
    echo ========================================
    echo.
    echo Demo Users Created:
    echo   Administrator: admin@demo.com / admin123
    echo   Manager:       manager@demo.com / manager123
    echo   Accountant:    accountant@demo.com / accountant123
    echo   Secretary:     secretary@demo.com / secretary123
    echo   HR Manager:    hr@demo.com / hr123
    echo   Owner:         owner@demo.com / owner123
    echo.
    echo You can now start the application!
    echo.
) else (
    echo ERROR: Database setup failed
    echo Please check the error messages above
    echo.
)

REM Clean up environment variable
set "PGPASSWORD="

pause
