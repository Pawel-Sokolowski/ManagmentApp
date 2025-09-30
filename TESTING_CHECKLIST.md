# Installation Testing Checklist

This document provides a comprehensive testing checklist for validating the Office Management System installation on Windows Server.

## Pre-Installation Testing

### System Requirements
- [ ] Windows Server 2016 or higher (or Windows 10/11 for testing)
- [ ] Administrator privileges available
- [ ] Minimum 4 GB RAM (8 GB recommended)
- [ ] 10 GB free disk space
- [ ] Internet connection for downloading dependencies

### Required Software Check
- [ ] PostgreSQL 13+ installed OR ready to install
- [ ] Node.js 18+ (will be bundled with installer)
- [ ] Port 3001 available (not in use)
- [ ] Port 5432 available for PostgreSQL (not in use)

## Installation Testing

### Standard Installer Test
1. [ ] Download `Office Management System Setup.exe`
2. [ ] Run installer as Administrator
3. [ ] Follow installation wizard
4. [ ] Choose custom installation directory (test non-default path)
5. [ ] Installation completes without errors
6. [ ] Desktop shortcut created
7. [ ] Start Menu entry created

### Installer Contents Verification
Navigate to installation directory and verify these files exist:

**Application Files:**
- [ ] `Office Management System.exe` (main executable)
- [ ] `resources/app.asar` or unpacked files

**Setup Scripts:**
- [ ] `setup-database.bat`
- [ ] `check-postgresql.bat`
- [ ] `start-server.bat`
- [ ] `install-service.ps1`

**Documentation:**
- [ ] `WINDOWS_SERVER_INSTALLATION.md`
- [ ] `INSTALLER_README.md`
- [ ] `QUICK_START.md`
- [ ] `.env.example`

**Server Files:**
- [ ] `server/` directory exists
- [ ] `server/index.js` exists
- [ ] `scripts/` directory exists
- [ ] `scripts/setup-database.js` exists
- [ ] `scripts/database-setup-wizard.js` exists
- [ ] `src/database/` directory exists
- [ ] `src/database/complete_system_schema.sql` exists

## PostgreSQL Installation Testing

### PostgreSQL Check
1. [ ] Run `check-postgresql.bat`
2. [ ] Verify PostgreSQL detection works
3. [ ] If not installed, follow download link and install
4. [ ] Verify PostgreSQL service is running
5. [ ] Test `psql` command is available in PATH

### PostgreSQL Installation (if needed)
1. [ ] Download PostgreSQL from official site
2. [ ] Install with default settings
3. [ ] Set strong postgres user password
4. [ ] Add PostgreSQL bin to system PATH
5. [ ] Restart command prompt/PowerShell
6. [ ] Re-run `check-postgresql.bat` - should pass

## Database Setup Testing

### Interactive Setup
1. [ ] Run `setup-database.bat` as Administrator
2. [ ] Script detects PostgreSQL
3. [ ] Script prompts for configuration
4. [ ] Enter database credentials (or accept defaults)
5. [ ] Script creates database successfully
6. [ ] Script initializes schema
7. [ ] Script creates 6 demo users
8. [ ] Script displays user credentials
9. [ ] Script creates `.env` file
10. [ ] No errors displayed
11. [ ] Script completes with success message

### Configuration Verification
1. [ ] `.env` file exists in installation directory
2. [ ] `.env` contains correct database credentials
3. [ ] `data/` directory created
4. [ ] `data/db-config.txt` created (if exists)

### Database Verification (using psql)
```sql
-- Connect to database
psql -h localhost -U postgres -d office_management

-- Check tables exist
\dt

-- Verify users table
SELECT email, role FROM users;

-- Expected: 6 users with different roles
-- admin@demo.com, manager@demo.com, accountant@demo.com, 
-- secretary@demo.com, hr@demo.com, owner@demo.com

-- Check permissions
SELECT COUNT(*) FROM user_permissions;
-- Expected: Multiple permission entries

-- Exit
\q
```

## Application Startup Testing

### Desktop Application
1. [ ] Launch application from Desktop shortcut
2. [ ] Application window opens without errors
3. [ ] Application attempts to connect to database
4. [ ] If setup incomplete, shows setup wizard
5. [ ] Backend server starts automatically
6. [ ] Application UI loads
7. [ ] No console errors visible

### Server Mode
1. [ ] Run `start-server.bat`
2. [ ] Server starts successfully
3. [ ] Displays: "Server running on port 3001"
4. [ ] Displays database connection status
5. [ ] No error messages
6. [ ] Open browser to `http://localhost:3001`
7. [ ] Application loads in browser

### Database Status Check
1. [ ] Access: `http://localhost:3001/api/health`
2. [ ] Returns JSON with status: "healthy"
3. [ ] Shows database: "connected"
4. [ ] Access: `http://localhost:3001/api/db-status`
5. [ ] Shows connected: true
6. [ ] Shows schemaInitialized: true
7. [ ] Shows userCount: 6

## User Login Testing

Test each user role with their credentials:

### Administrator Login
- [ ] Email: admin@demo.com
- [ ] Password: admin123
- [ ] Login successful
- [ ] Dashboard loads
- [ ] All menu items visible
- [ ] Can access User Management
- [ ] Can access Settings
- [ ] Can access all modules

### Manager Login
- [ ] Email: manager@demo.com
- [ ] Password: manager123
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Can access Clients
- [ ] Can access Calendar
- [ ] Cannot access System Settings
- [ ] Has appropriate read/write permissions

### Accountant Login
- [ ] Email: accountant@demo.com
- [ ] Password: accountant123
- [ ] Login successful
- [ ] Can access Invoices
- [ ] Can create/edit invoices
- [ ] Can access Reports
- [ ] Limited access to other modules

### Secretary Login
- [ ] Email: secretary@demo.com
- [ ] Password: secretary123
- [ ] Login successful
- [ ] Can access Calendar
- [ ] Can access basic Client info
- [ ] Cannot access financial data
- [ ] Limited permissions verified

### HR Manager Login
- [ ] Email: hr@demo.com
- [ ] Password: hr123
- [ ] Login successful
- [ ] Can access User Management
- [ ] Can view/edit users
- [ ] Cannot access financial modules
- [ ] HR-specific permissions work

### Owner Login
- [ ] Email: owner@demo.com
- [ ] Password: owner123
- [ ] Login successful
- [ ] Can access most modules
- [ ] Cannot access system administration
- [ ] Owner-level permissions work

## Permission Testing

### Module Access Control
For each user role, verify:

#### Clients Module
- [ ] Admin: Full access (RWDA)
- [ ] Manager: Read, Write, Delete
- [ ] Accountant: Read, Write
- [ ] Secretary: Read, Write
- [ ] HR: Read only
- [ ] Owner: Read, Write, Delete

#### Invoices Module
- [ ] Admin: Full access
- [ ] Manager: Read, Write
- [ ] Accountant: Read, Write, Delete
- [ ] Secretary: Read only
- [ ] HR: No access
- [ ] Owner: Read, Write, Delete

#### Users Module
- [ ] Admin: Full access
- [ ] Manager: Read only
- [ ] Accountant: No access
- [ ] Secretary: No access
- [ ] HR: Read, Write
- [ ] Owner: Read, Write

#### Settings Module
- [ ] Admin: Full access
- [ ] All others: No access or limited access

## Windows Service Testing (Optional)

### Service Installation
1. [ ] Open PowerShell as Administrator
2. [ ] Navigate to installation directory
3. [ ] Run `.\install-service.ps1`
4. [ ] Script detects NSSM or offers alternatives
5. [ ] Service installs successfully
6. [ ] No errors during installation

### Service Management
1. [ ] Start service: `Start-Service -Name OfficeManagementSystem`
2. [ ] Service starts successfully
3. [ ] Check status: `Get-Service -Name OfficeManagementSystem`
4. [ ] Status shows "Running"
5. [ ] Access application at `http://localhost:3001`
6. [ ] Application works in service mode
7. [ ] Stop service: `Stop-Service -Name OfficeManagementSystem`
8. [ ] Service stops cleanly

### Service Persistence
1. [ ] Restart Windows Server
2. [ ] Service starts automatically on boot
3. [ ] Application accessible after boot
4. [ ] Check service logs: `installation_dir/logs/`
5. [ ] No errors in logs

## Functionality Testing

### Basic Operations
For each user with appropriate permissions:

#### Client Management
- [ ] Create new client
- [ ] Edit client information
- [ ] View client list
- [ ] Search clients
- [ ] Delete client (if permission available)

#### Invoice Management
- [ ] Create new invoice
- [ ] Add invoice items
- [ ] Save invoice
- [ ] View invoice list
- [ ] Generate PDF (if available)
- [ ] Delete invoice (if permission available)

#### Calendar
- [ ] Create event
- [ ] Edit event
- [ ] View calendar
- [ ] Delete event (if permission available)

#### Chat/Communication
- [ ] Send message
- [ ] Receive message
- [ ] View chat history

#### Documents
- [ ] Upload document
- [ ] View document list
- [ ] Download document
- [ ] Delete document (if permission available)

## Integration Testing

### Database Connection
- [ ] Application reconnects after database restart
- [ ] Handles database connection loss gracefully
- [ ] Shows appropriate error messages

### Concurrent Users
- [ ] Multiple users can log in simultaneously
- [ ] Data updates are reflected for all users
- [ ] No data corruption with concurrent access

### Data Persistence
- [ ] Data saved correctly
- [ ] Logout and login preserves data
- [ ] Application restart preserves data

## Security Testing

### Authentication
- [ ] Cannot access without login
- [ ] Invalid credentials rejected
- [ ] Session management works
- [ ] Logout works properly

### Authorization
- [ ] Users can only access permitted modules
- [ ] Permission checks enforced
- [ ] Admin actions require admin role
- [ ] Cannot escalate privileges

### Password Security
- [ ] Passwords are hashed in database
- [ ] Cannot retrieve plain text passwords
- [ ] Password change works
- [ ] Strong password enforcement (if implemented)

## Performance Testing

### Startup Performance
- [ ] Application starts in reasonable time (< 30 seconds)
- [ ] Database initialization completes in reasonable time
- [ ] No memory leaks after extended running

### Response Time
- [ ] Page loads are responsive
- [ ] Database queries return quickly
- [ ] No significant lag in UI

## Error Handling Testing

### Database Errors
- [ ] Graceful handling of database connection failure
- [ ] Appropriate error messages shown
- [ ] Application doesn't crash

### Invalid Input
- [ ] Form validation works
- [ ] Invalid data rejected
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

## Documentation Testing

### User Documentation
- [ ] Quick Start Guide is clear and accurate
- [ ] Installation guide matches actual process
- [ ] Troubleshooting section helpful
- [ ] Screenshots/examples accurate

### Technical Documentation
- [ ] Database schema documentation complete
- [ ] API endpoints documented
- [ ] Configuration options explained
- [ ] Development setup instructions work

## Final Verification

### Production Readiness
- [ ] All demo passwords changed
- [ ] Unused demo users removed
- [ ] Database secured with strong password
- [ ] Firewall configured appropriately
- [ ] Backup strategy in place
- [ ] Monitoring setup (if applicable)

### Deployment Checklist
- [ ] Installation completed successfully
- [ ] Database setup completed
- [ ] All users can log in
- [ ] Permissions work correctly
- [ ] Service installed (if server deployment)
- [ ] Documentation reviewed
- [ ] Support contacts established

## Issue Tracking

### Found Issues
Document any issues found during testing:

| Issue # | Description | Severity | Status | Notes |
|---------|-------------|----------|--------|-------|
|         |             |          |        |       |

### Severity Levels
- **Critical:** Prevents installation or core functionality
- **High:** Major feature not working
- **Medium:** Minor feature issue or workaround available
- **Low:** Cosmetic or documentation issue

## Sign-Off

### Testing Completed By
- **Name:** _________________
- **Date:** _________________
- **Environment:** _________________
- **Version Tested:** _________________

### Results
- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] Issues documented and tracked
- [ ] Ready for production deployment

### Notes
_Additional comments or observations:_

---

**Document Version:** 1.0.0  
**Last Updated:** 2024  
**For:** Office Management System Windows Installation
