# Installer Resources

This directory contains scripts and resources for creating and managing Windows installers for the Office Management System.

## Files

### Windows Batch Scripts

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

### PowerShell Scripts

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

**Features:**
- PostgreSQL installation detection
- Automatic prompt for PostgreSQL download if not installed
- Option to run database setup during installation
- Creates data directories for application
- Copies setup scripts to installation directory

## Installation Process

### Standard Installation (Using Installer)

1. **Download and Run Installer**
   ```
   Office Management System Setup.exe
   ```

2. **Follow Installation Wizard**
   - Choose installation directory
   - Allow elevation for PostgreSQL check
   - Install or confirm PostgreSQL installation

3. **Database Setup**
   - After installation, run `setup-database.bat` from installation folder
   - Or use the application's built-in setup wizard

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
