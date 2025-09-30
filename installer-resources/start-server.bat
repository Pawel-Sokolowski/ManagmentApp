@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo Office Management System
echo Starting Application Server
echo ========================================
echo.

REM Check if .env file exists
if not exist "%~dp0.env" (
    echo ERROR: Configuration file .env not found
    echo Please run setup-database.bat first
    echo.
    pause
    exit /b 1
)

REM Load environment variables from .env
for /f "usebackq tokens=1,* delims==" %%a in ("%~dp0.env") do (
    set "%%a=%%b"
)

echo [INFO] Starting backend server...
echo   Database: %DB_NAME%
echo   Host: %DB_HOST%
echo   Port: %PORT%
echo.

REM Start the Node.js server
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "%~dp0node_modules" (
    echo [INFO] Installing dependencies...
    call npm install --production
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Server is starting...
echo.
echo ========================================
echo Application is running!
echo ========================================
echo.
echo Access the application at:
echo   http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node server/index.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Server failed to start
    echo Please check the error messages above
    pause
)
