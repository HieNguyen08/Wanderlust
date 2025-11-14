import json
from datetime import datetime, timedelta
import random

# Dữ liệu sân bay
airports = {
    "SGN": {"name": "Sân bay Tân Sơn Nhất", "city": "TP. Hồ Chí Minh", "terminal": "Nhà ga 1"},
    "HAN": {"name": "Sân bay Nội Bài", "city": "Hà Nội", "terminal": "Nhà ga 1"},
    "DAD": {"name": "Sân bay Đà Nẵng", "city": "Đà Nẵng", "terminal": "Nhà ga 1"},
    "PQC": {"name": "Sân bay Phú Quốc", "city": "Phú Quốc", "terminal": "Nhà ga 1"},
    "CXR": {"name": "Sân bay Cam Ranh", "city": "Nha Trang", "terminal": "Nhà ga 1"},
    "HPH": {"name": "Sân bay Cát Bi", "city": "Hải Phòng", "terminal": "Nhà ga 1"},
    "VII": {"name": "Sân bay Vinh", "city": "Vinh", "terminal": "Nhà ga 1"},
    "HUI": {"name": "Sân bay Phú Bài", "city": "Huế", "terminal": "Nhà ga 1"},
    "VCA": {"name": "Sân bay Cần Thơ", "city": "Cần Thơ", "terminal": "Nhà ga 1"},
    "DLI": {"name": "Sân bay Liên Khương", "city": "Đà Lạt", "terminal": "Nhà ga 1"},
    "SIN": {"name": "Singapore Changi Airport", "city": "Singapore", "terminal": "Terminal 1"},
    "BKK": {"name": "Suvarnabhumi Airport", "city": "Bangkok", "terminal": "Terminal 1"},
    "KUL": {"name": "Kuala Lumpur International", "city": "Kuala Lumpur", "terminal": "KLIA"},
    "HKT": {"name": "Phuket International", "city": "Phuket", "terminal": "Terminal 1"},
}

# Hãng hàng không
airlines = {
    "VN": {"name": "Vietnam Airlines", "logo": "https://images.wanderlust.com/airlines/vn-logo.png"},
    "VJ": {"name": "VietJet Air", "logo": "https://images.wanderlust.com/airlines/vj-logo.png"},
    "BL": {"name": "Pacific Airlines", "logo": "https://images.wanderlust.com/airlines/bl-logo.png"},
    "QH": {"name": "Bamboo Airways", "logo": "https://images.wanderlust.com/airlines/qh-logo.png"},
}

# Tuyến bay phổ biến (domestic + international)
popular_routes = [
    # Domestic
    ("SGN", "HAN", 135, 1180, False),
    ("HAN", "SGN", 135, 1180, False),
    ("SGN", "DAD", 80, 610, False),
    ("DAD", "SGN", 80, 610, False),
    ("HAN", "DAD", 70, 615, False),
    ("DAD", "HAN", 70, 615, False),
    ("SGN", "PQC", 60, 310, False),
    ("PQC", "SGN", 60, 310, False),
    ("SGN", "CXR", 50, 340, False),
    ("CXR", "SGN", 50, 340, False),
    ("HAN", "PQC", 150, 1480, False),
    ("PQC", "HAN", 150, 1480, False),
    ("SGN", "DLI", 45, 220, False),
    ("DLI", "SGN", 45, 220, False),
    ("HAN", "HPH", 40, 90, False),
    ("HPH", "HAN", 40, 90, False),
    ("SGN", "VCA", 40, 160, False),
    ("VCA", "SGN", 40, 160, False),
    ("DAD", "PQC", 110, 770, False),
    ("PQC", "DAD", 110, 770, False),
    # International
    ("SGN", "SIN", 120, 1080, True),
    ("SIN", "SGN", 120, 1080, True),
    ("HAN", "SIN", 190, 2360, True),
    ("SIN", "HAN", 190, 2360, True),
    ("SGN", "BKK", 90, 730, True),
    ("BKK", "SGN", 90, 730, True),
    ("HAN", "BKK", 140, 1120, True),
    ("BKK", "HAN", 140, 1120, True),
    ("SGN", "KUL", 110, 1090, True),
    ("KUL", "SGN", 110, 1090, True),
    ("SGN", "HKT", 110, 890, True),
    ("HKT", "SGN", 110, 890, True),
]

# Aircraft types
aircraft_types = [
    {"type": "Airbus A321", "code": "A321", "seats": 180},
    {"type": "Airbus A320", "code": "A320", "seats": 164},
    {"type": "Boeing 787", "code": "B787", "seats": 290},
    {"type": "ATR 72", "code": "ATR72", "seats": 70},
]

# Time slots
time_slots = ["06:00", "07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"]

flights = []
flight_counter = 1

# Generate 100 flights
for i in range(100):
    # Random route
    route = random.choice(popular_routes)
    dep_code, arr_code, duration, distance, is_intl = route
    
    # Random airline
    airline_code = random.choice(list(airlines.keys()))
    airline = airlines[airline_code]
    
    # Random aircraft
    aircraft = random.choice(aircraft_types)
    
    # Random date (next 7 days)
    days_ahead = random.randint(0, 6)
    flight_date = datetime(2025, 11, 14) + timedelta(days=days_ahead)
    
    # Random time slot
    time_str = random.choice(time_slots)
    hour, minute = map(int, time_str.split(':'))
    dep_time = flight_date.replace(hour=hour, minute=minute)
    arr_time = dep_time + timedelta(minutes=duration)
    
    # Flight number
    flight_num = f"{airline_code}{200 + flight_counter}"
    
    # Prices (higher for international)
    if is_intl:
        eco_base = random.randint(2500000, 4000000)
    else:
        eco_base = random.randint(800000, 1500000)
    
    eco_flex = int(eco_base * 1.45)
    peco = int(eco_base * 1.85)
    biz = int(eco_base * 3.0)
    
    # Available seats
    total_seats = aircraft["seats"]
    available = random.randint(int(total_seats * 0.4), int(total_seats * 0.8))
    
    flight = {
        "flightNumber": flight_num,
        "airlineCode": airline_code,
        "airlineName": airline["name"],
        "airlineLogo": airline["logo"],
        "departureAirportCode": dep_code,
        "departureAirportName": airports[dep_code]["name"],
        "departureCity": airports[dep_code]["city"],
        "departureTerminal": airports[dep_code]["terminal"],
        "departureTime": dep_time.isoformat(),
        "arrivalAirportCode": arr_code,
        "arrivalAirportName": airports[arr_code]["name"],
        "arrivalCity": airports[arr_code]["city"],
        "arrivalTerminal": airports[arr_code]["terminal"],
        "arrivalTime": arr_time.isoformat(),
        "durationMinutes": duration,
        "durationDisplay": f"{duration // 60}h {duration % 60:02d}p" if duration >= 60 else f"{duration}p",
        "distanceKm": distance,
        "isDirect": True,
        "stops": 0,
        "stopInfo": [],
        "aircraftType": aircraft["type"],
        "aircraftCode": aircraft["code"],
        "cabinClasses": {
            "economy": {
                "available": True,
                "fromPrice": eco_base,
                "fares": [
                    {
                        "id": "eco-standard",
                        "name": "Phổ thông Tiêu chuẩn",
                        "price": eco_base,
                        "baggage": "7kg xách tay",
                        "checkedBag": "Không" if airline_code == "VJ" else "20kg",
                        "refundable": False,
                        "changeable": False,
                        "miles": 500,
                        "availableSeats": int(available * 0.45)
                    },
                    {
                        "id": "eco-flex",
                        "name": "Phổ thông Linh hoạt",
                        "price": eco_flex,
                        "baggage": "7kg xách tay",
                        "checkedBag": "23kg",
                        "refundable": True,
                        "changeable": True,
                        "miles": 750,
                        "availableSeats": int(available * 0.30)
                    }
                ]
            },
            "premiumEconomy": {
                "available": airline_code in ["VN", "QH"],
                "fromPrice": peco,
                "fares": [
                    {
                        "id": "peco-standard",
                        "name": "Phổ thông Đặc biệt",
                        "price": peco,
                        "baggage": "10kg xách tay",
                        "checkedBag": "25kg",
                        "refundable": True,
                        "changeable": True,
                        "miles": 1000,
                        "availableSeats": int(available * 0.15)
                    }
                ]
            },
            "business": {
                "available": airline_code in ["VN", "QH"] and total_seats > 150,
                "fromPrice": biz,
                "fares": [
                    {
                        "id": "biz-standard",
                        "name": "Thương gia Tiêu chuẩn",
                        "price": biz,
                        "baggage": "15kg xách tay",
                        "checkedBag": "32kg",
                        "refundable": True,
                        "changeable": True,
                        "miles": 2000,
                        "availableSeats": int(available * 0.10)
                    }
                ]
            }
        },
        "status": "SCHEDULED",
        "totalSeats": total_seats,
        "availableSeats": available,
        "amenities": ["wifi", "meal", "entertainment"] if airline_code in ["VN", "QH"] else ["entertainment"],
        "operatedBy": airline["name"],
        "isInternational": is_intl
    }
    
    flights.append(flight)
    flight_counter += 1

# Save to JSON
with open('flights.json', 'w', encoding='utf-8') as f:
    json.dump(flights, f, ensure_ascii=False, indent=2)

print(f"✅ Generated {len(flights)} flights successfully!")
print(f"📊 Domestic: {sum(1 for f in flights if not f['isInternational'])}")
print(f"🌍 International: {sum(1 for f in flights if f['isInternational'])}")
