# Office Management System

Office Management System is a comprehensive React TypeScript application for managing accounting office operations, including client management, invoicing, email communication, time tracking, and database integration with PostgreSQL/Supabase.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Build the Application
- Install dependencies: `npm install`
- Build for production: `npm run build` -- takes ~7 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Start development server: `npm run dev` -- starts in ~2 seconds, runs on http://localhost:3000

### Key Commands and Expected Times
- `npm install` -- takes ~49 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
- `npm run build` -- takes ~7 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- `npm run dev` -- starts in ~2 seconds, opens development server on port 3000

## Validation

### Manual Testing Requirements
**ALWAYS run through complete user scenarios after making changes to ensure functionality:**

1. **Dashboard Navigation Test:**
   - Navigate to http://localhost:3000
   - Verify dashboard loads with client statistics, financial overview, and upcoming tasks
   - Test sidebar navigation between different sections

2. **Client Management Test:**
   - Click "Wszyscy Klienci" (All Clients)
   - Verify client list displays properly with filtering and sorting
   - Test adding a new client via "Dodaj Klienta" button
   - Test editing and viewing existing client details

3. **Core Functionality Test:**
   - Test email center functionality
   - Test invoice management
   - Test calendar integration
   - Verify time tracker works

### Build Validation
- Always build the application after making changes: `npm run build`
- No linting scripts are configured, but ensure TypeScript compilation succeeds
- Watch for console errors during development: `npm run dev`

## Application Architecture

### Technology Stack
- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite 6.3.5 with SWC plugin
- **UI Components:** Radix UI primitives with custom UI layer
- **Styling:** Tailwind CSS (implied from component usage)
- **Database:** PostgreSQL/Supabase integration ready
- **Icons:** Lucide React

### Project Structure
```
├── src/
│   ├── components/          # 79+ React components
│   │   ├── ui/              # Base UI components (buttons, cards, etc.)
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   ├── ClientList.tsx   # Client management
│   │   ├── EnhancedEmailCenter.tsx  # Email functionality
│   │   └── [other components]
│   ├── data/                # Mock data and types
│   ├── database/            # SQL schemas and documentation
│   ├── guidelines/          # Project guidelines
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── index.html               # HTML template
```

### Key Components and Features
- **Client Management:** Complete CRUD operations for clients
- **Email Center:** Advanced email management with templates
- **Invoice Management:** Automated and manual invoicing
- **Time Tracking:** Employee time tracking system
- **Calendar Integration:** Advanced calendar with user management
- **Document Management:** File handling and document processing
- **Database Integration:** Ready for PostgreSQL/Supabase connection

## Database Setup

### PostgreSQL/Supabase Integration
The application includes comprehensive database schemas in `src/database/`:

1. **Complete System Schema:** `complete_system_schema.sql`
2. **Time Tracking Schema:** `time_tracking_schema.sql`
3. **Chat System Schema:** `chat_schema.sql`

### Database Setup Instructions
1. Set up PostgreSQL 13+ with required extensions:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   CREATE EXTENSION IF NOT EXISTS "pg_cron";
   ```

2. Execute schemas:
   ```bash
   psql -d your_database -f src/database/complete_system_schema.sql
   ```

3. Configure SMTP and create admin user (see `src/database/COMPLETE_README.md`)

## Common Development Tasks

### Adding New Components
- Place new components in `src/components/`
- Follow existing TypeScript patterns
- Import and register in main App.tsx component
- Use Radix UI primitives for consistency

### Modifying Database
- Update SQL schemas in `src/database/`
- Follow PostgreSQL best practices
- Document changes in appropriate README files

### Navigation and Routing
- Application uses state-based navigation (no React Router)
- Main navigation controlled via `currentView` state in App.tsx
- Add new views to the `View` type and update rendering logic

## Development Best Practices

### File Organization
- Components use `.tsx` extension
- Mock data stored in `src/data/`
- Database schemas in `src/database/`
- UI components follow Radix UI patterns

### State Management
- Uses React hooks (useState, useEffect)
- No external state management library
- Mock data defined at application level

### Styling Approach
- Custom UI components built on Radix UI
- Consistent component patterns across the application
- Dark/light theme support via ThemeToggle component

## Troubleshooting

### Common Issues
- **Build failures:** Check TypeScript errors, ensure all imports are correct
- **Development server issues:** Ensure port 3000 is available
- **Component errors:** Verify Radix UI component usage and props

### Known Limitations
- No testing framework configured
- No linting tools configured (ESLint, Prettier)
- Database integration requires manual setup
- Email functionality requires SMTP configuration

## Important Files Reference

### Configuration Files
- `package.json` -- Dependencies and npm scripts
- `vite.config.ts` -- Build configuration with extensive alias setup
- `index.html` -- HTML template
- `.gitignore` -- Excludes node_modules, build artifacts

### Key Source Files
- `src/App.tsx` -- Main application logic and routing
- `src/main.tsx` -- Application entry point
- `src/components/Dashboard.tsx` -- Main dashboard
- `src/data/mockClients.ts` -- Sample client data

### Database Documentation
- `src/database/COMPLETE_README.md` -- Comprehensive database setup
- `src/database/README.md` -- Chat system integration
- `src/database/UPDATED_SYSTEM_README.md` -- Latest system updates

**Remember:** Always test the complete user workflow after making changes, not just individual components. The application is fully functional and should remain so after modifications.