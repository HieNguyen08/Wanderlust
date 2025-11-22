# PowerShell script to generate flights.json
# Updated: Generate data for the next 30 days from NOW

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
    @{type="Airbus A321"; code="A321"; seats=180}
    @{type="Airbus A320"; code="A320"; seats=164}
    @{type="Boeing 787"; code="B787"; seats=290}
    @{type="ATR 72"; code="ATR72"; seats=70}
)

$times = @("06:00", "07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00")

$flights = @()
$counter = 200

# 2. Configuration for 30 Days
$currentDate = Get-Date
$totalDaysToGenerate = 30
# Tăng số lượng chuyến bay lên để đảm bảo ngày nào cũng có dữ liệu
# 1000 chuyến / 30 ngày = khoảng 33 chuyến/ngày
$totalFlightsToGenerate = 1000 

Write-Host "Generating $totalFlightsToGenerate flights starting from $($currentDate.ToString('yyyy-MM-dd')) for next 30 days..." -ForegroundColor Yellow

for ($i = 0; $i -lt $totalFlightsToGenerate; $i++) {
    $route = $routes | Get-Random
    $airlineCode = @("VN", "VJ", "BL", "QH") | Get-Random
    $airline = $airlines[$airlineCode]
    $ac = $aircraft | Get-Random
    
    # LOGIC THAY ĐỔI Ở ĐÂY: Random từ 0 đến 30 ngày
    $daysAhead = Get-Random -Minimum 0 -Maximum $totalDaysToGenerate
    $date = $currentDate.AddDays($daysAhead)
    
    $time = $times | Get-Random
    $hour, $min = $time -split ":"
    $depTime = $date.Date.AddHours([int]$hour).AddMinutes([int]$min)
    $arrTime = $depTime.AddMinutes($route.dur)
    
    $flightNum = "$airlineCode$counter"
    
    if ($route.intl) {
        $ecoBase = Get-Random -Minimum 2500000 -Maximum 4000000
    } else {
        $ecoBase = Get-Random -Minimum 800000 -Maximum 1500000
    }
    
    $ecoFlex = [int]($ecoBase * 1.45)
    $peco = [int]($ecoBase * 1.85)
    $biz = [int]($ecoBase * 3.0)
    
    $totalSeats = $ac.seats
    $available = Get-Random -Minimum ([int]($totalSeats * 0.4)) -Maximum ([int]($totalSeats * 0.8))
    
    $flight = [PSCustomObject]@{
        flightNumber = $flightNum
        airlineCode = $airlineCode
        airlineName = $airline.name
        airlineLogo = $airline.logo
        departureAirportCode = $route.from
        departureAirportName = $airports[$route.from].name
        departureCity = $airports[$route.from].city
        departureTerminal = $airports[$route.from].terminal
        # Format ngày tháng chuẩn ISO 8601 để Java dễ đọc
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
                        availableSeats = [int]($available * 0.45)
                    },
                    @{
                        id = "eco-flex"
                        name = "Economy Flex"
                        price = $ecoFlex
                        baggage = "7kg carry-on"
                        checkedBag = "23kg"
                        refundable = $true
                        changeable = $true
                        miles = 750
                        availableSeats = [int]($available * 0.30)
                    }
                )
            }
            premiumEconomy = @{
                available = ($airlineCode -in @("VN", "QH"))
                fromPrice = $peco
                fares = @(
                    @{
                        id = "peco-standard"
                        name = "Premium Economy"
                        price = $peco
                        baggage = "10kg carry-on"
                        checkedBag = "25kg"
                        refundable = $true
                        changeable = $true
                        miles = 1000
                        availableSeats = [int]($available * 0.15)
                    }
                )
            }
            business = @{
                available = (($airlineCode -in @("VN", "QH")) -and ($totalSeats -gt 150))
                fromPrice = $biz
                fares = @(
                    @{
                        id = "biz-standard"
                        name = "Business Class"
                        price = $biz
                        baggage = "15kg carry-on"
                        checkedBag = "32kg"
                        refundable = $true
                        changeable = $true
                        miles = 2000
                        availableSeats = [int]($available * 0.10)
                    }
                )
            }
        }
        status = "SCHEDULED"
        totalSeats = $totalSeats
        availableSeats = $available
        amenities = if ($airlineCode -in @("VN", "QH")) { ,@("wifi", "meal", "entertainment") } else { ,@("entertainment") }
        operatedBy = $airline.name
        isInternational = $route.intl
    }
    
    $flights += $flight
    $counter++
}

$json = $flights | ConvertTo-Json -Depth 20
$json | Out-File -FilePath "flights.json" -Encoding UTF8

Write-Host "Success! Generated $($flights.Count) flights in flights.json" -ForegroundColor Green