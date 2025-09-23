# Office Management System - Windows Desktop Application

A comprehensive office management system built with React, Electron, and PostgreSQL. This application provides a complete solution for managing clients, invoices, calendar events, team communication, and more.

## 🚀 Features

- **Client Management**: Complete client database with contact information and document management
- **Invoice System**: Create, manage, and track invoices with automated reminders
- **Calendar & Scheduling**: Advanced calendar with event management and team coordination
- **Team Chat**: Real-time communication system for team collaboration
- **Email Center**: Integrated email management with templates and automation
- **Document Management**: Centralized document storage and organization
- **Time Tracking**: Employee time tracking with detailed reporting
- **Financial Reports**: Comprehensive reporting and analytics
- **User Management**: Role-based access control and user permissions

## 📋 Prerequisites

Before installing the application, ensure you have:

- **PostgreSQL 13+** installed and running
- **Windows 10/11** (64-bit recommended)
- **Administrator privileges** for installation

## 🔧 Installation

### Build from Source

1. **Install Node.js** (version 18 or higher)
2. **Clone the repository**:
   ```bash
   git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
   cd ManagmentApp
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure database**:
   ```bash
   # Copy environment template
   copy .env.example .env
   
   # Edit .env file with your PostgreSQL credentials
   ```

5. **Initialize database**:
   ```bash
   npm run setup-db
   ```

6. **Build and run**:
   ```bash
   # For development
   npm run electron-dev
   
   # For production build
   npm run dist-win
   ```

## 🗄️ Database Setup

The application includes an automatic database setup script:

```bash
npm run setup-db
```

This will:
- Create the `office_management` database
- Install all required tables and functions
- Create a demo admin user (email: admin@demo.com, password: admin123)
- Insert sample data for testing

## 🖥️ Usage

### First Launch

1. Start the application
2. Login with demo credentials:
   - **Email**: admin@demo.com
   - **Password**: admin123
3. Begin exploring the system and adding your data

### Key Operations

- **Add Clients**: Navigate to "Dodaj Klienta" to add new clients
- **Create Invoices**: Use the "Faktury" section to manage invoicing
- **Schedule Events**: Access the "Kalendarz" for event management
- **Team Communication**: Use "Chat Zespołowy" for internal communication
- **Generate Reports**: Access various reports through the dashboard

## 🌐 Browser Demo

A browser-based demo version is available that doesn't require installing the desktop application:

### Running the Browser Demo

```bash
# Quick start (builds and runs the demo)
npm run demo

# For development (with hot reload)
npm run demo-dev
```

The demo will be available at: **http://localhost:3001**

### Demo Features

- ✅ Full application interface
- ✅ All UI components and navigation
- ✅ Mock data for demonstration
- ✅ Client management
- ✅ Invoice generation
- ✅ Calendar functionality
- ✅ Team communication
- ⚠️ Database features require PostgreSQL setup (optional for demo)

### Demo Login Credentials

- **Email**: admin@demo.com
- **Password**: admin123

The browser demo uses the same interface as the desktop version but runs in your web browser, making it perfect for showcasing the application to others without requiring installation.

## 🛠️ Development

### Development Setup

```bash
# Start development server
npm run dev

# Start Electron in development mode
npm run electron-dev

# Start backend server only
npm run server
```

### Building for Production

```bash
# Build for Windows
npm run dist-win
```

## 📝 Available Scripts

### Desktop Application (Electron)
- `npm run dev` - Start Vite development server
- `npm run electron` - Start Electron in development mode
- `npm run electron-dev` - Start both Vite dev server and Electron
- `npm run dist-win` - Build Windows installer (.exe)
- `npm run dist-mac` - Build macOS installer (.dmg)
- `npm run dist-linux` - Build Linux installer (.AppImage)

### Browser Demo
- `npm run demo` - Build and run browser demo (http://localhost:3001)
- `npm run demo-dev` - Run browser demo with hot reload

### Development & Utilities
- `npm run build` - Build the React application
- `npm run server` - Start the Express.js backend server
- `npm run setup-db` - Initialize PostgreSQL database with demo data

## 🏗️ Architecture

```
Office Management System/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── database/          # Database schemas and documentation
│   └── types/             # TypeScript definitions
├── server/                # Express.js backend
│   ├── routes/           # API endpoints
│   └── index.js          # Main server file
├── public/               # Electron main process
│   ├── electron.js       # Main Electron process
│   └── preload.js        # Preload script
└── scripts/              # Utility scripts
    └── setup-database.js # Database initialization
```

## 🔐 Security Features

- **Password Encryption**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permission levels for users
- **SQL Injection Protection**: Parameterized queries throughout
- **XSS Protection**: Content Security Policy and input sanitization

---

**Version**: 1.0.0
**Platform**: Windows 10/11
**Requirements**: PostgreSQL 13+, Node.js 18+