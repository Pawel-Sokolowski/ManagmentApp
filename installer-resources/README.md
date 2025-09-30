# NSIS Installer Resources

This directory contains custom NSIS (Nullsoft Scriptable Install System) configuration for the Office Management System Windows installer.

## Files

### installer.nsh

Custom NSIS script that provides additional installation options beyond electron-builder's defaults.

**Important:** This script is **included** by electron-builder, not used as a standalone installer script. Therefore, it should NOT contain:

- `Name` directive (set by electron-builder from `package.json` → `build.productName`)
- `OutFile` directive (electron-builder manages output file naming)
- `InstallDir` directive (electron-builder manages installation directory)
- `RequestExecutionLevel` directive (electron-builder handles permissions)
- `Section "Install"` (use `!macro customInstall` instead)
- `Section "Uninstall"` (use `!macro customUnInstall` instead)

### What This Script Does

1. **Installation Type Selection**: Provides a custom page during installation where users can choose between:
   - Desktop Application (for single-user workstations)
   - Server Installation (for multi-user server environments)

2. **Custom Installation Steps** (`!macro customInstall`):
   - Creates a `.env` configuration file based on the selected installation type
   - Checks if PostgreSQL is installed
   - Displays appropriate warnings if PostgreSQL is not found

3. **Post-Installation Page**: Shows installation-specific next steps based on the chosen installation type

4. **Custom Uninstall** (`!macro customUnInstall`):
   - Displays informational message about PostgreSQL and database preservation

## electron-builder Integration

The script is included via `package.json`:

```json
{
  "build": {
    "nsis": {
      "include": "installer-resources/installer.nsh"
    }
  }
}
```

electron-builder will:
- Include this script in its generated NSIS installer
- Call `!macro customInstall` during installation (after copying files)
- Call `!macro customUnInstall` during uninstallation
- Automatically handle file copying, shortcut creation, registry writes, and uninstaller creation

## Troubleshooting

### NSIS Warning 6029: "Name: specified multiple times"

This error occurs when the custom script duplicates directives that electron-builder sets automatically. **Solution:** Remove duplicate directives like `Name`, `OutFile`, `InstallDir`, etc. from the custom script.

### NSIS Warning: "MUI_UNPAGE_* inserted after MUI_LANGUAGE"

This warning occurs when uninstaller page macros are defined after the language macro. According to NSIS MUI2 documentation, all page definitions must come before language definitions.

**Solution:** Ensure the following order in your NSIS script:
1. Include statements (`!include "MUI2.nsh"`)
2. Variables (`Var VariableName`)
3. All page macros (`!insertmacro MUI_PAGE_*` and `!insertmacro MUI_UNPAGE_*`)
4. Language macro (`!insertmacro MUI_LANGUAGE`)
5. Functions and macros

### Warnings Treated as Errors

If you encounter build failures due to harmless NSIS warnings, you can configure electron-builder to not treat warnings as errors by adding `"warningsAsErrors": false` to the `nsis` section in `package.json`:

```json
{
  "build": {
    "nsis": {
      "warningsAsErrors": false
    }
  }
}
```

**Note:** Only use this option if you've verified that the warnings are indeed harmless and don't affect the installer's functionality.

### Custom Pages Not Showing

Make sure custom pages are defined with `Page custom FunctionName` and that the functions are properly implemented with `nsDialogs`.

### Variables Not Working

Custom variables must be declared at the top of the script with `Var VariableName`. They are shared between the included script and electron-builder's generated script.

## References

- [electron-builder NSIS Configuration](https://www.electron.build/configuration/nsis)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Modern UI 2 Documentation](https://nsis.sourceforge.io/Docs/Modern%20UI%202/Readme.html)
