# Fix for "can't load same language file twice" Error

## Problem Summary
The Windows installer build was failing with the error:
```
Error: can't load same language file twice.
Error in macro MUI_LANGUAGEEX on macroline 13
Error in macro MUI_LANGUAGE on macroline 4
```

## Root Cause
The custom NSIS script (`installer-resources/installer.nsh`) was redefining elements that electron-builder's generated script already provides:
- `!include "MUI2.nsh"` 
- Standard MUI pages (Welcome, Directory, InstFiles, Finish)
- Uninstaller pages (Confirm, InstFiles)
- Language definition (`!insertmacro MUI_LANGUAGE "English"`)

When electron-builder includes the custom script into its generated NSIS script, this causes duplicate definitions, specifically the language being defined twice.

## Solution
Removed ALL standard MUI elements from the custom NSIS script because:

1. **electron-builder's generated script already includes:**
   - `!include "MUI2.nsh"`
   - All standard pages
   - All uninstaller pages
   - Language definitions

2. **Custom script should ONLY contain:**
   - Additional includes needed for custom logic (`!include "LogicLib.nsh"`)
   - Variable declarations
   - Custom page definitions (`Page custom FunctionName`)
   - Custom page functions
   - Custom install/uninstall macros

## Changes Made

### installer-resources/installer.nsh
**Removed:**
- `!include "MUI2.nsh"` (line 9)
- `!insertmacro MUI_PAGE_WELCOME` (line 18)
- `!insertmacro MUI_PAGE_DIRECTORY` (line 23)
- `!insertmacro MUI_PAGE_INSTFILES` (line 24)
- `!insertmacro MUI_PAGE_FINISH` (line 29)
- `!insertmacro MUI_UNPAGE_CONFIRM` (line 32)
- `!insertmacro MUI_UNPAGE_INSTFILES` (line 33)
- `!insertmacro MUI_LANGUAGE "English"` (line 36)

**Kept:**
- `!include "LogicLib.nsh"` - needed for ${If}, ${Else}, etc.
- Variable declarations (Var InstallationType, etc.)
- Custom page definitions (Page custom InstallationTypePageCreate, etc.)
- Custom functions (using !insertmacro MUI_HEADER_TEXT, nsDialogs, etc.)
- Custom install/uninstall macros

**Result:** 
- File reduced from 140 lines to 127 lines
- Much cleaner and follows electron-builder best practices
- Custom functionality preserved

### Documentation Updates
- Updated `installer-resources/README.md` with comprehensive list of what NOT to include
- Updated `NSIS_FIX_SUMMARY.md` with complete fix history
- Added troubleshooting section for this specific error

## Why This Works
When electron-builder includes the custom script:
1. electron-builder's script defines MUI2.nsh, pages, and language
2. Custom script is included at a specific point
3. Custom pages and functions are added
4. Custom install/uninstall macros are called at appropriate times
5. No duplicate definitions = no errors

## How Custom Functionality Still Works
Even though we removed `!include "MUI2.nsh"` from the custom script:
- electron-builder's generated script includes MUI2.nsh
- All MUI macros (MUI_HEADER_TEXT, etc.) are available
- All nsDialogs functions are available
- Custom pages can still use these macros and functions
- Everything works because the custom script is included into a script that already has these definitions

## Verification
To test this fix:
1. Run `npm run build` (React build) ✅ Works
2. Run `npm run dist-win` on Windows or GitHub Actions (NSIS build) - should now succeed

## Key Takeaway
**When creating a custom NSIS script for electron-builder:**
- Think of it as a "plugin" or "extension"
- Only add custom elements, never redefine standard ones
- electron-builder provides the complete NSIS infrastructure
- Your script just adds custom pages, variables, and installation logic

This is documented in electron-builder's official documentation but is a common source of confusion.
