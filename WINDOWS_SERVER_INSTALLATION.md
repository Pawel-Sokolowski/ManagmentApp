# Windows Server Installation Guide

## 🎯 **ONE Installer for Everything**

**Desktop or Server - Same installer file handles both scenarios automatically.**

---

## 📥 Download

**[Get the installer from GitHub Releases →](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)**

**Download:** `Office Management System Setup.exe`

**This ONE file installs:**
- ✅ Complete application (desktop + server)
- ✅ PostgreSQL 15 database (automatic)
- ✅ All tables and schemas (1,400+ lines SQL)
- ✅ 6 demo users with different roles
- ✅ Full configuration

---

## 🚀 Installation (3 Steps)

### For Both Desktop and Server Deployment:

**Step 1:** Right-click installer → **"Run as administrator"**

**Step 2:** Follow the installation wizard
- Choose installation directory
- Default: `C:\Program Files\Office Management System`

**Step 3:** When prompted: **Click YES** for automatic setup
- Wait 5-15 minutes for complete installation
- PostgreSQL installs automatically if needed

**🎉 Done!** Launch the application and log in.

---

## 📋 System Requirements

### Workstation/Desktop:
- **OS:** Windows 10/11 (64-bit)
- **RAM:** 4 GB minimum
- **Disk:** 10 GB free space
- **Network:** Internet (for PostgreSQL download)

### Server Deployment:
- **OS:** Windows Server 2016 or higher
- **RAM:** 8 GB recommended
- **Disk:** 10 GB free space
- **Network:** Internet (for initial PostgreSQL download)

### Permissions:
- **Administrator privileges** required for installation

---

## 🖥️ Server-Specific Setup (Optional)

After standard installation, configure as Windows Service:

### Install as Windows Service:

1. Open **PowerShell as Administrator**
2. Navigate to: `C:\Program Files\Office Management System`
3. Run: `.\install-service.ps1`

**Benefits:**
- ✅ Auto-start on server boot
- ✅ Runs in background
- ✅ Auto-restart on failure
- ✅ Service management via Windows Services

### Manage the Service:

```powershell
# Start service
Start-Service -Name OfficeManagementSystem

# Stop service
Stop-Service -Name OfficeManagementSystem

# Check status
Get-Service -Name OfficeManagementSystem
```

---

## ✅ No Scripts Needed

**You do NOT need to run:**
- ❌ `setup-database.bat`
- ❌ `one-click-setup.bat`
- ❌ `check-postgresql.bat`
- ❌ Any other batch files

**The installer handles everything automatically during installation.**

**These scripts are included only for:**
- Advanced troubleshooting
- Custom configurations
- Manual recovery scenarios

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

### Installation Issues

**Problem:** Automatic setup failed or was skipped

**Solution:**
1. Navigate to: `C:\Program Files\Office Management System`
2. Right-click `one-click-setup.bat` → "Run as administrator"
3. Wait 5-15 minutes for completion

---

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

3. Check database configuration:
   - Default credentials: postgres/postgres123!
   - Default port: 5432
   - Database name: office_management

---

### Application Won't Start

**Problem:** Application closes immediately or shows error

**Solutions:**
1. Check logs: `C:\Program Files\Office Management System\data\logs`
2. Verify PostgreSQL service is running
3. Ensure port 3001 is available
4. Try running application as Administrator

---

### Permission Errors

**Problem:** User cannot access certain features

**Solutions:**
1. Log in as administrator (admin@demo.com / admin123)
2. Go to User Management → Edit user → Permissions
3. Verify user role matches intended access level

---

### Advanced Troubleshooting Tools

**Only use these for advanced troubleshooting:**

Located in installation directory:

- `check-postgresql.bat` - Verify PostgreSQL installation and status
- `setup-database.bat` - Reinitialize database only (WARNING: destructive)
- `one-click-setup.bat` - Rerun complete setup (if installation was incomplete)

⚠️ **These tools are for troubleshooting only. Normal installation doesn't require them.**

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
