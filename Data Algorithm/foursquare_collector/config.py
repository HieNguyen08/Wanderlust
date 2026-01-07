"""
Foursquare Places API Configuration
Free tier: 10,000 requests/month
Each request returns ~50 venues
Total capacity: ~500,000 venues
"""

# API Configuration - Foursquare API v2
CLIENT_ID = "RAFLBRXUFCPUA4AR1VCZ1ZMRTS1PGGYH1GYA2042VEVNPVDI"
CLIENT_SECRET = "LFEFSTA0CTJ2ZD1L3CGLLJXXDTZKKW2IDGHB12HQQL40IJUJ"
API_VERSION = "20230101"  # YYYYMMDD format required by v2 API
API_BASE_URL = "https://api.foursquare.com/v2"

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "wanderlust_ai"
COLLECTION_NAME = "pois"

# Collection Settings
BATCH_SIZE = 50  # Venues per API request
MAX_RADIUS = 50000  # 50km search radius (max allowed by Foursquare)
REQUESTS_PER_SECOND = 2  # Rate limiting to stay within quota

# Target regions - same as before
REGIONS = {
    "Vietnam": {
        "regions": [
            {"name": "Hà Nội", "lat": 21.0285, "lng": 105.8542},
            {"name": "TP Hồ Chí Minh", "lat": 10.8231, "lng": 106.6297},
            {"name": "Đà Nẵng", "lat": 16.0544, "lng": 108.2022},
            {"name": "Hội An", "lat": 15.8801, "lng": 108.3380},
            {"name": "Nha Trang", "lat": 12.2388, "lng": 109.1967},
            {"name": "Đà Lạt", "lat": 11.9404, "lng": 108.4583},
            {"name": "Phú Quốc", "lat": 10.2898, "lng": 103.9844},
            {"name": "Huế", "lat": 16.4637, "lng": 107.5909},
            {"name": "Hạ Long", "lat": 20.9540, "lng": 107.0436},
            {"name": "Sa Pa", "lat": 22.3364, "lng": 103.8438}
        ]
    },
    "Thailand": {
        "regions": [
            {"name": "Bangkok", "lat": 13.7563, "lng": 100.5018},
            {"name": "Chiang Mai", "lat": 18.7883, "lng": 98.9853},
            {"name": "Phuket", "lat": 7.8804, "lng": 98.3923},
            {"name": "Pattaya", "lat": 12.9236, "lng": 100.8825},
            {"name": "Krabi", "lat": 8.0863, "lng": 98.9063},
            {"name": "Ayutthaya", "lat": 14.3692, "lng": 100.5877},
            {"name": "Koh Samui", "lat": 9.5357, "lng": 100.0629},
            {"name": "Hua Hin", "lat": 12.5684, "lng": 99.9576}
        ]
    },
    "Singapore": {
        "regions": [
            {"name": "Singapore Central", "lat": 1.3521, "lng": 103.8198},
            {"name": "Sentosa", "lat": 1.2494, "lng": 103.8303},
            {"name": "Marina Bay", "lat": 1.2868, "lng": 103.8545},
            {"name": "Orchard", "lat": 1.3048, "lng": 103.8318}
        ]
    },
    "Malaysia": {
        "regions": [
            {"name": "Kuala Lumpur", "lat": 3.1390, "lng": 101.6869},
            {"name": "Penang", "lat": 5.4164, "lng": 100.3327},
            {"name": "Malacca", "lat": 2.1896, "lng": 102.2501},
            {"name": "Langkawi", "lat": 6.3500, "lng": 99.8000},
            {"name": "Johor Bahru", "lat": 1.4927, "lng": 103.7414}
        ]
    },
    "Indonesia": {
        "regions": [
            {"name": "Jakarta", "lat": -6.2088, "lng": 106.8456},
            {"name": "Bali - Denpasar", "lat": -8.6705, "lng": 115.2126},
            {"name": "Bali - Ubud", "lat": -8.5069, "lng": 115.2625},
            {"name": "Yogyakarta", "lat": -7.7956, "lng": 110.3695},
            {"name": "Bandung", "lat": -6.9175, "lng": 107.6191},
            {"name": "Lombok", "lat": -8.5833, "lng": 116.3167}
        ]
    },
    "Philippines": {
        "regions": [
            {"name": "Manila", "lat": 14.5995, "lng": 120.9842},
            {"name": "Cebu", "lat": 10.3157, "lng": 123.8854},
            {"name": "Boracay", "lat": 11.9674, "lng": 121.9248},
            {"name": "Palawan", "lat": 9.8349, "lng": 118.7384}
        ]
    },
    "Cambodia": {
        "regions": [
            {"name": "Phnom Penh", "lat": 11.5564, "lng": 104.9282},
            {"name": "Siem Reap", "lat": 13.3671, "lng": 103.8448},
            {"name": "Sihanoukville", "lat": 10.6090, "lng": 103.5296}
        ]
    },
    "Laos": {
        "regions": [
            {"name": "Vientiane", "lat": 17.9757, "lng": 102.6331},
            {"name": "Luang Prabang", "lat": 19.8845, "lng": 102.1349},
            {"name": "Vang Vieng", "lat": 18.9333, "lng": 102.4500}
        ]
    },
    "Myanmar": {
        "regions": [
            {"name": "Yangon", "lat": 16.8661, "lng": 96.1951},
            {"name": "Bagan", "lat": 21.1717, "lng": 94.8578},
            {"name": "Mandalay", "lat": 21.9588, "lng": 96.0891}
        ]
    },
    "Japan": {
        "regions": [
            {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
            {"name": "Kyoto", "lat": 35.0116, "lng": 135.7681},
            {"name": "Osaka", "lat": 34.6937, "lng": 135.5023},
            {"name": "Hokkaido - Sapporo", "lat": 43.0642, "lng": 141.3469},
            {"name": "Fukuoka", "lat": 33.5904, "lng": 130.4017},
            {"name": "Hiroshima", "lat": 34.3853, "lng": 132.4553},
            {"name": "Nara", "lat": 34.6851, "lng": 135.8048},
            {"name": "Okinawa", "lat": 26.2124, "lng": 127.6809}
        ]
    },
    "South Korea": {
        "regions": [
            {"name": "Seoul", "lat": 37.5665, "lng": 126.9780},
            {"name": "Busan", "lat": 35.1796, "lng": 129.0756},
            {"name": "Jeju Island", "lat": 33.4996, "lng": 126.5312},
            {"name": "Incheon", "lat": 37.4563, "lng": 126.7052},
            {"name": "Gyeongju", "lat": 35.8562, "lng": 129.2247}
        ]
    },
    "China": {
        "regions": [
            {"name": "Beijing", "lat": 39.9042, "lng": 116.4074},
            {"name": "Shanghai", "lat": 31.2304, "lng": 121.4737},
            {"name": "Hong Kong", "lat": 22.3193, "lng": 114.1694},
            {"name": "Guangzhou", "lat": 23.1291, "lng": 113.2644},
            {"name": "Chengdu", "lat": 30.5728, "lng": 104.0668},
            {"name": "Xi'an", "lat": 34.3416, "lng": 108.9398},
            {"name": "Hangzhou", "lat": 30.2741, "lng": 120.1551},
            {"name": "Shenzhen", "lat": 22.5431, "lng": 114.0579}
        ]
    },
    "Taiwan": {
        "regions": [
            {"name": "Taipei", "lat": 25.0330, "lng": 121.5654},
            {"name": "Kaohsiung", "lat": 22.6273, "lng": 120.3014},
            {"name": "Taichung", "lat": 24.1477, "lng": 120.6736},
            {"name": "Tainan", "lat": 22.9997, "lng": 120.2270}
        ]
    },
    "India": {
        "regions": [
            {"name": "Delhi", "lat": 28.7041, "lng": 77.1025},
            {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777},
            {"name": "Bangalore", "lat": 12.9716, "lng": 77.5946},
            {"name": "Goa", "lat": 15.2993, "lng": 74.1240},
            {"name": "Jaipur", "lat": 26.9124, "lng": 75.7873},
            {"name": "Kerala - Kochi", "lat": 9.9312, "lng": 76.2673}
        ]
    }
}

# Foursquare Category IDs for filtering
# Corresponds to your existing categories
CATEGORY_MAPPING = {
    "restaurant": "13065",  # Food & Dining
    "cafe": "13034",  # Coffee Shop
    "tourist_attraction": "16000",  # Landmarks & Outdoors
    "accommodation": "19014",  # Hotel
    "temple": "12106",  # Temple
    "historical": "16000",  # Landmarks (includes historical)
    "museum": "10027",  # Museum
    "beach": "16003",  # Beach
    "mountain": "16032",  # Mountain
    "nature": "16000",  # Outdoors & Recreation
    "shopping": "17000",  # Retail
    "entertainment": "10000"  # Arts & Entertainment
}

# Fields to collect from Foursquare
FIELDS = [
    "fsq_id",
    "name",
    "geocodes",
    "location",
    "categories",
    "closed_bucket",  # CRITICAL: Shows if place is closed
    "distance",
    "popularity",
    "rating",
    "stats",
    "price",
    "hours",
    "photos",
    "tips",
    "website",
    "tel",
    "email",
    "verified"  # CRITICAL: Verified by business owner
]
