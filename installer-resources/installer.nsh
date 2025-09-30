; Custom NSIS installer script for Office Management System
; This script handles automatic PostgreSQL installation and configuration

!macro customInstall
  ; Create data directory for application
  CreateDirectory "$INSTDIR\data"
  CreateDirectory "$INSTDIR\data\database"
  CreateDirectory "$INSTDIR\data\logs"
  
  ; Copy all setup scripts
  File /oname=$INSTDIR\setup-database.bat "${BUILD_RESOURCES_DIR}\setup-database.bat"
  File /oname=$INSTDIR\check-postgresql.bat "${BUILD_RESOURCES_DIR}\check-postgresql.bat"
  File /oname=$INSTDIR\one-click-setup.bat "${BUILD_RESOURCES_DIR}\one-click-setup.bat"
  File /oname=$INSTDIR\install-postgresql.ps1 "${BUILD_RESOURCES_DIR}\install-postgresql.ps1"
  File /oname=$INSTDIR\refresh-env.bat "${BUILD_RESOURCES_DIR}\refresh-env.bat"
  
  ; Create config file with default database settings
  FileOpen $0 "$INSTDIR\data\db-config.txt" w
  FileWrite $0 "DB_HOST=localhost$\r$\n"
  FileWrite $0 "DB_PORT=5432$\r$\n"
  FileWrite $0 "DB_NAME=office_management$\r$\n"
  FileWrite $0 "DB_USER=postgres$\r$\n"
  FileWrite $0 "DB_PASSWORD=postgres123!$\r$\n"
  FileClose $0
  
  ; Display one-click setup dialog
  MessageBox MB_YESNO|MB_ICONQUESTION "Office Management System - Automatic Setup$\n$\nWould you like to run the automatic setup now?$\n$\nThis will:$\n1. Install PostgreSQL (if not already installed)$\n2. Create the database$\n3. Initialize all tables and schemas$\n4. Create demo users$\n$\nThis process takes 5-15 minutes.$\n$\nClick YES for automatic setup (recommended)$\nClick NO to set up manually later" IDYES run_auto_setup IDNO skip_auto_setup
  
  run_auto_setup:
  ; Show progress message
  DetailPrint "Running automatic setup..."
  DetailPrint "This may take several minutes. Please wait..."
  
  ; Run one-click setup with elevated privileges
  nsExec::ExecToLog '"$INSTDIR\one-click-setup.bat" -silent'
  Pop $0
  
  ${If} $0 == 0
    DetailPrint "Automatic setup completed successfully!"
    MessageBox MB_OK|MB_ICONINFORMATION "Setup Complete!$\n$\nOffice Management System is ready to use.$\n$\nDemo credentials:$\n  admin@demo.com / admin123$\n  manager@demo.com / manager123$\n$\nSee the installation folder for more user accounts."
  ${Else}
    DetailPrint "Automatic setup encountered issues."
    MessageBox MB_OK|MB_ICONWARNING "Setup completed with warnings.$\n$\nYou may need to run 'setup-database.bat' manually.$\n$\nCheck the log file in the data\logs folder for details."
  ${EndIf}
  Goto end_setup
  
  skip_auto_setup:
  MessageBox MB_OK|MB_ICONINFORMATION "Manual Setup Required$\n$\nTo complete installation:$\n$\n1. Run 'one-click-setup.bat' from the installation folder$\n   OR$\n2. Run 'setup-database.bat' if PostgreSQL is already installed$\n$\nSee WINDOWS_SERVER_INSTALLATION.md for detailed instructions."
  
  end_setup:
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
