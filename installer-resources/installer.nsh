; NSIS Installer Script for Office Management System
; Provides options for Desktop or Server installation
;
; IMPORTANT: This script is INCLUDED by electron-builder's generated NSIS script.
; Do NOT define: Name, OutFile, InstallDir, RequestExecutionLevel - electron-builder sets these.
; Do NOT define standard MUI pages (MUI_PAGE_WELCOME, MUI_PAGE_DIRECTORY, etc.) - electron-builder provides these.
; Do NOT define MUI_LANGUAGE - electron-builder provides this.
; Do NOT create Section "Install" or Section "Uninstall" - use !macro customInstall and !macro customUnInstall instead.
; For details, see README.md in this directory.

!include "MUI2.nsh"
!include "LogicLib.nsh"

; Variables
Var InstallationType
Var PostgreSQLInstalled
Var SetupSuccess

; Custom page for installation type selection (inserted before directory page)
Page custom InstallationTypePageCreate InstallationTypePageLeave

; Custom page for post-installation (inserted after instfiles page)
Page custom PostInstallPageCreate

; Custom page to select installation type
Function InstallationTypePageCreate
  !insertmacro MUI_HEADER_TEXT "Select Installation Type" "Choose between Desktop Application or Server Installation"
  
  nsDialogs::Create 1018
  Pop $0
  
  ${NSD_CreateLabel} 0 0 100% 40u "Please select the type of installation:$\r$\n$\r$\nDesktop Application: For single-user workstations$\r$\nServer Installation: For multi-user server environments with Windows Service"
  Pop $0
  
  ${NSD_CreateRadioButton} 20u 60u 100% 15u "&Desktop Application (Recommended for single users)"
  Pop $1
  ${NSD_Check} $1
  
  ${NSD_CreateRadioButton} 20u 80u 100% 15u "&Server Installation (For multi-user environments)"
  Pop $2
  
  nsDialogs::Show
FunctionEnd

Function InstallationTypePageLeave
  ${NSD_GetState} $1 $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $InstallationType "Desktop"
  ${Else}
    StrCpy $InstallationType "Server"
  ${EndIf}
FunctionEnd

; Custom Install Section (runs after electron-builder's main install)
; This creates configuration files and performs additional setup
!macro customInstall
  DetailPrint "Running custom installation steps..."
  DetailPrint "Installation Type: $InstallationType"
  
  ; Create .env file based on installation type
  ${If} $InstallationType == "Server"
    DetailPrint "Configuring for Server installation..."
    FileOpen $0 "$INSTDIR\.env" w
    FileWrite $0 "DB_HOST=localhost$\r$\n"
    FileWrite $0 "DB_PORT=5432$\r$\n"
    FileWrite $0 "DB_NAME=office_management$\r$\n"
    FileWrite $0 "DB_USER=postgres$\r$\n"
    FileWrite $0 "DB_PASSWORD=postgres$\r$\n"
    FileWrite $0 "PORT=3001$\r$\n"
    FileWrite $0 "NODE_ENV=production$\r$\n"
    FileClose $0
  ${Else}
    DetailPrint "Configuring for Desktop installation..."
    FileOpen $0 "$INSTDIR\.env" w
    FileWrite $0 "DB_HOST=localhost$\r$\n"
    FileWrite $0 "DB_PORT=5432$\r$\n"
    FileWrite $0 "DB_NAME=office_management$\r$\n"
    FileWrite $0 "DB_USER=postgres$\r$\n"
    FileWrite $0 "DB_PASSWORD=postgres$\r$\n"
    FileWrite $0 "PORT=3001$\r$\n"
    FileWrite $0 "NODE_ENV=development$\r$\n"
    FileClose $0
  ${EndIf}
  
  ; Check for PostgreSQL - Enhanced detection
  DetailPrint "Checking for PostgreSQL installation..."
  StrCpy $PostgreSQLInstalled "No"
  
  ; Method 1: Check if psql is in PATH
  nsExec::ExecToStack 'cmd /c where psql 2>nul'
  Pop $0
  Pop $1
  ${If} $0 == "0"
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL found in PATH"
    Goto pg_found
  ${EndIf}
  
  ; Method 2: Check Windows Registry
  ReadRegStr $0 HKLM "SOFTWARE\PostgreSQL\Installations" "PostgreSQL"
  ${If} $0 != ""
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL found in registry: $0"
    Goto pg_found
  ${EndIf}
  
  ; Method 3: Check common installation paths
  ${If} ${FileExists} "C:\Program Files\PostgreSQL\*.*"
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL found in Program Files"
    Goto pg_found
  ${EndIf}
  
  ${If} ${FileExists} "C:\Program Files (x86)\PostgreSQL\*.*"
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL found in Program Files (x86)"
    Goto pg_found
  ${EndIf}
  
  ; Method 4: Check for pg_ctl service
  nsExec::ExecToStack 'cmd /c sc query postgresql-x64-* 2>nul'
  Pop $0
  Pop $1
  ${If} $0 == "0"
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL service found"
    Goto pg_found
  ${EndIf}
  
  ; PostgreSQL not found - show warning
  DetailPrint "PostgreSQL not found. Please install PostgreSQL 13+ manually."
  MessageBox MB_OKCANCEL "PostgreSQL is not detected on your system.$\r$\n$\r$\nYou need to install PostgreSQL 13 or higher for this application to work.$\r$\n$\r$\nThe application will help you configure the database connection on first run.$\r$\n$\r$\nClick OK to continue without PostgreSQL (you can install it later),$\r$\nor Cancel to abort installation." IDOK continue
  Abort "Installation cancelled. Please install PostgreSQL and try again."
  continue:
  
  pg_found:
  
  StrCpy $SetupSuccess "Yes"
!macroend

; Post-installation page
Function PostInstallPageCreate
  !insertmacro MUI_HEADER_TEXT "Installation Complete" "Office Management System has been installed"
  
  nsDialogs::Create 1018
  Pop $0
  
  ${If} $InstallationType == "Server"
    ${If} $PostgreSQLInstalled == "Yes"
      ${NSD_CreateLabel} 0 0 100% 70u "Installation Type: Server$\r$\n$\r$\nPostgreSQL: Detected ✓$\r$\n$\r$\nNext Steps:$\r$\n1. Launch the application$\r$\n2. Complete the Database Setup Wizard on first run$\r$\n3. Configure the application as a Windows Service (optional)$\r$\n4. Configure firewall rules for network access$\r$\n$\r$\nThe application will guide you through database configuration.$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
      Pop $0
    ${Else}
      ${NSD_CreateLabel} 0 0 100% 70u "Installation Type: Server$\r$\n$\r$\nPostgreSQL: Not detected ✗$\r$\n$\r$\nNext Steps:$\r$\n1. Install PostgreSQL 13+ from postgresql.org$\r$\n2. Launch the application$\r$\n3. Complete the Database Setup Wizard$\r$\n4. Configure the application as a Windows Service (optional)$\r$\n5. Configure firewall rules for network access$\r$\n$\r$\nThe application will guide you through database configuration.$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
      Pop $0
    ${EndIf}
  ${Else}
    ${If} $PostgreSQLInstalled == "Yes"
      ${NSD_CreateLabel} 0 0 100% 60u "Installation Type: Desktop Application$\r$\n$\r$\nPostgreSQL: Detected ✓$\r$\n$\r$\nNext Steps:$\r$\n1. Launch the application from your desktop$\r$\n2. Complete the Database Setup Wizard on first run$\r$\n$\r$\nThe application will automatically guide you through$\r$\ndatabase configuration on first launch.$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
      Pop $0
    ${Else}
      ${NSD_CreateLabel} 0 0 100% 60u "Installation Type: Desktop Application$\r$\n$\r$\nPostgreSQL: Not detected ✗$\r$\n$\r$\nNext Steps:$\r$\n1. Install PostgreSQL 13+ from postgresql.org$\r$\n2. Launch the application from your desktop$\r$\n3. Complete the Database Setup Wizard$\r$\n$\r$\nThe application will guide you through database configuration.$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
      Pop $0
    ${EndIf}
  ${EndIf}
  
  nsDialogs::Show
FunctionEnd

; Custom Uninstall actions
!macro customUnInstall
  ; Show informational message
  MessageBox MB_OK "Office Management System has been uninstalled.$\r$\n$\r$\nNote: PostgreSQL and the database were not removed.$\r$\nYou can uninstall PostgreSQL separately if needed."
!macroend

