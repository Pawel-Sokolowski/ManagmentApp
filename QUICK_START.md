# Office Management System - Quick Start Guide

## 🎯 **3 Steps to Get Started**

### Step 1: Download
**[Get the installer →](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)**

Download: `Office Management System Setup.exe` (ONE file, ~100MB)

---

### Step 2: Install
1. Right-click the downloaded file
2. Select **"Run as administrator"**
3. Follow the installation wizard
4. When prompted: **Click YES** for automatic setup

⏱️ **Wait 5-15 minutes** while the installer:
- Installs PostgreSQL database (if needed)
- Creates all tables and configurations
- Sets up demo users

---

### Step 3: Launch & Login
1. Open **"Office Management System"** from Start Menu or Desktop
2. Log in with demo credentials:
   - **Email:** `admin@demo.com`
   - **Password:** `admin123`

**🎉 You're done!** Start exploring the application.

---

## ✅ That's It - No Scripts, No Configuration

**You do NOT need to:**
- ❌ Install PostgreSQL manually
- ❌ Run any batch files or scripts
- ❌ Edit configuration files
- ❌ Set up databases manually

**Everything is automatic.**

---

## 🔑 Demo User Accounts

Test the application with these accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Administrator** | admin@demo.com | admin123 | Full system access |
| **Manager** | manager@demo.com | manager123 | Management features |
| **Accountant** | accountant@demo.com | accountant123 | Financial features |
| **Secretary** | secretary@demo.com | secretary123 | Basic access |
| **HR** | hr@demo.com | hr123 | User management |
| **Owner** | owner@demo.com | owner123 | All except admin |

⚠️ **Change these passwords** before using in production!

---

## 🚀 Key Features to Explore

After logging in, try these features:

- **Client Management** - Add and manage customer database
- **Invoicing** - Create and track invoices
- **Calendar** - Schedule meetings and events
- **Team Chat** - Internal communication
- **Documents** - Store and organize files
- **Reports** - Business analytics
- **User Management** - Role-based access

---

## ❓ Common Questions

### "The installer asks about automatic setup - what should I choose?"
**Click YES.** This installs everything automatically (recommended).

### "What if I clicked NO during installation?"
Navigate to `C:\Program Files\Office Management System` and run `one-click-setup.bat` as administrator.

### "Do I need to install PostgreSQL first?"
**No.** The installer does it automatically.

### "Can I use this on Windows Server?"
**Yes.** Same installer works on Windows Server 2016+.

---

## 🖥️ For Server Deployment (Optional)

If you want to run as a Windows Service (auto-start on boot):

1. Complete the standard installation above
2. Open PowerShell as Administrator
3. Navigate to: `C:\Program Files\Office Management System`
4. Run: `.\install-service.ps1`

The service will start automatically on every boot.

---

## 🔒 Security Checklist (Production)

Before using in production:

- [ ] Change all demo user passwords
- [ ] Remove unused demo accounts
- [ ] Configure Windows Firewall
- [ ] Set up database backups
- [ ] Use strong PostgreSQL password

---

## 📞 Need Help?

- **Documentation:** See `WINDOWS_SERVER_INSTALLATION.md` in installation folder
- **Issues:** [GitHub Issues](https://github.com/Pawel-Sokolowski/ManagmentApp/issues)
- **Live Demo:** [Try online](https://pawel-sokolowski.github.io/ManagmentApp/)

---

**Version:** 1.0.0  
**Platform:** Windows 10/11, Windows Server 2016+

**🎊 Enjoy your Office Management System!**
