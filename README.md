# Office Management System

A comprehensive office management system built with React, Electron, and PostgreSQL. This application provides a complete solution for managing clients, invoices, calendar events, team communication, and more.

---

## 🎯 Want an Executable (.exe) File?

**Quick options:**
- 🤖 [Build in the cloud](docs/development/GITHUB_ACTIONS_GUIDE.md) (easiest - no Windows needed!)
- 📱 [Build on Windows](docs/guides/QUICK_START.md) (simple step-by-step)
- 🔧 [Advanced build](docs/development/HOW_TO_BUILD.md) (for developers)
- 📖 [All documentation](docs/README.md) (organized and easy to navigate)

---

## 📥 Installation & Deployment

### Two Deployment Options Available

This application can be deployed in **two different ways** depending on your needs:

#### Option 1: Desktop Application (Windows/Mac/Linux)
**Best for:** Single-user workstations or small teams with local installations

- **Desktop installer** for Windows, Mac, or Linux
- Runs as a native desktop application with Electron
- Can work offline once configured
- Database can be local or remote

**[📘 Desktop Installation Guide →](docs/guides/INSTALLATION_GUIDE.md)**

**Quick install:**
1. Download installer from [Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases)
2. Run as administrator
3. Choose installation type (Desktop or Server mode)

#### Option 2: Web Application (Server Deployment)
**Best for:** Multi-user environments, centralized access, remote teams

- Pure web-based application (no desktop app needed)
- Access from any browser
- Centralized server deployment
- Supports unlimited concurrent users

**[🌐 Web Deployment Guide →](docs/development/WEB_DEPLOYMENT_GUIDE.md)**

**Quick web deployment:**
```bash
npm install
npm run build:web
npm run server:prod
```

---

### Build Your Own Executable

**Three ways to get a desktop executable:**

1. **🚀 Use GitHub Actions (Easiest - No Windows PC Needed!)**
   - [GITHUB_ACTIONS_GUIDE.md](docs/development/GITHUB_ACTIONS_GUIDE.md) - Build in the cloud for FREE
   - Works from Mac, Linux, or Windows
   - Takes 5-10 minutes

2. **📘 For Non-Technical Users**
   - [QUICK_START.md](docs/guides/QUICK_START.md) - Simple step-by-step guide
   - Requires Windows PC
   - Takes 10-15 minutes

3. **📗 For Developers**
   - [HOW_TO_BUILD.md](docs/development/HOW_TO_BUILD.md) - Comprehensive build documentation
   - Advanced options and customization

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
**[QUICK_START.md](docs/guides/QUICK_START.md)** - Simple step-by-step guide with screenshots

### 📗 For Developers
**[HOW_TO_BUILD.md](docs/development/HOW_TO_BUILD.md)** - Comprehensive build documentation
**[HOW_TO_TEST.md](docs/development/HOW_TO_TEST.md)** - Testing guidelines

### 📚 All Documentation
**[Documentation Index](docs/README.md)** - Organized documentation with guides, development docs, and feature documentation

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