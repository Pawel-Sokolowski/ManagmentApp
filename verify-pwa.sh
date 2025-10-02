#!/bin/bash

# PWA Verification Script
# Verifies that all PWA components are in place and working

echo "========================================"
echo "PWA Verification Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check if package.json exists
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json found"
else
    echo -e "${RED}✗${NC} package.json not found"
    ERRORS=$((ERRORS+1))
fi

# Check if Electron is removed
if grep -q "electron" package.json; then
    echo -e "${RED}✗${NC} Electron still present in package.json"
    ERRORS=$((ERRORS+1))
else
    echo -e "${GREEN}✓${NC} Electron removed from package.json"
fi

# Check PWA files
echo ""
echo "Checking PWA files..."

if [ -f "public/manifest.webmanifest" ]; then
    echo -e "${GREEN}✓${NC} manifest.webmanifest found"
else
    echo -e "${RED}✗${NC} manifest.webmanifest not found"
    ERRORS=$((ERRORS+1))
fi

if [ -f "public/sw.js" ]; then
    echo -e "${GREEN}✓${NC} sw.js (service worker) found"
else
    echo -e "${RED}✗${NC} sw.js not found"
    ERRORS=$((ERRORS+1))
fi

if [ -f "public/icon.svg" ]; then
    echo -e "${GREEN}✓${NC} icon.svg found"
else
    echo -e "${YELLOW}⚠${NC} icon.svg not found (optional)"
fi

# Check if index.html has PWA meta tags
if [ -f "index.html" ]; then
    if grep -q "manifest.webmanifest" index.html; then
        echo -e "${GREEN}✓${NC} index.html references manifest"
    else
        echo -e "${RED}✗${NC} index.html missing manifest reference"
        ERRORS=$((ERRORS+1))
    fi
    
    if grep -q "serviceWorker" index.html; then
        echo -e "${GREEN}✓${NC} index.html includes service worker registration"
    else
        echo -e "${RED}✗${NC} index.html missing service worker registration"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}✗${NC} index.html not found"
    ERRORS=$((ERRORS+1))
fi

# Check PDF libraries
echo ""
echo "Checking PDF generation libraries..."

if [ -d "node_modules/pdf-lib" ]; then
    echo -e "${GREEN}✓${NC} pdf-lib installed"
else
    echo -e "${RED}✗${NC} pdf-lib not installed"
    ERRORS=$((ERRORS+1))
fi

if [ -d "node_modules/jspdf" ]; then
    echo -e "${GREEN}✓${NC} jspdf installed"
else
    echo -e "${RED}✗${NC} jspdf not installed"
    ERRORS=$((ERRORS+1))
fi

# Check documentation
echo ""
echo "Checking documentation..."

if [ -f "README.md" ]; then
    if grep -q "Progressive Web App\|PWA" README.md; then
        echo -e "${GREEN}✓${NC} README.md mentions PWA"
    else
        echo -e "${YELLOW}⚠${NC} README.md doesn't mention PWA"
    fi
else
    echo -e "${RED}✗${NC} README.md not found"
fi

if [ -f "docs/deployment/PWA_DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓${NC} PWA deployment guide found"
else
    echo -e "${YELLOW}⚠${NC} PWA deployment guide not found"
fi

# Try to build
echo ""
echo "Testing build..."
if npm run build > /tmp/build-test.log 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check if PWA files are in build output
    if [ -f "build/manifest.webmanifest" ] && [ -f "build/sw.js" ]; then
        echo -e "${GREEN}✓${NC} PWA files copied to build directory"
    else
        echo -e "${RED}✗${NC} PWA files missing from build directory"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    echo "Check /tmp/build-test.log for details"
    ERRORS=$((ERRORS+1))
fi

# Summary
echo ""
echo "========================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "Your PWA is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Configure your database (see .env.example)"
    echo "2. Run: npm run build"
    echo "3. Run: npm run start"
    echo "4. Access at http://localhost:3000"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    echo "Please fix the errors above before deploying."
    exit 1
fi
