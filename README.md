# Office Management System

A comprehensive office management system built with React, Electron, and PostgreSQL. This application provides a complete solution for managing clients, invoices, calendar events, team communication, and more.

---

## 🎯 Want an Executable (.exe) File?

**→ [START HERE: SOLUTION.md](SOLUTION.md)** - Complete guide to building your executable! 🚀

**Quick options:**
- 🤖 [Build in the cloud](GITHUB_ACTIONS_GUIDE.md) (easiest - no Windows needed!)
- 📱 [Build on Windows](QUICK_START.md) (simple step-by-step)
- 🔧 [Advanced build](BUILD_GUIDE.md) (for developers)
- 📖 [All documentation](DOCUMENTATION_INDEX.md) (everything in one place)

---

## 📥 Installation

### Option 1: Download Pre-built Installer (Recommended)

**[📘 Complete Installation Guide →](INSTALLATION_GUIDE.md)**

Check the [Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases) page for pre-built installers.

### Option 2: Build Your Own Executable

**Three ways to get an executable:**

1. **🚀 Use GitHub Actions (Easiest - No Windows PC Needed!)**
   - [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md) - Build in the cloud for FREE
   - Works from Mac, Linux, or Windows
   - Takes 5-10 minutes

2. **📘 For Non-Technical Users**
   - [QUICK_START.md](QUICK_START.md) - Simple step-by-step guide
   - Requires Windows PC
   - Takes 10-15 minutes

3. **📗 For Developers**
   - [BUILD_GUIDE.md](BUILD_GUIDE.md) - Comprehensive build documentation
   - Advanced options and customization

### Quick Install
1. Download installer from [Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)
2. Run as administrator
3. Choose installation type:
   - **Desktop Application** - For single-user workstations
   - **Server Installation** - For multi-user server environments

The installer automatically handles everything including PostgreSQL installation, database setup, and configuration.

---

## 🌐 Online Demo

**[Live Browser Demo](https://pawel-sokolowski.github.io/ManagmentApp/)**

Test features in your browser before installing.

---

## ✨ Features

- **Client Management** - Complete client database with contacts and documents
- **Invoice System** - Create, manage, and track invoices
- **Calendar & Scheduling** - Event management and team coordination
- **Team Chat** - Real-time collaboration
- **Email Center** - Integrated email management
- **Document Management** - Centralized document storage
- **Time Tracking** - Employee time tracking and reporting
- **Financial Reports** - Comprehensive analytics
- **User Management** - Role-based access control

---

## 📋 System Requirements

- Windows 10/11 or Windows Server 2016+
- 4 GB RAM (8 GB recommended)
- 500 MB disk space + 200 MB for PostgreSQL
- Internet connection for initial setup

---

## 🔧 Building Your Own Executable

Want to build the executable yourself? We have guides for everyone:

### 📘 For Non-Technical Users
**[QUICK_START.md](QUICK_START.md)** - Simple step-by-step guide with screenshots

### 📗 For Developers
**[BUILD_GUIDE.md](BUILD_GUIDE.md)** - Comprehensive build documentation

### Quick Build (Windows)

```bash
# Clone repository
git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
cd ManagmentApp

# Install dependencies
npm install

# Build installer
npm run dist-win
```

**Output:** The installer will be created in `dist-electron/` directory as `Office-Management-System-Setup-*.exe`

### Available Build Scripts

- `npm run dist-win` - Build Windows installer (NSIS + Portable)
- `npm run dist-mac` - Build macOS installer (DMG)
- `npm run dist-linux` - Build Linux installer (AppImage)
- `npm run electron-dev` - Run in development mode

---

**Version**: 1.0.0  
**License**: See LICENSE file  
**Platform**: Windows 10/11, Windows Server 2016+