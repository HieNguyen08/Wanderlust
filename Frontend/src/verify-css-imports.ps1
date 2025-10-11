# Verify CSS imports are correct (PowerShell)

Write-Host "🔍 Verifying CSS Imports..." -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0

# Check 1: App.tsx imports globals.css
Write-Host "1️⃣ Checking App.tsx imports globals.css..." -ForegroundColor Yellow
$appContent = Get-Content "App.tsx" -Raw
if ($appContent -match 'import.*globals\.css') {
    Write-Host "✓ App.tsx imports globals.css" -ForegroundColor Green
} else {
    Write-Host "✗ App.tsx missing: import `"./styles/globals.css`"" -ForegroundColor Red
    $ErrorCount++
}

# Check 2: globals.css imports tailwindcss
Write-Host ""
Write-Host "2️⃣ Checking globals.css imports tailwindcss..." -ForegroundColor Yellow
$cssContent = Get-Content "styles/globals.css" -Raw
if ($cssContent -match '@import.*tailwindcss') {
    Write-Host "✓ globals.css imports tailwindcss" -ForegroundColor Green
} else {
    Write-Host "✗ globals.css missing: @import `"tailwindcss`"" -ForegroundColor Red
    $ErrorCount++
}

# Check 3: globals.css exists
Write-Host ""
Write-Host "3️⃣ Checking globals.css exists..." -ForegroundColor Yellow
if (Test-Path "styles/globals.css") {
    Write-Host "✓ styles/globals.css exists" -ForegroundColor Green
} else {
    Write-Host "✗ styles/globals.css not found!" -ForegroundColor Red
    $ErrorCount++
}

# Check 4: vite.config.ts has tailwindcss plugin
Write-Host ""
Write-Host "4️⃣ Checking vite.config.ts has tailwindcss plugin..." -ForegroundColor Yellow
$viteContent = Get-Content "vite.config.ts" -Raw
if ($viteContent -match 'tailwindcss\(\)') {
    Write-Host "✓ vite.config.ts has tailwindcss plugin" -ForegroundColor Green
} else {
    Write-Host "✗ vite.config.ts missing tailwindcss plugin" -ForegroundColor Red
    $ErrorCount++
}

# Check 5: package.json has tailwindcss
Write-Host ""
Write-Host "5️⃣ Checking package.json has tailwindcss..." -ForegroundColor Yellow
$pkgContent = Get-Content "package.json" -Raw
if ($pkgContent -match '"tailwindcss"') {
    Write-Host "✓ package.json has tailwindcss" -ForegroundColor Green
} else {
    Write-Host "✗ package.json missing tailwindcss" -ForegroundColor Red
    $ErrorCount++
}

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
if ($ErrorCount -eq 0) {
    Write-Host "✅ All CSS imports are correct!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Cyan
    Write-Host "  npm install"
    Write-Host "  npm run dev"
} else {
    Write-Host "❌ Found $ErrorCount error(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the errors above." -ForegroundColor Yellow
    Write-Host "See: FIX_LAYOUT_ISSUE.md for solutions"
}
Write-Host "================================" -ForegroundColor Cyan
