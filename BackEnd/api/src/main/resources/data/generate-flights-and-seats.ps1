# PowerShell script to generate flights.json and flightseat.json
# Generate data for the next 30 days from NOW
# Each flight has exactly 24 seats: 4 Business (rows 1-4) + 20 Economy (rows 5-12)

# 1. Define Data Sources
$airports = @{
    "SGN" = @{ name = "Tan Son Nhat Airport"; city = "Ho Chi Minh City"; terminal = "T1" }
    "HAN" = @{ name = "Noi Bai Airport"; city = "Ha Noi"; terminal = "T1" }
    "DAD" = @{ name = "Da Nang Airport"; city = "Da Nang"; terminal = "T1" }
    "PQC" = @{ name = "Phu Quoc Airport"; city = "Phu Quoc"; terminal = "T1" }
    "CXR" = @{ name = "Cam Ranh Airport"; city = "Nha Trang"; terminal = "T1" }
    "HPH" = @{ name = "Cat Bi Airport"; city = "Hai Phong"; terminal = "T1" }
    "DLI" = @{ name = "Lien Khuong Airport"; city = "Da Lat"; terminal = "T1" }
    "VCA" = @{ name = "Can Tho Airport"; city = "Can Tho"; terminal = "T1" }
    "SIN" = @{ name = "Singapore Changi Airport"; city = "Singapore"; terminal = "T1" }
    "BKK" = @{ name = "Suvarnabhumi Airport"; city = "Bangkok"; terminal = "T1" }
    "KUL" = @{ name = "Kuala Lumpur International"; city = "Kuala Lumpur"; terminal = "KLIA" }
}

$airlines = @{
    "VN" = @{ name = "Vietnam Airlines"; logo = "https://images.wanderlust.com/airlines/vn-logo.png" }
    "VJ" = @{ name = "VietJet Air"; logo = "https://images.wanderlust.com/airlines/vj-logo.png" }
    "BL" = @{ name = "Pacific Airlines"; logo = "https://images.wanderlust.com/airlines/bl-logo.png" }
    "QH" = @{ name = "Bamboo Airways"; logo = "https://images.wanderlust.com/airlines/qh-logo.png" }
}

$routes = @(
    @{from="SGN"; to="HAN"; dur=135; dist=1180; intl=$false}
    @{from="HAN"; to="SGN"; dur=135; dist=1180; intl=$false}
    @{from="SGN"; to="DAD"; dur=80; dist=610; intl=$false}
    @{from="DAD"; to="SGN"; dur=80; dist=610; intl=$false}
    @{from="HAN"; to="DAD"; dur=70; dist=615; intl=$false}
    @{from="DAD"; to="HAN"; dur=70; dist=615; intl=$false}
    @{from="SGN"; to="PQC"; dur=60; dist=310; intl=$false}
    @{from="PQC"; to="SGN"; dur=60; dist=310; intl=$false}
    @{from="SGN"; to="CXR"; dur=50; dist=340; intl=$false}
    @{from="CXR"; to="SGN"; dur=50; dist=340; intl=$false}
    @{from="SGN"; to="DLI"; dur=45; dist=220; intl=$false}
    @{from="DLI"; to="SGN"; dur=45; dist=220; intl=$false}
    @{from="SGN"; to="VCA"; dur=40; dist=160; intl=$false}
    @{from="VCA"; to="SGN"; dur=40; dist=160; intl=$false}
    @{from="SGN"; to="SIN"; dur=120; dist=1080; intl=$true}
    @{from="SIN"; to="SGN"; dur=120; dist=1080; intl=$true}
    @{from="SGN"; to="BKK"; dur=90; dist=730; intl=$true}
    @{from="BKK"; to="SGN"; dur=90; dist=730; intl=$true}
    @{from="SGN"; to="KUL"; dur=110; dist=1090; intl=$true}
    @{from="KUL"; to="SGN"; dur=110; dist=1090; intl=$true}
)

$aircraft = @(
    @{type="Airbus A321"; code="A321"}
    @{type="Airbus A320"; code="A320"}
    @{type="Boeing 787"; code="B787"}
    @{type="ATR 72"; code="ATR72"}
)

$times = @("06:00", "07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00")

$flights = @()
$flightSeats = @()
$currentDate = Get-Date
$totalDaysToGenerate = 30

Write-Host "Generating flights and seats for next 30 days starting from $($currentDate.ToString('yyyy-MM-dd'))..." -ForegroundColor Yellow

# Generate 2 flights per route per day = 40 routes * 2 * 30 days = 2400 flights
$flightCounter = 200
$seatCounter = 1

# Iterate through each day
for ($day = 0; $day -lt $totalDaysToGenerate; $day++) {
    $currentDayDate = $currentDate.AddDays($day)
    
    # For each route
    foreach ($route in $routes) {
        # Generate 2 flights per route per day (morning and afternoon)
        for ($flightPerDay = 0; $flightPerDay -lt 2; $flightPerDay++) {
            $airlineCode = @("VN", "VJ", "BL", "QH") | Get-Random
            $airline = $airlines[$airlineCode]
            $ac = $aircraft | Get-Random
            
            # Choose time: morning or afternoon
            if ($flightPerDay -eq 0) {
                $time = $times[0..4] | Get-Random  # Morning: 06:00 - 12:00
            } else {
                $time = $times[5..10] | Get-Random  # Afternoon: 13:30 - 21:00
            }
            
            $hour, $min = $time -split ":"
            $depTime = $currentDayDate.Date.AddHours([int]$hour).AddMinutes([int]$min)
            $arrTime = $depTime.AddMinutes($route.dur)
            
            $flightNum = "$airlineCode$flightCounter"
            
            # Calculate pricing based on route type
            if ($route.intl) {
                $bizBase = Get-Random -Minimum 4500000 -Maximum 6000000
                $ecoBase = Get-Random -Minimum 2500000 -Maximum 4000000
            } else {
                $bizBase = Get-Random -Minimum 1500000 -Maximum 2500000
                $ecoBase = Get-Random -Minimum 800000 -Maximum 1500000
            }
            
            $totalSeats = 24
            $availableSeats = Get-Random -Minimum 10 -Maximum 24
            
            # Create Flight object
            $flight = [PSCustomObject]@{
                id = $flightNum
                flightNumber = $flightNum
                airlineCode = $airlineCode
                airlineName = $airline.name
                airlineLogo = $airline.logo
                departureAirportCode = $route.from
                departureAirportName = $airports[$route.from].name
                departureCity = $airports[$route.from].city
                departureTerminal = $airports[$route.from].terminal
                departureTime = $depTime.ToString("yyyy-MM-ddTHH:mm:ss")
                arrivalAirportCode = $route.to
                arrivalAirportName = $airports[$route.to].name
                arrivalCity = $airports[$route.to].city
                arrivalTerminal = $airports[$route.to].terminal
                arrivalTime = $arrTime.ToString("yyyy-MM-ddTHH:mm:ss")
                durationMinutes = $route.dur
                durationDisplay = if ($route.dur -ge 60) { "$([int]($route.dur / 60))h $($route.dur % 60)p" } else { "$($route.dur)p" }
                distanceKm = $route.dist
                isDirect = $true
                stops = 0
                stopInfo = @()
                aircraftType = $ac.type
                aircraftCode = $ac.code
                cabinClasses = @{
                    business = @{
                        available = $true
                        fromPrice = $bizBase
                        fares = @(
                            @{
                                id = "biz-standard"
                                name = "Business Class"
                                price = $bizBase
                                baggage = "15kg carry-on"
                                checkedBag = "32kg"
                                refundable = $true
                                changeable = $true
                                miles = 2000
                                availableSeats = Get-Random -Minimum 1 -Maximum 4
                            }
                        )
                    }
                    economy = @{
                        available = $true
                        fromPrice = $ecoBase
                        fares = @(
                            @{
                                id = "eco-standard"
                                name = "Economy Standard"
                                price = $ecoBase
                                baggage = "7kg carry-on"
                                checkedBag = if ($airlineCode -eq "VJ") { "None" } else { "20kg" }
                                refundable = $false
                                changeable = $false
                                miles = 500
                                availableSeats = Get-Random -Minimum 5 -Maximum 20
                            },
                            @{
                                id = "eco-flex"
                                name = "Economy Flex"
                                price = [int]($ecoBase * 1.45)
                                baggage = "7kg carry-on"
                                checkedBag = "23kg"
                                refundable = $true
                                changeable = $true
                                miles = 750
                                availableSeats = Get-Random -Minimum 1 -Maximum 10
                            }
                        )
                    }
                }
                status = "SCHEDULED"
                totalSeats = $totalSeats
                availableSeats = $availableSeats
                amenities = @("wifi", "meal", "entertainment")
                operatedBy = $airline.name
                isInternational = $route.intl
                createdAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
                updatedAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            }
            
            $flights += $flight
            
            # Create 24 FlightSeats for this flight
            # Rows 1-4: Business (4 seats)
            # Rows 5-12: Economy (20 seats, 2 seats per row)
            
            # Business seats: Rows 1-4, columns A & B
            for ($row = 1; $row -le 4; $row++) {
                for ($col = 0; $col -lt 2; $col++) {
                    $position = [char](65 + $col)  # A, B
                    $seatNumber = "$row$position"
                    
                    $seatStatus = if ((Get-Random -Minimum 0 -Maximum 100) -lt 70) { "AVAILABLE" } else { "BOOKED" }
                    
                    $seat = [PSCustomObject]@{
                        id = "SEAT-$seatCounter"
                        flightId = $flightNum
                        seatNumber = $seatNumber
                        seatType = if ($col -eq 0) { "WINDOW" } else { "AISLE" }
                        row = $row
                        position = $position
                        cabinClass = "BUSINESS"
                        isExitRow = $false
                        extraLegroom = $true
                        price = $bizBase
                        status = $seatStatus
                        features = @("power", "reclining")
                        createdAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
                        updatedAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
                    }
                    
                    $flightSeats += $seat
                    $seatCounter++
                }
            }
            
            # Economy seats: Rows 5-12, columns A & B
            for ($row = 5; $row -le 12; $row++) {
                for ($col = 0; $col -lt 2; $col++) {
                    $position = [char](65 + $col)  # A, B
                    $seatNumber = "$row$position"
                    
                    $seatStatus = if ((Get-Random -Minimum 0 -Maximum 100) -lt 60) { "AVAILABLE" } else { "BOOKED" }
                    
                    $seat = [PSCustomObject]@{
                        id = "SEAT-$seatCounter"
                        flightId = $flightNum
                        seatNumber = $seatNumber
                        seatType = if ($col -eq 0) { "WINDOW" } else { "AISLE" }
                        row = $row
                        position = $position
                        cabinClass = "ECONOMY"
                        isExitRow = $false
                        extraLegroom = $false
                        price = $ecoBase
                        status = $seatStatus
                        features = @()
                        createdAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
                        updatedAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
                    }
                    
                    $flightSeats += $seat
                    $seatCounter++
                }
            }
            
            $flightCounter++
        }
    }
}

# Save to JSON files
$flightsJson = $flights | ConvertTo-Json -Depth 20
$flightsJson | Out-File -FilePath "flights.json" -Encoding UTF8

$seatsJson = $flightSeats | ConvertTo-Json -Depth 20
$seatsJson | Out-File -FilePath "flightseat.json" -Encoding UTF8

Write-Host "✓ Generated $($flights.Count) flights in flights.json" -ForegroundColor Green
Write-Host "✓ Generated $($flightSeats.Count) flight seats in flightseat.json" -ForegroundColor Green
Write-Host "  - Each flight has exactly 24 seats (4 Business + 20 Economy)" -ForegroundColor Cyan
Write-Host "  - All flights cover next 30 days from $($currentDate.ToString('yyyy-MM-dd'))" -ForegroundColor Cyan
Write-Host "  - Routes covered: $($routes.Count) routes, 2 flights per route per day" -ForegroundColor Cyan
