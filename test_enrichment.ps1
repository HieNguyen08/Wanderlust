# AI Assistant - Enrichment Test Script
# Run this script to test the data enrichment process

$API_BASE = "http://localhost:8080/api/v1/ai/admin/enrichment"

Write-Host "`n🤖 AI Data Enrichment Test Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "1. Checking backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$API_BASE/health" -Method Get
    Write-Host "   ✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Service: $($health.service)`n" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Start it with: cd BackEnd\api; .\mvnw.cmd spring-boot:run`n" -ForegroundColor Yellow
    exit
}

# Test single entity enrichment
Write-Host "2. Testing single entity enrichment..." -ForegroundColor Yellow
Write-Host "   (This will call OpenAI API - requires API key)`n" -ForegroundColor Gray

$testEntity = @{
    entityType = "hotel"
    name = "Hanoi La Siesta Hotel & Spa"
    description = "Elegant boutique hotel in Hanoi Old Quarter. Features rooftop terrace, spa, and complimentary breakfast. Prime location near Hoan Kiem Lake. Popular with couples seeking romantic getaway. Rooms from 1,800,000 VND per night."
    existingPrice = 1800000
    existingLatitude = 21.0285
    existingLongitude = 105.8542
} | ConvertTo-Json

Write-Host "   Input:" -ForegroundColor Cyan
Write-Host $testEntity -ForegroundColor Gray
Write-Host ""

try {
    $result = Invoke-RestMethod -Uri "$API_BASE/test" -Method Post `
        -ContentType "application/json" -Body $testEntity
    
    if ($result.success) {
        Write-Host "   ✅ Enrichment successful!" -ForegroundColor Green
        Write-Host "   Confidence: $($result.confidence)`n" -ForegroundColor Green
        
        Write-Host "   📊 Generated Metadata:" -ForegroundColor Cyan
        Write-Host "   - Duration: $($result.data.estimatedDuration) minutes" -ForegroundColor White
        Write-Host "   - Price Tier: $($result.data.priceTier)" -ForegroundColor White
        Write-Host "   - Tags: $($result.data.tags -join ', ')" -ForegroundColor White
        Write-Host "   - Target Audience: $($result.data.targetAudience -join ', ')" -ForegroundColor White
        Write-Host "   - Weather Dependency: $($result.data.weatherDependency)" -ForegroundColor White
        Write-Host "   - Physical Exertion: $($result.data.physicalExertion)" -ForegroundColor White
        Write-Host "`n   Summary: $($result.data.contextualSummary)`n" -ForegroundColor DarkGray
    } else {
        Write-Host "   ❌ Enrichment failed: $($result.error)" -ForegroundColor Red
        Write-Host "   Common causes:" -ForegroundColor Yellow
        Write-Host "   - OpenAI API key not configured" -ForegroundColor Gray
        Write-Host "   - Invalid API key" -ForegroundColor Gray
        Write-Host "   - Network issues`n" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Request failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -like "*401*") {
        Write-Host "`n   💡 This looks like an API key issue!" -ForegroundColor Yellow
        Write-Host "   Set your OpenAI API key:" -ForegroundColor Cyan
        Write-Host "   Method 1 (Environment Variable):" -ForegroundColor White
        Write-Host "     `$env:OPENAI_API_KEY='sk-proj-your-key-here'" -ForegroundColor Gray
        Write-Host "     Restart backend after setting`n" -ForegroundColor Gray
        Write-Host "   Method 2 (application.properties):" -ForegroundColor White
        Write-Host "     Edit: BackEnd/api/src/main/resources/application.properties" -ForegroundColor Gray
        Write-Host "     Change: openai.api.key=sk-proj-your-key-here" -ForegroundColor Gray
        Write-Host "     Restart backend`n" -ForegroundColor Gray
    }
}

# Get enrichment stats
Write-Host "3. Checking enrichment statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$API_BASE/stats" -Method Get
    if ($stats.success) {
        Write-Host "   📊 Current Database State:`n" -ForegroundColor Cyan
        
        Write-Host "   Hotels:" -ForegroundColor White
        Write-Host "     Total: $($stats.data.hotels.total)" -ForegroundColor Gray
        Write-Host "     Enriched: $($stats.data.hotels.enriched)" -ForegroundColor Gray
        Write-Host "     Pending: $($stats.data.hotels.pending)`n" -ForegroundColor Gray
        
        Write-Host "   Activities:" -ForegroundColor White
        Write-Host "     Total: $($stats.data.activities.total)" -ForegroundColor Gray
        Write-Host "     Enriched: $($stats.data.activities.enriched)" -ForegroundColor Gray
        Write-Host "     Pending: $($stats.data.activities.pending)`n" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️ Could not fetch stats" -ForegroundColor Yellow
}

# Batch enrichment options
Write-Host "4. Batch Enrichment Options:" -ForegroundColor Yellow
Write-Host "   To enrich all hotels (dry run first):" -ForegroundColor White
Write-Host "     curl -X POST '$API_BASE/hotels?dryRun=true&minConfidence=0.7'" -ForegroundColor Gray
Write-Host "   To enrich all hotels (for real):" -ForegroundColor White
Write-Host "     curl -X POST '$API_BASE/hotels?dryRun=false&minConfidence=0.7'" -ForegroundColor Gray
Write-Host ""
Write-Host "   To enrich all activities (dry run):" -ForegroundColor White
Write-Host "     curl -X POST '$API_BASE/activities?dryRun=true&minConfidence=0.7'" -ForegroundColor Gray
Write-Host ""

# Estimate cost
$hotelCount = 50  # Adjust based on actual count
$activityCount = 100  # Adjust based on actual count
$totalEntities = $hotelCount + $activityCount
$estimatedTokens = $totalEntities * 1000
$estimatedCost = $estimatedTokens * 0.0000015  # $0.0015 per 1K tokens

Write-Host "5. Cost Estimation:" -ForegroundColor Yellow
Write-Host "   Entities to enrich: ~$totalEntities (hotels + activities)" -ForegroundColor White
Write-Host "   Estimated tokens: ~$estimatedTokens" -ForegroundColor White
Write-Host "   Estimated cost: ~`$$([math]::Round($estimatedCost, 2))" -ForegroundColor White
Write-Host "   (Very cheap! 💸)`n" -ForegroundColor Green

Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. If test worked: Run batch enrichment" -ForegroundColor White
Write-Host "  2. If API key error: Configure OPENAI_API_KEY" -ForegroundColor White
Write-Host "  3. Review results in MongoDB" -ForegroundColor White
Write-Host "  4. Check PHASE1_IMPLEMENTATION_SUMMARY.md for details`n" -ForegroundColor White
