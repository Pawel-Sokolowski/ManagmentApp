; NSIS Installer Script for Office Management System
; Provides options for Desktop or Server installation

!include "MUI2.nsh"
!include "LogicLib.nsh"

; Installer name and settings
Name "Office Management System"
OutFile "Office-Management-System-Setup.exe"
InstallDir "$PROGRAMFILES\Office Management System"
RequestExecutionLevel admin

; Variables
Var InstallationType
Var PostgreSQLInstalled
Var SetupSuccess

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME

; Custom page for installation type selection
Page custom InstallationTypePageCreate InstallationTypePageLeave

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

; Custom page for post-installation
Page custom PostInstallPageCreate

!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

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

; Main installation section
Section "Install"
  SetOutPath "$INSTDIR"
  
  DetailPrint "Installing Office Management System..."
  DetailPrint "Installation Type: $InstallationType"
  
  ; Copy application files (these would be populated by electron-builder)
  File /r "${BUILD_RESOURCES_DIR}\*.*"
  
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
  
  ; Check for PostgreSQL
  DetailPrint "Checking for PostgreSQL installation..."
  nsExec::ExecToStack 'cmd /c where psql'
  Pop $0
  Pop $1
  
  ${If} $0 == "0"
    StrCpy $PostgreSQLInstalled "Yes"
    DetailPrint "PostgreSQL is already installed"
  ${Else}
    StrCpy $PostgreSQLInstalled "No"
    DetailPrint "PostgreSQL not found. Please install PostgreSQL 13+ manually."
    MessageBox MB_OKCANCEL "PostgreSQL is not installed.$\r$\n$\r$\nYou need to install PostgreSQL 13 or higher for this application to work.$\r$\n$\r$\nClick OK to continue without PostgreSQL (you'll need to install it later),$\r$\nor Cancel to abort installation." IDOK continue
    Abort "Installation cancelled. Please install PostgreSQL and try again."
    continue:
  ${EndIf}
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Create shortcuts based on installation type
  ${If} $InstallationType == "Desktop"
    DetailPrint "Creating desktop shortcut..."
    CreateShortCut "$DESKTOP\Office Management System.lnk" "$INSTDIR\Office Management System.exe"
    CreateDirectory "$SMPROGRAMS\Office Management System"
    CreateShortCut "$SMPROGRAMS\Office Management System\Office Management System.lnk" "$INSTDIR\Office Management System.exe"
    CreateShortCut "$SMPROGRAMS\Office Management System\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  ${Else}
    DetailPrint "Server installation - skipping desktop shortcuts..."
    CreateDirectory "$SMPROGRAMS\Office Management System"
    CreateShortCut "$SMPROGRAMS\Office Management System\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  ${EndIf}
  
  ; Write registry keys for uninstaller
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem" "DisplayName" "Office Management System"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem" "Publisher" "Office Management System"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem" "DisplayVersion" "1.0.0"
  
  StrCpy $SetupSuccess "Yes"
SectionEnd

; Post-installation page
Function PostInstallPageCreate
  !insertmacro MUI_HEADER_TEXT "Installation Complete" "Office Management System has been installed"
  
  nsDialogs::Create 1018
  Pop $0
  
  ${If} $InstallationType == "Server"
    ${NSD_CreateLabel} 0 0 100% 60u "Installation Type: Server$\r$\n$\r$\nNext Steps:$\r$\n1. Ensure PostgreSQL is installed and running$\r$\n2. Initialize the database using the provided schema files$\r$\n3. Configure the application as a Windows Service (optional)$\r$\n4. Configure firewall rules for network access$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
    Pop $0
  ${Else}
    ${NSD_CreateLabel} 0 0 100% 50u "Installation Type: Desktop Application$\r$\n$\r$\nNext Steps:$\r$\n1. Ensure PostgreSQL is installed and running$\r$\n2. Initialize the database using the provided schema files$\r$\n3. Launch the application from your desktop$\r$\n$\r$\nFor detailed instructions, see INSTALLATION_GUIDE.md"
    Pop $0
  ${EndIf}
  
  nsDialogs::Show
FunctionEnd

; Uninstaller section
Section "Uninstall"
  ; Remove files
  Delete "$INSTDIR\*.*"
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\Office Management System.lnk"
  RMDir /r "$SMPROGRAMS\Office Management System"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OfficeManagementSystem"
  
  MessageBox MB_OK "Office Management System has been uninstalled.$\r$\n$\r$\nNote: PostgreSQL and the database were not removed.$\r$\nYou can uninstall PostgreSQL separately if needed."
SectionEnd
