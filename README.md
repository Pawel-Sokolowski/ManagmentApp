# Office Management System - Windows Desktop Application

A comprehensive office management system built with React, Electron, and PostgreSQL. This application provides a complete solution for managing clients, invoices, calendar events, team communication, and more.

---

## 🎯 **ONE INSTALLER. ZERO SCRIPTS. JUST WORKS.** ⚡

**Download ONE file. Run it. That's it.**

### 📥 For Windows Desktop/Workstation:
**[Download: `Office Management System Setup.exe`](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)**

This single installer file:
- ✅ Installs the complete application
- ✅ Installs PostgreSQL database automatically (if needed)
- ✅ Sets up everything with demo users
- ✅ **No scripts to run. No configuration needed.**

### 🖥️ For Windows Server (Dedicated Server):
**[Download: `Office Management System Setup.exe`](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)**

Same installer, server-optimized:
- ✅ Full server installation with PostgreSQL
- ✅ Automatic database initialization
- ✅ Can be configured as Windows Service
- ✅ **One file installs everything**

---

## ⚡ Installation (3 Steps - 5 Minutes)

### For Desktop/Workstation Users:

1. **Download** `Office Management System Setup.exe` from [Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)
2. **Run** the installer (right-click → "Run as administrator")
3. **Click YES** when prompted for automatic setup

**That's it!** Launch the app and log in with:
- Email: `admin@demo.com`
- Password: `admin123`

### For Server Deployment:

Same 3 steps above, then optionally install as Windows Service:
1. Open PowerShell as Administrator in installation folder
2. Run: `.\install-service.ps1`
3. Service starts automatically on boot

---

## 🌐 Try Online Demo (No Installation)

**[Live Browser Demo](https://pawel-sokolowski.github.io/ManagmentApp/)**

Test all features in your browser before installing. No download required.

---

## 📋 What You Get

**ONE installer includes:**
- ✅ Complete desktop application
- ✅ PostgreSQL 15 database (auto-installed)
- ✅ Express.js backend server (embedded)
- ✅ 6 demo users with different roles
- ✅ Sample data for testing
- ✅ All modules fully configured

**System Requirements:**
- Windows 10/11 or Windows Server 2016+
- 4 GB RAM (8 GB recommended for server)
- 10 GB free disk space
- Internet connection (for PostgreSQL download)

## 🚀 Features

- **Client Management**: Complete client database with contact information and document management
- **Invoice System**: Create, manage, and track invoices with automated reminders
- **Calendar & Scheduling**: Advanced calendar with event management and team coordination
- **Team Chat**: Real-time communication system for team collaboration
- **Email Center**: Integrated email management with templates and automation
- **Document Management**: Centralized document storage and organization
- **Time Tracking**: Employee time tracking with detailed reporting
- **Financial Reports**: Comprehensive reporting and analytics
- **User Management**: Role-based access control and user permissions

## 💡 Common Questions

### "Do I need to install PostgreSQL separately?"
**No.** The installer does it automatically.

### "Do I need to run any scripts or configuration?"
**No.** Everything is configured automatically during installation.

### "What if I already have PostgreSQL?"
The installer detects it and uses your existing installation.

### "Can I use this on a server?"
**Yes.** Same installer works for desktop and server deployment.

### "What about MSI installer?"
The NSIS .exe installer is equivalent to MSI and works on all Windows systems.

---

## 🔧 Advanced: Building from Source

<details>
<summary>Click to expand - For developers only</summary>

### Requirements
- Node.js 18+
- PostgreSQL 13+ (optional - installer can add it)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
   cd ManagmentApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build Windows installer:
   ```bash
   npm run dist-win
   ```

The installer will be created in `dist-electron/` directory.

</details>

---

## 🌐 Browser Demo

Want to try before installing?

**[Live Demo →](https://pawel-sokolowski.github.io/ManagmentApp/)**

Features:
- ✅ Full application interface
- ✅ All UI components
- ✅ Mock data for testing
- ⚠️ Database features require desktop installation

**Demo Login:**
- Email: `admin@demo.com`
- Password: `admin123`

---

## 🔐 Security & Production Use

**After installation:**
1. Change all demo user passwords
2. Remove unused demo accounts
3. Configure Windows Firewall
4. Set up regular database backups

**For production servers:**
- Install as Windows Service (included)
- Use strong PostgreSQL password
- Enable SSL connections
- Configure network security

---

## 📚 Documentation

- **[Installation Guide](WINDOWS_SERVER_INSTALLATION.md)** - Detailed installation steps
- **[Quick Start](QUICK_START.md)** - Get started in 5 minutes
- **[Installer Guide](INSTALLER_GUIDE.md)** - Installer details and options

---

## 🛠️ Development

<details>
<summary>For developers - Build and development info</summary>

### Available Scripts
- `npm run dev` - Start development server
- `npm run electron-dev` - Start Electron with hot reload
- `npm run dist-win` - Build Windows installer
- `npm run demo` - Run browser demo locally

### Architecture
```
Office Management System/
├── src/                    # React frontend
├── server/                # Express.js backend  
├── public/                # Electron main process
├── scripts/               # Database setup
└── installer-resources/   # Installer scripts
```

</details>

---

**Version**: 1.0.0
**Platform**: Windows 10/11
**Requirements**: PostgreSQL 13+, Node.js 18+