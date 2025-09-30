@echo off
echo Checking PostgreSQL Installation...
echo.

where psql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] PostgreSQL is installed and in system PATH
    
    REM Get PostgreSQL version
    for /f "tokens=3" %%i in ('psql --version') do (
        echo [INFO] PostgreSQL Version: %%i
    )
    
    echo.
    echo PostgreSQL service status:
    sc query postgresql* 2>nul | find "STATE"
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] PostgreSQL service not found
        echo Make sure PostgreSQL is running
    )
    
    exit /b 0
) else (
    echo [ERROR] PostgreSQL is NOT installed or not in system PATH
    echo.
    echo To install PostgreSQL:
    echo 1. Download from: https://www.postgresql.org/download/windows/
    echo 2. Install PostgreSQL (recommended version 15 or higher)
    echo 3. Add PostgreSQL bin directory to system PATH
    echo    Example: C:\Program Files\PostgreSQL\15\bin
    echo.
    
    exit /b 1
)
