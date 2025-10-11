# Wanderlust - Setup Verification Script (PowerShell)
# Run: .\verify-setup.ps1

Write-Host "🔍 Verifying Wanderlust Setup..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js v18+" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check for version numbers in imports
Write-Host ""
Write-Host "🔍 Checking for version numbers in imports..." -ForegroundColor Yellow
$found = Get-ChildItem -Path "components\ui" -Include *.tsx -Recurse | Select-String -Pattern '@\d+\.\d+\.\d+"'
if ($found) {
    Write-Host "✗ Found version numbers in imports!" -ForegroundColor Red
    Write-Host "Run: .\fix-all-imports.ps1" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✓ No version numbers found in imports" -ForegroundColor Green
}

# Check if node_modules exists
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "! node_modules not found. Run: npm install" -ForegroundColor Yellow
}

# Check package.json
Write-Host ""
Write-Host "📄 Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json exists" -ForegroundColor Green
} else {
    Write-Host "✗ package.json not found!" -ForegroundColor Red
    exit 1
}

# Check key files
Write-Host ""
Write-Host "📄 Checking key files..." -ForegroundColor Yellow
$files = @(
    "App.tsx",
    "MainApp.tsx",
    "HomePage.tsx",
    "FlightsPage.tsx",
    "SearchPage.tsx",
    "BookingDetailsPage.tsx",
    "ConfirmationPage.tsx",
    "OffersPage.tsx",
    "index.html",
    "vite.config.ts",
    "tsconfig.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file not found!" -ForegroundColor Red
    }
}

# Check UI components
Write-Host ""
Write-Host "📦 Checking UI components..." -ForegroundColor Yellow
$uiComponents = @(
    "button.tsx",
    "input.tsx",
    "calendar.tsx",
    "popover.tsx"
)

foreach ($component in $uiComponents) {
    if (Test-Path "components\ui\$component") {
        Write-Host "✓ components\ui\$component" -ForegroundColor Green
    } else {
        Write-Host "✗ components\ui\$component not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. If node_modules missing: npm install"
Write-Host "2. Start dev server: npm run dev"
Write-Host "3. Open browser: http://localhost:5173"
Write-Host ""
Write-Host "For issues, see: TROUBLESHOOTING.md" -ForegroundColor Yellow
