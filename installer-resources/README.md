# Installer Resources

## ⚠️ **You Probably Don't Need These Scripts**

**If you used the ONE-CLICK installer (recommended), everything is already set up.**

These scripts are included for:
- Advanced troubleshooting scenarios
- Custom configurations
- Manual recovery procedures
- Development and testing

**Standard installation requires ZERO manual script execution.**

---

## About This Directory

This directory contains scripts and resources used by the installer for automatic setup.

The installer runs these scripts automatically during installation when you click YES for automatic setup.

---

## Files

### Windows Batch Scripts

#### `one-click-setup.bat` ⚡ NEW!
**Complete automatic installation script** that handles everything in one go:
- Detects and installs PostgreSQL if needed
- Creates the database automatically
- Initializes all schemas and tables
- Sets up demo users
- Configures application settings

**Usage:**
```batch
one-click-setup.bat
# Or for silent operation during installation:
one-click-setup.bat -silent
```

**What it does:**
1. Checks for PostgreSQL installation
2. Runs automatic PostgreSQL installer if needed
3. Creates database with default settings
4. Initializes complete schema (1,400+ lines SQL)
5. Creates 6 demo users with permissions
6. Generates .env configuration file

**Default credentials:**
- Database: office_management
- User: postgres
- Password: postgres123!

#### `setup-database.bat`
Interactive database setup wizard for Windows. This script:
- Checks if PostgreSQL is installed
- Prompts for database connection details
- Creates the database if it doesn't exist
- Initializes the database schema
- Creates 6 demo users with different permission levels
- Configures the `.env` file with database credentials

**Usage:**
```batch
setup-database.bat
```

#### `check-postgresql.bat`
Verifies PostgreSQL installation and service status.

**Usage:**
```batch
check-postgresql.bat
```

#### `start-server.bat`
Starts the application server. Can be used for manual server startup or as a service wrapper.

**Usage:**
```batch
start-server.bat
```

#### `refresh-env.bat`
Helper script to refresh environment variables from registry without restarting the terminal.

**Usage:**
```batch
refresh-env.bat
```

### PowerShell Scripts

#### `install-postgresql.ps1` ⚡ NEW!
**Automatic PostgreSQL installer** that downloads and installs PostgreSQL silently with predefined settings.

**Features:**
- Downloads PostgreSQL 15.x automatically
- Silent installation with no user interaction required
- Configures PostgreSQL with sensible defaults
- Adds PostgreSQL to system PATH
- Verifies installation and service status

**Usage:**
```powershell
# Run as Administrator
.\install-postgresql.ps1

# Custom installation path
.\install-postgresql.ps1 -InstallDir "C:\PostgreSQL\15" -Password "mypassword"
```

**Default Settings:**
- Port: 5432
- Password: postgres123!
- Locale: en_US.UTF-8
- Service name: postgresql

#### `install-service.ps1`
Installs the application as a Windows Service for automatic startup on boot.

**Requirements:**
- Administrator privileges
- NSSM (Non-Sucking Service Manager) - Download from https://nssm.cc/download

**Usage:**
```powershell
# Run as Administrator
.\install-service.ps1
```

**Features:**
- Automatic service installation with NSSM
- Environment variable configuration
- Log rotation setup
- Fallback to scheduled task if NSSM is not available

### NSIS Installer Script

#### `installer.nsh`
Custom NSIS script included in the electron-builder installation process.

**NEW Features:**
- **One-click automatic setup** during installation
- Automatic PostgreSQL installation option
- Database setup runs during installer
- Progress dialogs for setup steps
- Graceful handling of existing PostgreSQL installations
- Error reporting and logging

**Previous Features:**
- PostgreSQL installation detection
- Automatic prompt for PostgreSQL download if not installed
- Option to run database setup during installation
- Creates data directories for application
- Copies setup scripts to installation directory

## Installation Process

### One-Click Automatic Installation (Recommended) ⚡

The installer now provides **true one-click installation**:

1. **Download and Run Installer**
   ```
   Office Management System Setup.exe
   ```

2. **Follow Installation Wizard**
   - Choose installation directory
   - Click through the standard installation steps

3. **Automatic Setup**
   - When prompted: "Would you like to run the automatic setup now?"
   - Click **YES** (recommended)
   - The installer will automatically:
     - Install PostgreSQL if not present (5-10 minutes)
     - Create the database
     - Initialize all schemas and tables
     - Set up demo users
     - Configure application settings
   - **Total time: 5-15 minutes**

4. **Done!**
   - Application is ready to use immediately
   - Launch from Start Menu or Desktop
   - Log in with demo credentials

### Manual Setup Options

If you prefer manual control:

**Option A: Run one-click setup later**
- Navigate to installation folder
- Right-click `one-click-setup.bat` and run as administrator

**Option B: Step-by-step setup**
1. Install PostgreSQL manually (if needed)
2. Run `setup-database.bat` from installation folder
3. Follow the interactive prompts

**Option C: Use individual scripts**
- `check-postgresql.bat` - Verify PostgreSQL
- `install-postgresql.ps1` - Install PostgreSQL automatically
- `setup-database.bat` - Configure database only

### Windows Service Installation

For production server deployment:

1. **Complete Standard Installation First**

2. **Run Service Installer**
   ```powershell
   # Navigate to installation directory
   cd "C:\Program Files\Office Management System"
   
   # Run as Administrator
   .\install-service.ps1
   ```

3. **Service Management**
   ```powershell
   # Start service
   Start-Service -Name OfficeManagementSystem
   
   # Stop service
   Stop-Service -Name OfficeManagementSystem
   
   # Check status
   Get-Service -Name OfficeManagementSystem
   ```

## Building the Installer

From the project root:

```bash
# Install dependencies
npm install

# Build Windows installer
npm run dist-win
```

This creates:
- `dist-electron/Office Management System Setup X.X.X.exe` - Full installer
- `dist-electron/Office Management System-X.X.X-portable.exe` - Portable version

## Included in Installer

The Windows installer automatically includes:
- Application binaries
- Backend server (`server/`)
- Database schema files (`src/database/`)
- Setup scripts (`scripts/`)
- **NEW:** One-click setup script (`one-click-setup.bat`)
- **NEW:** PostgreSQL installer script (`install-postgresql.ps1`)
- **NEW:** Environment refresh helper (`refresh-env.bat`)
- Windows batch scripts for database setup
- `.env.example` template

## Post-Installation Files

After installation, these files are created:
- `.env` - Environment configuration (created by setup-database.bat)
- `data/` - Application data directory
- `data/database/` - Local database-related data
- `data/logs/` - Application and service logs
- `data/db-config.txt` - Database configuration backup

## Environment Variables

The `.env` file contains:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=office_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=production
```

## Troubleshooting

### PostgreSQL Not Found
- Install PostgreSQL from: https://www.postgresql.org/download/windows/
- Add PostgreSQL bin directory to system PATH
- Run `check-postgresql.bat` to verify

### Service Won't Start
- Check logs in `data/logs/` or installation directory `logs/`
- Verify database is running: `pg_ctl status`
- Ensure `.env` file exists and has correct credentials
- Check port 3001 is not in use: `netstat -ano | findstr :3001`

### Database Setup Fails
- Verify PostgreSQL password is correct
- Ensure PostgreSQL service is running
- Check database user has CREATE DATABASE permission
- Review error messages in console output

## Security Notes

### Production Deployment
- Change all demo user passwords immediately
- Use strong PostgreSQL password
- Configure firewall rules for port 3001
- Consider using HTTPS with reverse proxy (IIS, nginx)
- Enable Windows Firewall rules appropriately

### Service Account
The Windows Service runs as SYSTEM by default. For better security:
1. Create a dedicated service account
2. Grant necessary permissions to the account
3. Update service to run as that account

## Demo Users

The database setup creates these users:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Administrator | admin@demo.com | admin123 | Full system access |
| Manager | manager@demo.com | manager123 | Management functions |
| Accountant | accountant@demo.com | accountant123 | Financial operations |
| Secretary | secretary@demo.com | secretary123 | Administrative tasks |
| HR Manager | hr@demo.com | hr123 | Human resources |
| Owner | owner@demo.com | owner123 | Business owner |

**⚠️ Change these passwords in production!**

## Additional Resources

- [Windows Server Installation Guide](../WINDOWS_SERVER_INSTALLATION.md)
- [Database Setup Guide](../src/database/DATABASE_SETUP_GUIDE.md)
- [Main README](../README.md)
- [NSSM Documentation](https://nssm.cc/)

## Support

For issues or questions:
- Check troubleshooting section above
- Review installation guide
- Submit issue on GitHub
- Check application logs

---

**Version:** 1.0.0  
**Platform:** Windows 10/11, Windows Server 2016+
