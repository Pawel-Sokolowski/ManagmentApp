# Office Management System - Quick Start Guide

## Welcome!

Thank you for installing the Office Management System. This guide will help you get started quickly.

## First Steps

### 1. Database Setup (Required)

Before using the application, you need to set up the PostgreSQL database:

1. Open the installation folder (typically `C:\Program Files\Office Management System`)
2. Run `setup-database.bat` as Administrator
3. Follow the prompts to configure your database connection
4. The script will create the database and demo users automatically

**Note:** If PostgreSQL is not installed, download it from:
https://www.postgresql.org/download/windows/

### 2. Start the Application

After database setup:

**Option A: Desktop App**
- Launch "Office Management System" from Start Menu or Desktop shortcut

**Option B: Server Mode**
- Run `start-server.bat` for server mode
- Access at: http://localhost:3001

**Option C: Windows Service** (Recommended for servers)
- Run PowerShell as Administrator
- Execute: `.\install-service.ps1`
- The service will start automatically on boot

## Demo User Credentials

The system includes 6 demo users for testing:

### Administrator (Full Access)
- **Email:** admin@demo.com
- **Password:** admin123

### Office Manager
- **Email:** manager@demo.com
- **Password:** manager123

### Chief Accountant
- **Email:** accountant@demo.com
- **Password:** accountant123

### Secretary
- **Email:** secretary@demo.com
- **Password:** secretary123

### HR Manager
- **Email:** hr@demo.com
- **Password:** hr123

### Company Owner
- **Email:** owner@demo.com
- **Password:** owner123

**⚠️ IMPORTANT:** Change these passwords immediately in a production environment!

## Key Features

- **Client Management** - Manage customer database and contacts
- **Invoicing** - Create and track invoices
- **Calendar** - Schedule meetings and events
- **Team Chat** - Internal communication
- **Documents** - Store and organize files
- **Reports** - Business analytics and insights
- **User Management** - Role-based access control

## Need Help?

### Documentation
- Full installation guide: `WINDOWS_SERVER_INSTALLATION.md`
- Installer resources: `INSTALLER_README.md`
- Database guide: `src/database/DATABASE_SETUP_GUIDE.md`

### Troubleshooting

**Can't connect to database?**
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Run `check-postgresql.bat` to verify installation

**Application won't start?**
- Check port 3001 is not in use
- Review logs in installation folder
- Ensure database setup completed successfully

**Permission errors?**
- Log in as administrator (admin@demo.com)
- Verify user roles in User Management section
- Check database `user_permissions` table

### Support Resources
- GitHub: https://github.com/Pawel-Sokolowski/ManagmentApp
- Issues: Submit via GitHub Issues

## Security Recommendations

For production use:

1. **Change All Passwords**
   - Log in as admin
   - Update all demo user passwords
   - Remove unused accounts

2. **Secure Database**
   - Use strong PostgreSQL password
   - Configure firewall rules
   - Enable SSL connections if needed

3. **Network Security**
   - Configure Windows Firewall
   - Use HTTPS for remote access
   - Consider VPN for external connections

4. **Regular Maintenance**
   - Backup database regularly
   - Update application when new versions available
   - Monitor logs for issues

## Next Steps

1. ✅ Complete database setup
2. ✅ Log in with admin credentials
3. ✅ Change admin password
4. ✅ Create your team users
5. ✅ Configure company settings
6. ✅ Import/add client data
7. ✅ Explore features and modules

## Getting Started Checklist

- [ ] PostgreSQL installed and running
- [ ] Database setup completed (`setup-database.bat`)
- [ ] Logged in successfully
- [ ] Admin password changed
- [ ] Team users created
- [ ] Demo users removed or secured
- [ ] Company information configured
- [ ] Firewall configured (if needed)
- [ ] Backup strategy established

---

**Version:** 1.0.0  
**Platform:** Windows 10/11, Windows Server 2016+

Enjoy using the Office Management System!
