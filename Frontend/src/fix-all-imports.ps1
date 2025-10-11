# PowerShell script to fix all version numbers in import statements
# Run in PowerShell: .\fix-all-imports.ps1

Write-Host "Fixing all import version numbers in components/ui/..." -ForegroundColor Green

# Get all .tsx and .ts files in components/ui
$files = Get-ChildItem -Path "components/ui" -Include *.tsx,*.ts -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Remove version numbers from all package imports
    $content = $content -replace '@radix-ui/react-([a-z-]+)@[\d.]+', '@radix-ui/react-$1'
    $content = $content -replace 'lucide-react@[\d.]+', 'lucide-react'
    $content = $content -replace 'class-variance-authority@[\d.]+', 'class-variance-authority'
    $content = $content -replace 'react-hook-form@[\d.]+', 'react-hook-form'
    $content = $content -replace 'react-day-picker@[\d.]+', 'react-day-picker'
    $content = $content -replace 'embla-carousel-react@[\d.]+', 'embla-carousel-react'
    $content = $content -replace 'recharts@[\d.]+', 'recharts'
    $content = $content -replace 'cmdk@[\d.]+', 'cmdk'
    $content = $content -replace 'input-otp@[\d.]+', 'input-otp'
    $content = $content -replace 'react-resizable-panels@[\d.]+', 'react-resizable-panels'
    $content = $content -replace 'vaul@[\d.]+', 'vaul'
    $content = $content -replace 'sonner@[\d.]+', 'sonner'
    $content = $content -replace 'next-themes@[\d.]+', 'next-themes'
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "`nDone! All version numbers removed from imports." -ForegroundColor Green
Write-Host "Total files processed: $($files.Count)" -ForegroundColor Cyan
