# Office Management System - Installation

## 🎯 **ONE FILE INSTALLS EVERYTHING**

**No scripts. No configuration. No PostgreSQL download needed.**

---

## For Windows Desktop/Workstation Users

### What You Need:
- Windows 10/11 (64-bit)
- Administrator access
- Internet connection
- 10 GB free disk space

### Installation Steps:

**1. Download**
- Go to [Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)
- Download: `Office Management System Setup.exe`
- ONE file (~100 MB)

**2. Install**
- Right-click the file → "Run as administrator"
- Follow installation wizard
- Click **YES** when asked about automatic setup

**3. Wait**
- 5-15 minutes for complete installation
- PostgreSQL installs automatically
- Database creates automatically
- Everything configures automatically

**4. Launch**
- Start "Office Management System" from Start Menu
- Log in: admin@demo.com / admin123
- **Done!**

---

## For Windows Server Deployment

### Same Installation Process Above, Then:

**Optional - Install as Windows Service:**

After standard installation:
1. Open PowerShell as Administrator
2. Navigate to: `C:\Program Files\Office Management System`
3. Run: `.\install-service.ps1`

Service will start automatically on server boot.

---

## ❓ Frequently Asked Questions

### "Do I need to install PostgreSQL first?"
**No.** The installer downloads and installs it automatically.

### "Do I need to run any scripts or batch files?"
**No.** Everything happens during installation automatically.

### "What about setup-database.bat or one-click-setup.bat?"
**You don't need them.** The installer runs them automatically. They're included only for advanced troubleshooting.

### "Is there an MSI installer?"
The .exe installer is equivalent to MSI and works on all Windows systems. For silent enterprise deployment: `"Office Management System Setup.exe" /S`

### "What if I already have PostgreSQL?"
The installer detects existing PostgreSQL and uses it automatically.

### "Can I use this on both desktop and server?"
**Yes.** Same installer works for both scenarios.

### "What if installation fails?"
See troubleshooting in [WINDOWS_SERVER_INSTALLATION.md](WINDOWS_SERVER_INSTALLATION.md) or run `one-click-setup.bat` from installation folder.

---

## 🔐 Default Credentials

**Database:**
- Host: localhost
- Port: 5432
- Database: office_management
- Username: postgres
- Password: postgres123!

**Application:**
- Email: admin@demo.com
- Password: admin123

⚠️ **Change these in production!**

---

## 📚 Additional Documentation

- **[Quick Start](QUICK_START.md)** - 3-step quick guide
- **[Windows Server Guide](WINDOWS_SERVER_INSTALLATION.md)** - Detailed installation and troubleshooting
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Advanced enterprise deployment (for custom setups)

---

## 🆘 Need Help?

**Most Common Issue:** Installation incomplete
**Solution:** Run `one-click-setup.bat` as administrator from installation folder

**Other Issues:**
- See [WINDOWS_SERVER_INSTALLATION.md](WINDOWS_SERVER_INSTALLATION.md) troubleshooting section
- Submit issue on [GitHub](https://github.com/Pawel-Sokolowski/ManagmentApp/issues)

---

**Version:** 1.0.0  
**Platform:** Windows 10/11, Windows Server 2016+

✅ **ONE installer file. ZERO scripts to run. COMPLETE installation.**
