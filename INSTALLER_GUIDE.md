# Office Management System - Installer Guide

## 📥 Pre-Built Installers (Recommended)

**Ready-to-use installers are automatically built and available in [GitHub Releases](https://github.com/Pawel-Sokolowski/ManagmentApp/releases):**

- **Windows:** 
  - `Office Management System Setup X.X.X.exe` - Full installer with setup wizard
  - `Office Management System-X.X.X-portable.exe` - Portable version (no installation required)
- **Linux:** `Office Management System-X.X.X.AppImage` - Portable Linux application
- **macOS:** `Office Management System-X.X.X.dmg` - macOS disk image installer

## 🔧 Building Installers from Source

If you need to build installers from source, the application is configured with electron-builder to create standalone installers that require no external dependencies.

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

## 🤖 Automated Releases

Installers are automatically built and released via GitHub Actions:

### Triggers
- **Tag Push**: Push a tag in format `v*.*.*` (e.g., `v1.0.0`) to trigger automatic builds
- **Manual Dispatch**: Manually trigger builds from GitHub Actions tab

### Process
1. **Multi-platform Build**: Simultaneously builds on Windows, Linux, and macOS
2. **Artifact Upload**: Each platform uploads its installer
3. **Release Creation**: Creates GitHub Release with all installers
4. **Download Links**: Makes installers available at `/releases`

### Creating a New Release
```bash
# Create and push a new version tag
git tag v1.0.1
git push origin v1.0.1

# This automatically triggers the release workflow
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