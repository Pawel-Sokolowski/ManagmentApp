# Office Management System - Installer Guide

## Creating Installers

The application is configured with electron-builder to create standalone installers that require no external dependencies.

### Windows Installer

To create a Windows installer (.exe and portable versions):

```bash
npm run dist-win
```

This creates:
- **NSIS Installer** (`.exe`): Full installer with setup wizard
- **Portable Application** (`.exe`): Single executable, no installation required

### Linux Installer

To create a Linux AppImage:

```bash
npm run dist-linux
```

This creates:
- **AppImage** (`.AppImage`): Portable Linux application

### macOS Installer

To create a macOS installer:

```bash
npm run dist-mac
```

This creates:
- **DMG** (`.dmg`): macOS disk image installer

## Features

✅ **No External Dependencies**: All required Node.js modules and server components are bundled
✅ **Standalone Execution**: The app includes its own Express.js server
✅ **Desktop Integration**: Creates desktop shortcuts and start menu entries
✅ **PostgreSQL Optional**: Works with mock data by default, PostgreSQL for advanced features

## Build Output

Installers are created in the `dist-electron/` directory:

```
dist-electron/
├── Office Management System-1.0.0.AppImage    # Linux portable
├── Office Management System Setup 1.0.0.exe   # Windows installer  
├── Office Management System-1.0.0-portable.exe # Windows portable
└── Office Management System-1.0.0.dmg         # macOS installer
```

## Configuration

The installer configuration is in `package.json` under the `build` section:

- **Windows**: Creates both NSIS installer and portable app
- **Auto-updater**: Disabled for security (publish=never)
- **Code Signing**: Not configured (can be added for production)
- **File Associations**: Not configured (can be added if needed)

## Testing

After building, test the installer on the target platform:

1. **Windows**: Run the `.exe` installer or portable version
2. **Linux**: Make executable and run the `.AppImage` file
3. **macOS**: Mount the `.dmg` and drag to Applications

The application should start without requiring any additional installations.