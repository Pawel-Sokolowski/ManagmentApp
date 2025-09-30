# Office Management System

A comprehensive office management system built with React, Electron, and PostgreSQL. This application provides a complete solution for managing clients, invoices, calendar events, team communication, and more.

---

## 📥 Installation

**[📘 Complete Installation Guide →](INSTALLATION_GUIDE.md)**

Download the unified installer that supports both Desktop and Server installations:

**[Download: Office-Management-System-Setup.exe](installer/Office-Management-System-Setup.exe)**

### Quick Start
1. Download the installer from the `installer` folder
2. Run as administrator
3. Choose installation type:
   - **Desktop Application** - For single-user workstations
   - **Server Installation** - For multi-user server environments

The installer automatically handles everything including PostgreSQL installation, database setup, and configuration.

**For detailed instructions, see [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)**

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

## 🔧 For Developers

### Building from Source

```bash
# Clone repository
git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
cd ManagmentApp

# Install dependencies
npm install

# Build installer
npm run dist-win
```

The installer will be created in `dist-electron/` directory.

---

**Version**: 1.0.0  
**License**: See LICENSE file  
**Platform**: Windows 10/11, Windows Server 2016+