# Windows Server Installation Guide

## Quick Installation for Windows Server

This guide provides step-by-step instructions for deploying the Office Management System on a Windows Server with PostgreSQL database.

---

## 📋 Prerequisites

### System Requirements
- **Windows Server 2016 or higher** (or Windows 10/11 for testing)
- **4 GB RAM minimum** (8 GB recommended)
- **10 GB free disk space**
- **Administrator privileges**

### Required Software
1. **PostgreSQL 13+** - Database server
2. **Node.js 18+** - For running the setup script (comes with installer)

---

## 🚀 Installation Steps

### Option 1: Quick Install (Recommended)

1. **Download the installer**
   - Get `Office Management System Setup.exe` from the releases page
   - Save to a location like `C:\Downloads`

2. **Run the installer**
   - Right-click the installer and select "Run as administrator"
   - Follow the installation wizard
   - Choose installation directory (default: `C:\Program Files\Office Management System`)

3. **PostgreSQL Setup**
   - If PostgreSQL is not installed, the installer will prompt you to download it
   - Download from: https://www.postgresql.org/download/windows/
   - Install PostgreSQL with default settings
   - **Remember the password you set for the postgres user!**

4. **Database Initialization**
   - After installation, navigate to the installation folder
   - Run `setup-database.bat` as administrator
   - Follow the prompts to configure database connection
   - The script will:
     - Create the `office_management` database
     - Initialize all tables and schemas
     - Create 6 demo users with different permission levels
     - Insert sample data

5. **Start the application**
   - Launch "Office Management System" from Start Menu or Desktop
   - Log in with one of the demo accounts (see credentials below)

---

### Option 2: Manual Installation

If you need more control over the installation process:

1. **Install PostgreSQL**
   ```powershell
   # Download and install PostgreSQL 15
   # Set postgres user password during installation
   # Add PostgreSQL bin to system PATH
   ```

2. **Install Node.js** (if not already installed)
   ```powershell
   # Download from: https://nodejs.org/
   # Install LTS version (18.x or higher)
   ```

3. **Extract Application Files**
   - Extract the portable version to your preferred location
   - Example: `C:\OfficeManagement`

4. **Configure Database Connection**
   - Copy `.env.example` to `.env`
   - Edit `.env` with your database credentials:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=office_management
     DB_USER=postgres
     DB_PASSWORD=your_postgres_password
     PORT=3001
     NODE_ENV=production
     ```

5. **Run Database Setup**
   ```powershell
   cd C:\OfficeManagement
   .\setup-database.bat
   ```

6. **Start the Application**
   ```powershell
   .\Office Management System.exe
   ```

---

## 👥 Demo User Accounts

The system creates 6 demo users with different roles and permissions:

### 1. Administrator (Full Access)
- **Email:** admin@demo.com
- **Password:** admin123
- **Role:** administrator
- **Permissions:** Full system access, user management, all modules

### 2. Office Manager
- **Email:** manager@demo.com
- **Password:** manager123
- **Role:** zarzadzanie (Management)
- **Permissions:** Client management, calendar, documents, limited reports

### 3. Chief Accountant
- **Email:** accountant@demo.com
- **Password:** accountant123
- **Role:** ksiegowa (Accountant)
- **Permissions:** Invoices, payments, financial reports, client data

### 4. Secretary
- **Email:** secretary@demo.com
- **Password:** secretary123
- **Role:** sekretariat (Secretary)
- **Permissions:** Calendar, basic client info, documents, limited access

### 5. HR Manager
- **Email:** hr@demo.com
- **Password:** hr123
- **Role:** kadrowa (HR)
- **Permissions:** User management, documents, calendar, reports

### 6. Company Owner
- **Email:** owner@demo.com
- **Password:** owner123
- **Role:** wlasciciel (Owner)
- **Permissions:** All modules except system administration

**⚠️ IMPORTANT:** Change these passwords immediately after first login in a production environment!

---

## 🔧 Configuration

### Database Configuration

The database can be configured through:

1. **Interactive Setup Script**
   - Run `setup-database.bat`
   - Follow prompts to enter connection details

2. **Manual Configuration**
   - Edit `.env` file in installation directory
   - Update database credentials
   - Restart the application

3. **Configuration File Location**
   - Installation directory: `C:\Program Files\Office Management System\.env`
   - Portable version: `.\Office Management System\.env`

### Network Configuration

For server deployment with remote access:

1. **Configure Windows Firewall**
   ```powershell
   # Allow incoming connections on port 3001
   New-NetFirewallRule -DisplayName "Office Management System" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
   ```

2. **Update Backend Configuration**
   - Edit `server/index.js` if needed to bind to specific IP
   - Or use environment variable: `HOST=0.0.0.0`

3. **Client Access**
   - Clients can access via: `http://server-ip:3001`
   - For production, consider setting up HTTPS with reverse proxy

---

## 🔐 Security Recommendations

### For Production Deployment

1. **Change Default Passwords**
   - Log in as admin and change all demo user passwords
   - Remove unused demo accounts

2. **Secure Database**
   - Use strong PostgreSQL password
   - Configure `pg_hba.conf` to limit connections
   - Enable SSL for database connections

3. **Network Security**
   - Use HTTPS (configure reverse proxy with SSL certificate)
   - Implement firewall rules
   - Use VPN for remote access

4. **Regular Updates**
   - Keep PostgreSQL updated
   - Monitor application logs
   - Regular database backups

---

## 🔍 Troubleshooting

### PostgreSQL Connection Issues

**Problem:** Cannot connect to database

**Solutions:**
1. Verify PostgreSQL is running:
   ```powershell
   # Check service status
   Get-Service postgresql*
   
   # Start service if stopped
   Start-Service postgresql-x64-15
   ```

2. Test connection manually:
   ```powershell
   psql -h localhost -U postgres -d office_management
   ```

3. Check firewall settings
4. Verify credentials in `.env` file

### Application Won't Start

**Problem:** Application closes immediately or shows error

**Solutions:**
1. Check logs in installation directory: `data\logs`
2. Verify Node.js dependencies are installed
3. Run `check-postgresql.bat` to verify database
4. Ensure port 3001 is not in use by another application

### Permission Errors

**Problem:** User cannot access certain features

**Solutions:**
1. Log in as administrator
2. Check user permissions in system settings
3. Verify user role matches intended access level
4. Review database table `user_permissions`

---

## 📊 Module Permissions

The system uses role-based access control with module-specific permissions:

### Available Modules
- **clients** - Client management
- **invoices** - Invoice and payment management
- **calendar** - Calendar and scheduling
- **chat** - Team communication
- **documents** - Document management
- **reports** - Analytics and reporting
- **users** - User management
- **settings** - System configuration

### Permission Levels
- **read** - View only
- **write** - Create and edit
- **delete** - Remove records
- **admin** - Full control including configuration

### Default Role Permissions

| Module | Admin | Manager | Accountant | Secretary | HR | Owner |
|--------|-------|---------|------------|-----------|-------|-------|
| Clients | RWDA | RWD | RW | RW | R | RWD |
| Invoices | RWDA | RW | RWD | R | - | RWD |
| Calendar | RWDA | RWD | RW | RWD | RW | RWD |
| Chat | RWDA | RW | RW | RW | RW | RW |
| Documents | RWDA | RWD | RW | RW | RW | RWD |
| Reports | RWDA | RW | RW | - | R | RW |
| Users | RWDA | R | - | - | RW | RW |
| Settings | RWDA | - | - | - | - | RW |

**Legend:** R=Read, W=Write, D=Delete, A=Admin

---

## 🔄 Database Maintenance

### Backup

Create regular backups of the database:

```powershell
# Manual backup
set PGPASSWORD=your_password
pg_dump -h localhost -U postgres office_management > backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql

# Restore from backup
psql -h localhost -U postgres office_management < backup_20240101.sql
```

### Scheduled Backups

Set up Windows Task Scheduler for automatic backups:

1. Create backup script: `backup-database.bat`
2. Add to Task Scheduler
3. Schedule daily execution
4. Store backups in secure location

---

## 📞 Support and Resources

### Documentation
- Installation Guide: This document
- Database Schema: `src/database/DATABASE_SETUP_GUIDE.md`
- API Documentation: `server/README.md` (if available)

### Common Tasks
- Add new user: Admin panel → Users → Add User
- Grant permissions: Admin panel → Users → Edit User → Permissions
- View logs: Installation directory → `data/logs`
- Backup database: Run backup script

### For Developers
- Repository: https://github.com/Pawel-Sokolowski/ManagmentApp
- Issue tracker: GitHub Issues
- Build from source: See README.md

---

## 🎉 Post-Installation

After successful installation:

1. **Log in as administrator** (admin@demo.com)
2. **Change admin password** in settings
3. **Create real user accounts** for your team
4. **Remove demo users** (or change their passwords)
5. **Configure company settings** (name, logo, etc.)
6. **Import client data** (if migrating from another system)
7. **Set up regular backups**
8. **Train users** on the system

---

## ✅ Installation Verification

Run through this checklist to verify installation:

- [ ] PostgreSQL is running
- [ ] Database `office_management` exists
- [ ] Application starts without errors
- [ ] Can log in with admin credentials
- [ ] Can access all modules
- [ ] Can create a test client
- [ ] Can create a test invoice
- [ ] Other users can log in with their credentials
- [ ] Permissions work correctly (test with different user roles)

If all checks pass, your installation is complete and ready for use!

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Platform:** Windows Server 2016+, Windows 10/11
