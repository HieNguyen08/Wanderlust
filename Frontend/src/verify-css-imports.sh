#!/bin/bash

# Verify CSS imports are correct

echo "🔍 Verifying CSS Imports..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERROR_COUNT=0

# Check 1: App.tsx imports globals.css
echo "1️⃣ Checking App.tsx imports globals.css..."
if grep -q 'import.*globals.css' App.tsx; then
    echo -e "${GREEN}✓${NC} App.tsx imports globals.css"
else
    echo -e "${RED}✗${NC} App.tsx missing: import \"./styles/globals.css\""
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 2: globals.css imports tailwindcss
echo ""
echo "2️⃣ Checking globals.css imports tailwindcss..."
if grep -q '@import.*tailwindcss' styles/globals.css; then
    echo -e "${GREEN}✓${NC} globals.css imports tailwindcss"
else
    echo -e "${RED}✗${NC} globals.css missing: @import \"tailwindcss\""
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 3: globals.css exists
echo ""
echo "3️⃣ Checking globals.css exists..."
if [ -f "styles/globals.css" ]; then
    echo -e "${GREEN}✓${NC} styles/globals.css exists"
else
    echo -e "${RED}✗${NC} styles/globals.css not found!"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 4: vite.config.ts has tailwindcss plugin
echo ""
echo "4️⃣ Checking vite.config.ts has tailwindcss plugin..."
if grep -q 'tailwindcss()' vite.config.ts; then
    echo -e "${GREEN}✓${NC} vite.config.ts has tailwindcss plugin"
else
    echo -e "${RED}✗${NC} vite.config.ts missing tailwindcss plugin"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Check 5: package.json has tailwindcss
echo ""
echo "5️⃣ Checking package.json has tailwindcss..."
if grep -q '"tailwindcss"' package.json; then
    echo -e "${GREEN}✓${NC} package.json has tailwindcss"
else
    echo -e "${RED}✗${NC} package.json missing tailwindcss"
    ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# Summary
echo ""
echo "================================"
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All CSS imports are correct!${NC}"
    echo ""
    echo "You can now run:"
    echo "  npm install"
    echo "  npm run dev"
else
    echo -e "${RED}❌ Found $ERROR_COUNT error(s)${NC}"
    echo ""
    echo "Please fix the errors above."
    echo "See: FIX_LAYOUT_ISSUE.md for solutions"
fi
echo "================================"
