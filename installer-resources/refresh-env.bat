@echo off
REM Refresh environment variables from registry
REM This allows newly installed programs to be found without restarting the terminal

for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "SysPATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "UserPATH=%%b"

if defined UserPATH (
    set "PATH=%SysPATH%;%UserPATH%"
) else (
    set "PATH=%SysPATH%"
)

exit /b 0
