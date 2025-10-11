#!/bin/bash

# Wanderlust - Setup Verification Script
# Run: bash verify-setup.sh

echo "🔍 Verifying Wanderlust Setup..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js v18+"
    exit 1
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check for version numbers in imports
echo ""
echo "🔍 Checking for version numbers in imports..."
if grep -r "@[0-9]\+\.[0-9]\+\.[0-9]\+\"" components/ui/ 2>/dev/null; then
    echo -e "${RED}✗${NC} Found version numbers in imports!"
    echo "Run: bash fix-all-imports.sh"
    exit 1
else
    echo -e "${GREEN}✓${NC} No version numbers found in imports"
fi

# Check if node_modules exists
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found. Run: npm install"
fi

# Check package.json
echo ""
echo "📄 Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
else
    echo -e "${RED}✗${NC} package.json not found!"
    exit 1
fi

# Check key files
echo ""
echo "📄 Checking key files..."
FILES=(
    "App.tsx"
    "MainApp.tsx"
    "HomePage.tsx"
    "FlightsPage.tsx"
    "SearchPage.tsx"
    "BookingDetailsPage.tsx"
    "ConfirmationPage.tsx"
    "OffersPage.tsx"
    "index.html"
    "vite.config.ts"
    "tsconfig.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file not found!"
    fi
done

# Check UI components
echo ""
echo "📦 Checking UI components..."
UI_COMPONENTS=(
    "button.tsx"
    "input.tsx"
    "calendar.tsx"
    "popover.tsx"
)

for component in "${UI_COMPONENTS[@]}"; do
    if [ -f "components/ui/$component" ]; then
        echo -e "${GREEN}✓${NC} components/ui/$component"
    else
        echo -e "${RED}✗${NC} components/ui/$component not found!"
    fi
done

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. If node_modules missing: npm install"
echo "2. Start dev server: npm run dev"
echo "3. Open browser: http://localhost:5173"
echo ""
echo "For issues, see: TROUBLESHOOTING.md"
