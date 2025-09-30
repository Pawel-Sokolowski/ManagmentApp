# Office Management System - Installer Guide

## 🎯 **ONE Installer File - Complete Installation**

**The application provides a single installer file that handles everything automatically.**

---

## 📥 Download the Installer (Recommended)

**Ready-to-use installer available in [GitHub Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases):**

### For Windows Desktop/Workstation:
- **`Office Management System Setup X.X.X.exe`**
  - Full NSIS installer with setup wizard
  - Automatic PostgreSQL installation
  - Complete database setup
  - Creates shortcuts and Start Menu entries
  - **Recommended for all users**

### Alternative (Advanced Users Only):
- **`Office Management System-X.X.X-portable.exe`**
  - Portable version (no installation)
  - Requires manual PostgreSQL setup
  - No automatic database configuration
  - For advanced users only

---

## ✅ What the Installer Includes

**ONE file installs everything:**

- ✅ Complete desktop application
- ✅ PostgreSQL 15 database (automatically downloaded and installed)
- ✅ Express.js backend server (embedded)
- ✅ Database schema (1,400+ lines of SQL)
- ✅ 6 demo users with different roles
- ✅ Sample data for testing
- ✅ All configuration files
- ✅ Desktop and Start Menu shortcuts

**You do NOT need to:**
- ❌ Download PostgreSQL separately
- ❌ Run batch scripts manually
- ❌ Edit configuration files
- ❌ Initialize the database manually

---

## 🚀 Installation Process

### Standard Installation (Recommended):

1. **Download** `Office Management System Setup X.X.X.exe`
2. **Run** the installer (right-click → "Run as administrator")
3. **Choose** installation directory (default: `C:\Program Files\Office Management System`)
4. **Click YES** when prompted for automatic setup
5. **Wait** 5-15 minutes for complete installation

**That's it!** The application is ready to use.

### What Happens Automatically:

1. **Files Installation** - Copies application files
2. **PostgreSQL Check** - Detects if PostgreSQL is installed
3. **PostgreSQL Installation** - Downloads and installs PostgreSQL 15 (if needed)
4. **Database Creation** - Creates `office_management` database
5. **Schema Setup** - Initializes all tables and functions
6. **Demo Users** - Creates 6 demo accounts
7. **Configuration** - Sets up all settings
8. **Shortcuts** - Creates Desktop and Start Menu shortcuts

---

## 🖥️ For Windows Server Deployment

**Same installer works for server deployment:**

### Installation:
1. Follow the standard installation process above
2. Application installs and configures automatically

### Optional - Install as Windows Service:
After installation, to run as a service:

1. Open PowerShell as Administrator
2. Navigate to installation directory
3. Run: `.\install-service.ps1`

The service will:
- Start automatically on boot
- Run in the background
- Restart automatically on failure

---

## ❓ About MSI vs EXE Installer

**Q: Why not MSI installer?**

**A:** The NSIS .exe installer provides:
- ✅ Custom installation logic (PostgreSQL auto-install)
- ✅ Interactive setup prompts
- ✅ Better user experience
- ✅ Same corporate deployment support as MSI
- ✅ Works on all Windows versions
- ✅ Supports silent installation

**The .exe installer is functionally equivalent to MSI** and is the industry standard for Electron applications.

For **silent/automated deployment** (enterprise):
```cmd
"Office Management System Setup.exe" /S
```

---

## 🔧 Advanced: Building from Source

<details>
<summary>Click to expand - For developers only</summary>

### Prerequisites
- Node.js 18+
- Git

### Windows Installer

Build a Windows installer from source:

```bash
# Clone repository
git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
cd ManagmentApp

# Install dependencies
npm install

# Build Windows installer
npm run dist-win
```

**Output:**
- `dist-electron/Office Management System Setup X.X.X.exe` - Full installer
- `dist-electron/Office Management System-X.X.X-portable.exe` - Portable version

### Linux Installer

```bash
npm run dist-linux
```

**Output:**
- `dist-electron/Office Management System-X.X.X.AppImage`

### macOS Installer

```bash
npm run dist-mac
```

**Output:**
- `dist-electron/Office Management System-X.X.X.dmg`

</details>