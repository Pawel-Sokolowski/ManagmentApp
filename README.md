# Office Management System

A comprehensive office management system built as a **Progressive Web Application (PWA)** with React and PostgreSQL. Access from any device, install on mobile/desktop, and work online or offline.

---

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/Pawel-Sokolowski/ManagmentApp.git
cd ManagmentApp

# Install dependencies
npm install

# Setup database (PostgreSQL required)
npm run setup-db

# Start the application
npm run dev
```

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

The application will be available at `http://localhost:3000`

---

## 🌐 Progressive Web App (PWA)

This application is a **Progressive Web Application** that can be:

✅ **Accessed** from any modern web browser  
✅ **Installed** on desktop and mobile devices  
✅ **Used offline** after initial load (via service worker)  
✅ **Updated** automatically when new versions are deployed  

### Installing as an App

**On Desktop (Chrome, Edge, Safari):**
1. Open the application in your browser
2. Look for the "Install" icon in the address bar
3. Click "Install" to add it to your desktop

**On Mobile (iOS/Android):**
1. Open the application in your browser
2. Tap the browser menu (three dots or share button)
3. Select "Add to Home Screen" or "Install"

---

## ✨ Features

- **Client Management** - Complete client database with contacts and documents
- **Invoice System** - Create, manage, and track invoices with PDF generation
- **Calendar & Scheduling** - Event management and team coordination
- **Team Chat** - Real-time collaboration
- **Email Center** - Integrated email management
- **Document Management** - Centralized document storage and PDF filling
- **Time Tracking** - Employee time tracking and reporting
- **Financial Reports** - Comprehensive analytics and charts
- **User Management** - Role-based access control
- **PDF Generation** - Create and fill PDF forms (UPL-1, invoices, contracts)

---

## 📋 System Requirements

### Server
- **Operating System:** Linux (Ubuntu 20.04+ recommended), Windows Server, or macOS
- **Node.js:** 18.x or higher
- **PostgreSQL:** 13 or higher
- **RAM:** 2 GB minimum (4 GB recommended)
- **Disk Space:** 1 GB minimum
- **Network:** Internet connection for deployment

### Client (Browser)
- **Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet:** Required for initial load, offline support via service worker
- **Devices:** Desktop, tablet, or mobile

---

## 📖 Documentation

- **[Web Deployment Guide](docs/development/WEB_DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **[API Documentation](docs/development/)** - Server API reference

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start backend server only
- `npm run server:prod` - Start backend in production mode
- `npm run setup-db` - Run database setup wizard

### Project Structure

```
ManagmentApp/
├── public/              # Static assets and PWA files
│   ├── manifest.webmanifest  # PWA manifest
│   ├── sw.js            # Service worker
│   └── icon.svg         # App icon
├── src/                 # React application source
│   ├── components/      # React components
│   ├── utils/           # Utilities including PDF generation
│   └── App.tsx          # Main application component
├── server/              # Express backend server
├── scripts/             # Database setup and utility scripts
└── docs/                # Documentation
```

---

## 📱 PWA Features

### Offline Support
The application uses a service worker to cache essential resources, allowing basic functionality when offline.

### Install Prompts
Users can install the application directly to their device for a native app-like experience.

### Responsive Design
Fully responsive interface that works on desktop, tablet, and mobile devices.

---

## 🖨️ PDF Generation

The application includes robust PDF generation capabilities:

- **Invoice PDFs** - Generate professional invoices using jsPDF
- **UPL-1 Forms** - Fill official Polish tax office forms using pdf-lib
- **Custom Forms** - Create custom PDF documents
- **Browser-based** - All PDF generation happens in the browser, no server-side dependencies

PDF generation is fully functional in the web version and works in all modern browsers.

---

## 🌐 Online Demo

**[Live Browser Demo](https://pawel-sokolowski.github.io/ManagmentApp/)**

Test features in your browser before deploying.

---

## 🔐 Security

- HTTPS recommended for production
- JWT-based authentication
- Role-based access control
- Secure database connections
- Environment-based configuration

---

## 📊 Production Deployment Options

### Option 1: Traditional Server
Deploy on your own server (VPS, dedicated server, on-premise):
- Full control over data and infrastructure
- See [Web Deployment Guide](docs/development/WEB_DEPLOYMENT_GUIDE.md)

### Option 2: Cloud Platforms
Deploy to cloud services:
- **Heroku** - Easy deployment with PostgreSQL addon
- **DigitalOcean App Platform** - Managed deployment
- **AWS/Azure** - Enterprise-grade infrastructure
- **Vercel/Netlify** - Frontend hosting (requires separate backend)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

---

**Version**: 1.0.0  
**License**: See LICENSE file  
**Platform**: Web (PWA) - All modern browsers and devices