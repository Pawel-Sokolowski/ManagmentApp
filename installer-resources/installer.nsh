; Custom NSIS installer script for Office Management System
; This script handles PostgreSQL installation and configuration

!macro customInstall
  ; Create data directory for application
  CreateDirectory "$INSTDIR\data"
  CreateDirectory "$INSTDIR\data\database"
  CreateDirectory "$INSTDIR\data\logs"
  
  ; Copy database setup script
  File /oname=$INSTDIR\setup-database.bat "${BUILD_RESOURCES_DIR}\setup-database.bat"
  File /oname=$INSTDIR\check-postgresql.bat "${BUILD_RESOURCES_DIR}\check-postgresql.bat"
  
  ; Create config file with default database settings
  FileOpen $0 "$INSTDIR\data\db-config.txt" w
  FileWrite $0 "DB_HOST=localhost$\r$\n"
  FileWrite $0 "DB_PORT=5432$\r$\n"
  FileWrite $0 "DB_NAME=office_management$\r$\n"
  FileWrite $0 "DB_USER=postgres$\r$\n"
  FileWrite $0 "DB_PASSWORD=postgres$\r$\n"
  FileClose $0
  
  ; Display PostgreSQL setup instructions
  MessageBox MB_OKCANCEL|MB_ICONINFORMATION "PostgreSQL Database Setup Required$\n$\nThe application requires PostgreSQL 13 or higher.$\n$\nSetup Options:$\n1. If PostgreSQL is already installed, click OK to continue$\n2. If not installed, click Cancel to download PostgreSQL first$\n$\nAfter installation completes:$\n- Run 'setup-database.bat' in the installation folder$\n- Or use the application's built-in database setup wizard" IDOK skip_download
  
  ; User chose to download PostgreSQL
  ExecShell "open" "https://www.postgresql.org/download/windows/"
  Goto end_postgres_setup
  
  skip_download:
  ; Check if PostgreSQL is available
  nsExec::ExecToStack 'cmd /c where psql > nul 2>&1 && echo FOUND || echo NOT_FOUND'
  Pop $0
  Pop $1
  
  ${If} $1 == "NOT_FOUND"
    MessageBox MB_OK|MB_ICONEXCLAMATION "PostgreSQL not found in system PATH.$\n$\nPlease ensure PostgreSQL is installed and added to system PATH.$\n$\nYou can run 'setup-database.bat' from the installation folder after installing PostgreSQL."
  ${Else}
    MessageBox MB_YESNO|MB_ICONQUESTION "PostgreSQL found! Would you like to run the database setup now?$\n$\n(You can also run 'setup-database.bat' later)" IDYES run_setup IDNO skip_setup
    
    run_setup:
    ; Run database setup in background
    ExecShell "open" "$INSTDIR\setup-database.bat"
    
    skip_setup:
  ${EndIf}
  
  end_postgres_setup:
!macroend

!macro customUnInstall
  ; Clean up data directory
  RMDir /r "$INSTDIR\data"
!macroend

; Add custom page for database configuration
!macro customPage
  ; This would add a custom page to configure database during installation
  ; For simplicity, we're using batch scripts instead
!macroend
