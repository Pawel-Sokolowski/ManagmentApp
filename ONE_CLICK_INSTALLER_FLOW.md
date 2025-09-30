# One-Click Installer Flow Diagram

## 📌 **Technical Flow Diagram**

**This document shows the internal installer flow for developers.**

**For installation instructions, see:** [QUICK_START.md](QUICK_START.md)

---

## User Experience Flow

**From the user's perspective:**

1. Download `Office Management System Setup.exe`
2. Run installer (right-click → Run as administrator)
3. Click YES when prompted for automatic setup
4. Wait 5-15 minutes
5. Launch application

**That's it!** The flow below shows what happens behind the scenes.

---

## Technical Installation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        USER DOWNLOADS AND RUNS INSTALLER                    │
│        Office Management System Setup.exe                   │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        NSIS INSTALLER WIZARD                                │
│        - Choose installation directory                      │
│        - Create shortcuts                                   │
│        - Copy application files                             │
│        - Copy setup scripts                                 │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        AUTOMATIC SETUP DIALOG                               │
│                                                             │
│    "Would you like to run automatic setup now?"            │
│                                                             │
│    [ YES ]  [ NO ]                                          │
│                                                             │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
    YES  │                                │ NO
         │                                │
         ▼                                ▼
┌────────────────────────────┐   ┌─────────────────────────┐
│                            │   │                         │
│  RUN one-click-setup.bat   │   │  SKIP AUTOMATIC SETUP   │
│                            │   │                         │
└──────────┬─────────────────┘   │  Show manual setup      │
           │                     │  instructions           │
           ▼                     │                         │
┌─────────────────────────────┐ │  User can run:          │
│                             │ │  - one-click-setup.bat  │
│  STEP 1: CHECK POSTGRESQL   │ │  - setup-database.bat   │
│                             │ │    later                │
└──────────┬──────────────────┘ └─────────────────────────┘
           │
      ┌────┴────┐
      │         │
  FOUND      NOT FOUND
      │         │
      │         ▼
      │    ┌──────────────────────────────────┐
      │    │                                  │
      │    │  RUN install-postgresql.ps1      │
      │    │  - Download PostgreSQL 15        │
      │    │  - Install silently              │
      │    │  - Configure service             │
      │    │  - Add to PATH                   │
      │    │  (5-10 minutes)                  │
      │    │                                  │
      │    └────────────┬─────────────────────┘
      │                 │
      └─────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  STEP 2: CONFIGURE DATABASE                     │
│  - Load/create db-config.txt                    │
│  - Use defaults:                                │
│    * localhost:5432                             │
│    * office_management                          │
│    * postgres/postgres123!                      │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  STEP 3: CREATE DATABASE                        │
│  - Test PostgreSQL connection (3 retries)       │
│  - Create database if not exists                │
│  - Set PGPASSWORD environment variable          │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  STEP 4: INITIALIZE SCHEMA                      │
│  - Install npm dependencies (if needed)         │
│  - Create .env configuration file               │
│  - Run node scripts/setup-database.js           │
│    * Read complete_system_schema.sql            │
│    * Execute 1,400+ lines of SQL                │
│    * Create tables, functions, triggers         │
│    * Create 6 demo users                        │
│  (2-5 minutes)                                  │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  SETUP COMPLETE!                                │
│                                                 │
│  ✓ PostgreSQL installed (if needed)             │
│  ✓ Database created                             │
│  ✓ Schema initialized                           │
│  ✓ Demo users created                           │
│  ✓ Configuration saved                          │
│                                                 │
│  Ready to launch application!                   │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  USER LAUNCHES APPLICATION                      │
│  - From Start Menu                              │
│  - From Desktop shortcut                        │
│  - Or run Office Management System.exe          │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  LOGIN WITH DEMO CREDENTIALS                    │
│  - admin@demo.com / admin123                    │
│  - manager@demo.com / manager123                │
│  - accountant@demo.com / accountant123          │
│  - secretary@demo.com / secretary123            │
│  - hr@demo.com / hr123                          │
│  - owner@demo.com / owner123                    │
│                                                 │
└─────────────────────────────────────────────────┘


═══════════════════════════════════════════════════
ERROR HANDLING
═══════════════════════════════════════════════════

If PostgreSQL download fails:
    ├─► Show manual download link
    └─► User can retry with install-postgresql.ps1

If PostgreSQL installation fails:
    ├─► Log error to data/logs/setup.log
    ├─► Show manual installation instructions
    └─► User can run setup-database.bat after manual install

If database connection fails:
    ├─► Retry 3 times with 5-second delays
    ├─► Check if PostgreSQL service is running
    └─► Show troubleshooting steps

If schema initialization fails:
    ├─► Log full error to data/logs/setup.log
    ├─► Show error message to user
    └─► User can retry with setup-database.bat


═══════════════════════════════════════════════════
ALTERNATIVE PATHS
═══════════════════════════════════════════════════

User chooses NO during installation:
    ├─► Installation completes without setup
    ├─► User can run one-click-setup.bat later
    └─► Manual instructions in WINDOWS_SERVER_INSTALLATION.md

PostgreSQL already installed:
    ├─► Skip PostgreSQL installation
    ├─► Use existing PostgreSQL instance
    ├─► Create database only
    └─► Complete in 5 minutes instead of 15

User wants manual control:
    ├─► Edit data/db-config.txt
    ├─► Run setup-database.bat interactively
    └─► Answer configuration prompts


═══════════════════════════════════════════════════
TIME ESTIMATES
═══════════════════════════════════════════════════

Clean installation (no PostgreSQL):
    ├─► Installer: 2-3 minutes
    ├─► PostgreSQL installation: 5-10 minutes
    ├─► Database setup: 2-5 minutes
    └─► Total: 10-18 minutes

With existing PostgreSQL:
    ├─► Installer: 2-3 minutes
    ├─► Database setup: 2-5 minutes
    └─► Total: 4-8 minutes

Manual setup later:
    ├─► Run one-click-setup.bat: 5-15 minutes
    └─► Or run individual scripts as needed
```
