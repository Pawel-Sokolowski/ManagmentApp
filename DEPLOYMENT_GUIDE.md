# Windows Server Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Office Management System on a production Windows Server environment.

## Deployment Scenarios

### Scenario 1: Single Server Deployment (Recommended for Small Teams)
- Windows Server hosts both application and database
- Suitable for up to 50 concurrent users
- Simpler to manage and maintain

### Scenario 2: Separate Database Server (Enterprise)
- Application server and database server on separate machines
- Better performance and scalability
- Recommended for 50+ concurrent users

## Pre-Deployment Checklist

### Server Requirements

**Application Server:**
- Windows Server 2016 or higher
- 4 GB RAM (8 GB recommended)
- 2 CPU cores (4 cores recommended)
- 20 GB free disk space
- Static IP address or domain name

**Database Server (if separate):**
- Windows Server 2016 or higher
- 8 GB RAM (16 GB recommended)
- 4 CPU cores
- 50 GB free disk space (SSD recommended)
- Dedicated backup storage

### Network Configuration
- [ ] Firewall rules configured
- [ ] Ports opened: 3001 (application), 5432 (PostgreSQL)
- [ ] DNS configured (if using domain name)
- [ ] SSL certificate obtained (if using HTTPS)

### Software Prerequisites
- [ ] PostgreSQL 13 or higher installed
- [ ] Windows Updates current
- [ ] Antivirus exclusions configured (if needed)
- [ ] Administrator access available

## Deployment Steps

### Step 1: Prepare the Server

#### Update Windows Server
```powershell
# Check for updates
Get-WindowsUpdate

# Install updates
Install-WindowsUpdate -AcceptAll -AutoReboot
```

#### Configure Windows Firewall
```powershell
# Open PowerShell as Administrator

# Allow PostgreSQL (if accessed remotely)
New-NetFirewallRule -DisplayName "PostgreSQL Database" `
  -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow

# Allow Application Server
New-NetFirewallRule -DisplayName "Office Management System" `
  -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow

# If using HTTPS
New-NetFirewallRule -DisplayName "HTTPS" `
  -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

#### Create Service Account (Optional but Recommended)
```powershell
# Create dedicated service account
$Password = ConvertTo-SecureString "SecurePassword123!" -AsPlainText -Force
New-LocalUser -Name "OfficeAppSvc" -Password $Password -FullName "Office App Service" -Description "Service account for Office Management System"

# Add to appropriate groups
Add-LocalGroupMember -Group "Users" -Member "OfficeAppSvc"
```

### Step 2: Install PostgreSQL

#### Download and Install
1. Download PostgreSQL 15 from: https://www.postgresql.org/download/windows/
2. Run installer
3. Set strong password for `postgres` user (save securely!)
4. Choose default port: 5432
5. Complete installation

#### Configure PostgreSQL for Production
```powershell
# Locate PostgreSQL configuration directory
# Typically: C:\Program Files\PostgreSQL\15\data

# Edit postgresql.conf
# Set these parameters:
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

#### Configure pg_hba.conf for Security
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# Local connections
local   all             all                                     scram-sha-256
# IPv4 local connections
host    all             all             127.0.0.1/32            scram-sha-256
# IPv6 local connections
host    all             all             ::1/128                 scram-sha-256
# Remote connections (only if database is on separate server)
# host    office_management    postgres      10.0.0.0/24         scram-sha-256
```

#### Restart PostgreSQL
```powershell
Restart-Service postgresql-x64-15
```

### Step 3: Install the Application

#### Using the Installer
1. Copy `Office Management System Setup.exe` to the server
2. Run as Administrator
3. Choose installation directory: `C:\Program Files\Office Management System`
4. Complete installation

#### Verify Installation
```powershell
cd "C:\Program Files\Office Management System"
dir

# Should see:
# - Office Management System.exe
# - setup-database.bat
# - check-postgresql.bat
# - start-server.bat
# - install-service.ps1
# - server/ directory
# - scripts/ directory
# - documentation files
```

### Step 4: Configure Database

#### Run Database Setup
```powershell
cd "C:\Program Files\Office Management System"

# Run setup as Administrator
.\setup-database.bat
```

**During Setup:**
1. Confirm PostgreSQL is detected
2. Enter database credentials:
   - Host: localhost (or IP if remote database)
   - Port: 5432
   - Database: office_management
   - User: postgres
   - Password: [your strong password]
3. Wait for schema initialization
4. Note the 6 demo user credentials displayed

#### Verify Database Setup
```powershell
# Connect to database
psql -h localhost -U postgres -d office_management

# List tables
\dt

# Check users
SELECT email, role, is_active FROM users;

# Exit
\q
```

### Step 5: Configure Application

#### Review .env Configuration
```powershell
cd "C:\Program Files\Office Management System"
notepad .env
```

**Verify/Update Settings:**
```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=office_management
DB_USER=postgres
DB_PASSWORD=your_secure_password
PORT=3001
NODE_ENV=production
```

#### Test Application Manually
```powershell
# Start server manually for testing
.\start-server.bat

# In another PowerShell window, test
Invoke-WebRequest -Uri "http://localhost:3001/api/health"

# Should return: {"status":"healthy","database":"connected"}
```

### Step 6: Install as Windows Service

#### Run Service Installer
```powershell
# Ensure in installation directory
cd "C:\Program Files\Office Management System"

# Run as Administrator
.\install-service.ps1
```

**Follow Prompts:**
1. Confirm NSSM installation or use scheduled task
2. Choose to start service immediately
3. Verify service is running

#### Verify Service
```powershell
# Check service status
Get-Service -Name OfficeManagementSystem

# Should show: Status = Running

# Test application
Invoke-WebRequest -Uri "http://localhost:3001/api/health"
```

### Step 7: Security Configuration

#### Change Demo User Passwords
1. Open browser: `http://localhost:3001`
2. Login as admin (admin@demo.com / admin123)
3. Navigate to User Management
4. Change password for admin user
5. Update passwords for all demo users
6. Consider removing unused demo accounts

#### Secure PostgreSQL
```powershell
# Change postgres user password
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'NewStrongPassword123!';"

# Update .env with new password
notepad "C:\Program Files\Office Management System\.env"

# Restart service
Restart-Service -Name OfficeManagementSystem
```

#### Configure Backup User
```sql
-- Connect as postgres
psql -U postgres -d office_management

-- Create backup user with limited permissions
CREATE USER backup_user WITH PASSWORD 'BackupPassword123!';
GRANT CONNECT ON DATABASE office_management TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
```

### Step 8: Setup Backup Strategy

#### Create Backup Script
Create `C:\BackupScripts\backup-office-db.bat`:

```batch
@echo off
SET BACKUP_DIR=D:\Backups\OfficeManagement
SET TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
SET TIMESTAMP=%TIMESTAMP: =0%
SET BACKUP_FILE=%BACKUP_DIR%\office_management_%TIMESTAMP%.sql
SET PGPASSWORD=your_postgres_password

mkdir %BACKUP_DIR% 2>nul

echo Starting backup at %date% %time%
pg_dump -h localhost -U postgres office_management > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo Backup completed successfully: %BACKUP_FILE%
    
    REM Delete backups older than 30 days
    forfiles /p "%BACKUP_DIR%" /s /m *.sql /d -30 /c "cmd /c del @path"
) else (
    echo Backup failed!
)
```

#### Schedule Backup Task
```powershell
# Create scheduled task for daily backups at 2 AM
$Action = New-ScheduledTaskAction -Execute "C:\BackupScripts\backup-office-db.bat"
$Trigger = New-ScheduledTaskTrigger -Daily -At 2AM
$Settings = New-ScheduledTaskSettingsSet -StartWhenAvailable
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest

Register-ScheduledTask -TaskName "Office DB Backup" -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal
```

### Step 9: Configure Monitoring

#### Setup Basic Monitoring
```powershell
# Create monitoring script
$MonitorScript = @'
$Service = Get-Service -Name OfficeManagementSystem -ErrorAction SilentlyContinue

if ($Service -and $Service.Status -ne "Running") {
    # Send alert email
    Send-MailMessage -From "server@company.com" -To "admin@company.com" `
      -Subject "ALERT: Office Management System Down" `
      -Body "The Office Management System service is not running!" `
      -SmtpServer "smtp.company.com"
    
    # Attempt to restart
    Start-Service -Name OfficeManagementSystem
}
'@

# Save monitoring script
$MonitorScript | Out-File -FilePath "C:\Scripts\monitor-office-app.ps1"

# Schedule to run every 15 minutes
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Scripts\monitor-office-app.ps1"
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 15)
$Settings = New-ScheduledTaskSettingsSet -StartWhenAvailable

Register-ScheduledTask -TaskName "Monitor Office App" -Action $Action -Trigger $Trigger -Settings $Settings
```

### Step 10: Setup Remote Access (Optional)

#### Using IIS as Reverse Proxy (Recommended)

**Install IIS:**
```powershell
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
Install-WindowsFeature -Name Web-Application-Proxy
```

**Install URL Rewrite and ARR:**
1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Download ARR: https://www.iis.net/downloads/microsoft/application-request-routing

**Configure Reverse Proxy:**
1. Open IIS Manager
2. Create new website
3. Add URL Rewrite rules to proxy to `http://localhost:3001`
4. Configure SSL certificate
5. Setup binding for HTTPS

**Example web.config:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                    <match url="(.*)" />
                    <action type="Rewrite" url="http://localhost:3001/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

### Step 11: User Training and Documentation

#### Prepare User Documentation
1. Copy Quick Start Guide to shared location
2. Distribute login credentials to appropriate users
3. Schedule training sessions

#### User Onboarding Checklist
- [ ] Create user accounts for all team members
- [ ] Assign appropriate roles and permissions
- [ ] Send login credentials securely
- [ ] Provide Quick Start Guide
- [ ] Schedule training session
- [ ] Set up support channel

### Step 12: Production Launch

#### Pre-Launch Checklist
- [ ] All demo passwords changed
- [ ] Unused demo accounts removed
- [ ] Database backups configured and tested
- [ ] Monitoring setup and tested
- [ ] Firewall rules configured
- [ ] SSL certificate installed (if using HTTPS)
- [ ] User accounts created
- [ ] Service running and auto-starts
- [ ] Documentation distributed
- [ ] Support process established

#### Launch Day Tasks
1. Verify service is running
2. Test login for each user type
3. Monitor logs for any issues
4. Be available for user questions
5. Document any issues encountered

## Post-Deployment

### Regular Maintenance Tasks

**Daily:**
- Check service status
- Review error logs
- Monitor disk space

**Weekly:**
- Verify backups completed
- Check for application updates
- Review user activity logs

**Monthly:**
- Test backup restoration
- Review and archive old logs
- Update documentation if needed

**Quarterly:**
- Review security settings
- Update SSL certificates if needed
- Performance tuning review

### Monitoring and Logs

**Application Logs:**
```
C:\Program Files\Office Management System\logs\
```

**Service Logs:**
```
C:\Program Files\Office Management System\logs\service-output.log
C:\Program Files\Office Management System\logs\service-error.log
```

**PostgreSQL Logs:**
```
C:\Program Files\PostgreSQL\15\data\log\
```

### Scaling Considerations

**When to Scale:**
- Response time > 3 seconds consistently
- Database CPU > 80% consistently
- Memory usage > 90%
- Disk space < 10 GB free

**Scaling Options:**
1. Vertical Scaling: Increase RAM/CPU on existing server
2. Horizontal Scaling: Separate database to dedicated server
3. Load Balancing: Multiple application servers (requires session management)

## Troubleshooting

### Service Won't Start
```powershell
# Check service logs
Get-Content "C:\Program Files\Office Management System\logs\service-error.log" -Tail 50

# Check if port is in use
netstat -ano | findstr :3001

# Verify database connection
psql -h localhost -U postgres -d office_management -c "SELECT 1;"
```

### Performance Issues
```sql
-- Check database connections
SELECT count(*) FROM pg_stat_activity;

-- Check long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;

-- Check database size
SELECT pg_size_pretty(pg_database_size('office_management'));
```

### Connection Issues
```powershell
# Test from application server to database
Test-NetConnection -ComputerName localhost -Port 5432

# Check firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Office*"}

# Verify service account permissions
whoami /groups
```

## Support and Resources

### Documentation Files
- `QUICK_START.md` - Quick reference guide
- `WINDOWS_SERVER_INSTALLATION.md` - Detailed installation guide
- `TESTING_CHECKLIST.md` - Comprehensive testing procedures
- `installer-resources/README.md` - Installer documentation

### External Resources
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Windows Server Documentation: https://docs.microsoft.com/windows-server/
- NSSM Documentation: https://nssm.cc/usage

### Getting Help
1. Check troubleshooting sections in documentation
2. Review application logs
3. Check GitHub Issues for known problems
4. Submit new issue with detailed information

## Security Best Practices

### Application Security
- [ ] Change all default passwords
- [ ] Use strong password policy
- [ ] Implement regular password rotation
- [ ] Review user permissions quarterly
- [ ] Keep application updated

### Network Security
- [ ] Use VPN for remote access
- [ ] Implement HTTPS with valid SSL certificate
- [ ] Configure firewall rules restrictively
- [ ] Monitor failed login attempts
- [ ] Use network segmentation

### Database Security
- [ ] Strong postgres password
- [ ] Restrict pg_hba.conf to necessary IPs
- [ ] Regular security updates
- [ ] Encrypt backups
- [ ] Monitor database logs

### Server Security
- [ ] Keep Windows Server updated
- [ ] Use Windows Defender/Antivirus
- [ ] Enable Windows Firewall
- [ ] Regular security audits
- [ ] Implement least privilege principle

---

**Document Version:** 1.0.0  
**Last Updated:** 2024  
**For:** Production Windows Server Deployment  
**Deployment Time:** 2-4 hours (depending on experience)
