# Quick Setup Guide for OpenAI API Key

Write-Host "`n🔑 OpenAI API Key Setup Guide" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

Write-Host "Step 1: Get your API key" -ForegroundColor Yellow
Write-Host "  Visit: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "  Click 'Create new secret key'" -ForegroundColor White
Write-Host "  Copy the key (starts with sk-proj-...)`n" -ForegroundColor White

Write-Host "Step 2: Choose setup method`n" -ForegroundColor Yellow

Write-Host "Method 1: Environment Variable (Recommended)" -ForegroundColor Cyan
Write-Host "  Run this in PowerShell:" -ForegroundColor White
Write-Host "    `$env:OPENAI_API_KEY = 'sk-proj-YOUR-KEY-HERE'" -ForegroundColor Gray
Write-Host "  Or set permanently:" -ForegroundColor White
Write-Host "    [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-proj-YOUR-KEY-HERE', 'User')" -ForegroundColor Gray
Write-Host "  Then restart backend`n" -ForegroundColor Yellow

Write-Host "Method 2: Application Properties" -ForegroundColor Cyan
Write-Host "  Edit file: BackEnd/api/src/main/resources/application.properties" -ForegroundColor White
Write-Host "  Find line:" -ForegroundColor White
Write-Host "    openai.api.key=`${OPENAI_API_KEY:}" -ForegroundColor Gray
Write-Host "  Change to:" -ForegroundColor White
Write-Host "    openai.api.key=sk-proj-YOUR-KEY-HERE" -ForegroundColor Gray
Write-Host "  Save and restart backend`n" -ForegroundColor Yellow

Write-Host "Step 3: Test the setup" -ForegroundColor Yellow
Write-Host "  Run: .\test_enrichment.ps1" -ForegroundColor White
Write-Host "  Should see successful enrichment with metadata`n" -ForegroundColor White

Write-Host "💡 Security Tips:" -ForegroundColor Yellow
Write-Host "  - Never commit API keys to Git" -ForegroundColor White
Write-Host "  - Use environment variables in production" -ForegroundColor White
Write-Host "  - Add .env files to .gitignore`n" -ForegroundColor White

Write-Host "Cost info:" -ForegroundColor Cyan
Write-Host "  GPT-3.5 Turbo: $0.0015 per 1K tokens" -ForegroundColor White
Write-Host "  Enriching 150 entities: ~$0.23" -ForegroundColor White
Write-Host "  Very affordable! 💰`n" -ForegroundColor Green

# Prompt user to set key
Write-Host "Do you want to set the API key now? (Y/N): " -ForegroundColor Cyan -NoNewline
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host "`nEnter your OpenAI API key: " -ForegroundColor Cyan -NoNewline
    $apiKey = Read-Host -MaskInput
    
    if ($apiKey -match '^sk-') {
        # Set environment variable
        [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $apiKey, 'User')
        $env:OPENAI_API_KEY = $apiKey
        
        Write-Host "✅ API key set successfully!" -ForegroundColor Green
        Write-Host "Environment variable OPENAI_API_KEY has been configured." -ForegroundColor White
        Write-Host "Restart your backend to apply changes.`n" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ Invalid API key format. Should start with 'sk-'" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nNo problem! Set it manually using one of the methods above.`n" -ForegroundColor White
}

Write-Host "Ready to test? Run: .\test_enrichment.ps1`n" -ForegroundColor Cyan
