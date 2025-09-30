# Office Management System Installer

## Download the Installer

The unified Windows installer is available here:

**Office-Management-System-Setup.exe**

This single installer supports both:
- ✅ Desktop Application Installation
- ✅ Server Installation

---

## Building the Installer

To build the installer from source on a Windows machine:

```bash
# Clone the repository
git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
cd ManagmentApp

# Install dependencies
npm install

# Build the Windows installer
npm run dist-win
```

The installer will be created in the `dist-electron` directory.

After building, copy the installer to this `installer` folder:
```bash
copy dist-electron\Office-Management-System-Setup-*.exe installer\Office-Management-System-Setup.exe
```

---

## Installation Types

### Desktop Application
- Single-user workstation installation
- Local database
- Desktop shortcuts
- Automatic setup

### Server Installation
- Multi-user server environment
- Network database access
- Windows Service support
- Production configuration

---

## Complete Installation Instructions

See **[INSTALLATION_GUIDE.md](../INSTALLATION_GUIDE.md)** in the root directory for complete step-by-step installation instructions.

---

**Note:** Building Windows installers requires a Windows environment or Wine on Linux/macOS. The installer file should be built and placed in this folder before distribution.
