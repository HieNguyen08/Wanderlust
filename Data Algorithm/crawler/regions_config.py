"""
Comprehensive regions configuration for data crawling
Vietnam: 63 provinces
Southeast Asia: 8 countries
East Asia: 5 countries/regions
"""

from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class Region:
    """Region configuration with bounding box"""
    name: str
    name_en: str
    bbox: Tuple[float, float, float, float]  # (south, west, north, east)
    country: str
    priority: int  # 1=High, 2=Medium, 3=Low
    estimated_pois: int

# ============================================================================
# VIETNAM - 63 Provinces/Cities
# ============================================================================

VIETNAM_PROVINCES = [
    # Region 1: Red River Delta (Đồng bằng sông Hồng)
    Region("Hà Nội", "Hanoi", (20.95, 105.70, 21.35, 106.00), "Vietnam", 1, 20000),
    Region("Hải Phòng", "Hai Phong", (20.70, 106.50, 20.95, 106.85), "Vietnam", 1, 5000),
    Region("Hải Dương", "Hai Duong", (20.80, 106.20, 21.05, 106.50), "Vietnam", 2, 2000),
    Region("Hưng Yên", "Hung Yen", (20.60, 105.85, 20.85, 106.15), "Vietnam", 3, 1000),
    Region("Bắc Ninh", "Bac Ninh", (21.05, 106.00, 21.25, 106.20), "Vietnam", 2, 1500),
    Region("Vĩnh Phúc", "Vinh Phuc", (21.20, 105.40, 21.50, 105.75), "Vietnam", 2, 1500),
    Region("Thái Bình", "Thai Binh", (20.35, 106.25, 20.60, 106.60), "Vietnam", 3, 1000),
    Region("Nam Định", "Nam Dinh", (20.20, 106.05, 20.60, 106.40), "Vietnam", 2, 1500),
    Region("Hà Nam", "Ha Nam", (20.45, 105.85, 20.65, 106.10), "Vietnam", 3, 800),
    Region("Ninh Bình", "Ninh Binh", (20.15, 105.80, 20.45, 106.15), "Vietnam", 1, 3000),
    
    # Region 2: Northeast (Đông Bắc)
    Region("Quảng Ninh", "Quang Ninh", (20.80, 106.80, 21.35, 107.80), "Vietnam", 1, 8000),
    Region("Lạng Sơn", "Lang Son", (21.60, 106.50, 22.00, 107.05), "Vietnam", 2, 1500),
    Region("Cao Bằng", "Cao Bang", (22.30, 105.80, 22.85, 106.60), "Vietnam", 2, 2000),
    Region("Bắc Kạn", "Bac Kan", (22.00, 105.70, 22.50, 106.15), "Vietnam", 3, 1000),
    Region("Thái Nguyên", "Thai Nguyen", (21.45, 105.70, 21.80, 106.15), "Vietnam", 2, 2000),
    Region("Bắc Giang", "Bac Giang", (21.15, 106.00, 21.55, 106.60), "Vietnam", 2, 1500),
    Region("Phú Thọ", "Phu Tho", (21.15, 104.85, 21.60, 105.45), "Vietnam", 2, 2000),
    Region("Tuyên Quang", "Tuyen Quang", (21.70, 104.90, 22.15, 105.60), "Vietnam", 3, 1000),
    
    # Region 3: Northwest (Tây Bắc)
    Region("Lào Cai", "Lao Cai", (22.25, 103.70, 22.70, 104.50), "Vietnam", 1, 5000),
    Region("Điện Biên", "Dien Bien", (21.20, 102.80, 21.80, 103.50), "Vietnam", 2, 1500),
    Region("Lai Châu", "Lai Chau", (21.90, 102.90, 22.60, 103.60), "Vietnam", 2, 1500),
    Region("Sơn La", "Son La", (20.70, 103.50, 21.50, 104.60), "Vietnam", 2, 2000),
    Region("Yên Bái", "Yen Bai", (21.50, 104.30, 22.10, 105.10), "Vietnam", 2, 2000),
    Region("Hòa Bình", "Hoa Binh", (20.50, 105.15, 21.00, 105.70), "Vietnam", 2, 2000),
    
    # Region 4: North Central Coast (Bắc Trung Bộ)
    Region("Thanh Hóa", "Thanh Hoa", (19.35, 104.80, 20.45, 106.00), "Vietnam", 2, 3000),
    Region("Nghệ An", "Nghe An", (18.50, 104.50, 19.85, 105.90), "Vietnam", 2, 3000),
    Region("Hà Tĩnh", "Ha Tinh", (18.15, 105.50, 18.75, 106.30), "Vietnam", 2, 1500),
    Region("Quảng Bình", "Quang Binh", (17.30, 105.95, 17.85, 106.80), "Vietnam", 1, 3000),
    Region("Quảng Trị", "Quang Tri", (16.60, 106.70, 17.15, 107.30), "Vietnam", 2, 1500),
    Region("Thừa Thiên Huế", "Thua Thien Hue", (16.15, 107.25, 16.70, 107.85), "Vietnam", 1, 5000),
    
    # Region 5: South Central Coast (Nam Trung Bộ)
    Region("Đà Nẵng", "Da Nang", (15.90, 107.90, 16.25, 108.35), "Vietnam", 1, 8000),
    Region("Quảng Nam", "Quang Nam", (15.05, 107.60, 16.05, 108.50), "Vietnam", 1, 4000),
    Region("Quảng Ngãi", "Quang Ngai", (14.60, 108.45, 15.45, 109.00), "Vietnam", 2, 2000),
    Region("Bình Định", "Binh Dinh", (13.70, 108.70, 14.60, 109.40), "Vietnam", 2, 2500),
    Region("Phú Yên", "Phu Yen", (12.90, 108.85, 13.60, 109.50), "Vietnam", 2, 2000),
    Region("Khánh Hòa", "Khanh Hoa", (11.95, 108.95, 12.75, 109.45), "Vietnam", 1, 6000),
    Region("Ninh Thuận", "Ninh Thuan", (11.35, 108.60, 12.00, 109.30), "Vietnam", 2, 1500),
    Region("Bình Thuận", "Binh Thuan", (10.55, 107.70, 11.45, 108.90), "Vietnam", 1, 4000),
    
    # Region 6: Central Highlands (Tây Nguyên)
    Region("Kon Tum", "Kon Tum", (14.15, 107.50, 15.05, 108.30), "Vietnam", 2, 2000),
    Region("Gia Lai", "Gia Lai", (13.50, 107.70, 14.50, 108.70), "Vietnam", 2, 2000),
    Region("Đắk Lắk", "Dak Lak", (12.40, 107.65, 13.45, 108.70), "Vietnam", 2, 3000),
    Region("Đắk Nông", "Dak Nong", (11.95, 107.40, 12.60, 108.30), "Vietnam", 3, 1000),
    Region("Lâm Đồng", "Lam Dong", (11.25, 107.50, 12.45, 108.70), "Vietnam", 1, 5000),
    
    # Region 7: Southeast (Đông Nam Bộ)
    Region("Hồ Chí Minh", "Ho Chi Minh", (10.55, 106.40, 11.00, 106.95), "Vietnam", 1, 25000),
    Region("Bình Phước", "Binh Phuoc", (11.35, 106.50, 12.10, 107.35), "Vietnam", 2, 1500),
    Region("Tây Ninh", "Tay Ninh", (11.05, 105.95, 11.65, 106.50), "Vietnam", 2, 1500),
    Region("Bình Dương", "Binh Duong", (10.90, 106.45, 11.35, 106.95), "Vietnam", 2, 3000),
    Region("Đồng Nai", "Dong Nai", (10.65, 106.80, 11.35, 107.55), "Vietnam", 2, 3000),
    Region("Bà Rịa - Vũng Tàu", "Ba Ria - Vung Tau", (10.25, 107.00, 10.80, 107.50), "Vietnam", 1, 4000),
    
    # Region 8: Mekong Delta (Đồng bằng sông Cửu Long)
    Region("Long An", "Long An", (10.40, 105.95, 10.95, 106.60), "Vietnam", 2, 1500),
    Region("Tiền Giang", "Tien Giang", (10.15, 105.95, 10.65, 106.55), "Vietnam", 2, 2000),
    Region("Bến Tre", "Ben Tre", (9.95, 106.15, 10.40, 106.70), "Vietnam", 2, 1500),
    Region("Trà Vinh", "Tra Vinh", (9.60, 106.10, 10.10, 106.60), "Vietnam", 2, 1500),
    Region("Vĩnh Long", "Vinh Long", (9.95, 105.80, 10.35, 106.20), "Vietnam", 2, 1500),
    Region("Đồng Tháp", "Dong Thap", (10.25, 105.40, 10.85, 105.90), "Vietnam", 2, 1500),
    Region("An Giang", "An Giang", (10.25, 104.90, 10.85, 105.50), "Vietnam", 2, 2000),
    Region("Kiên Giang", "Kien Giang", (9.55, 104.50, 10.60, 105.30), "Vietnam", 1, 5000),
    Region("Cần Thơ", "Can Tho", (9.95, 105.55, 10.25, 105.95), "Vietnam", 1, 3000),
    Region("Hậu Giang", "Hau Giang", (9.50, 105.40, 9.95, 105.85), "Vietnam", 2, 1200),
    Region("Sóc Trăng", "Soc Trang", (9.35, 105.85, 9.85, 106.25), "Vietnam", 2, 1500),
    Region("Bạc Liêu", "Bac Lieu", (9.05, 105.45, 9.55, 105.90), "Vietnam", 2, 1500),
    Region("Cà Mau", "Ca Mau", (8.55, 104.70, 9.35, 105.50), "Vietnam", 2, 1500),
]

# ============================================================================
# SOUTHEAST ASIA - 8 Countries
# ============================================================================

SOUTHEAST_ASIA = [
    # Thailand (ประเทศไทย)
    Region("Bangkok", "Bangkok", (13.50, 100.30, 13.95, 100.70), "Thailand", 1, 15000),
    Region("Chiang Mai", "Chiang Mai", (18.60, 98.80, 19.05, 99.15), "Thailand", 1, 5000),
    Region("Phuket", "Phuket", (7.75, 98.25, 8.20, 98.45), "Thailand", 1, 5000),
    Region("Pattaya", "Pattaya", (12.85, 100.80, 13.00, 101.00), "Thailand", 1, 3000),
    Region("Krabi", "Krabi", (7.95, 98.75, 8.25, 99.05), "Thailand", 2, 2000),
    Region("Ayutthaya", "Ayutthaya", (14.25, 100.45, 14.50, 100.65), "Thailand", 2, 1500),
    
    # Singapore (新加坡)
    Region("Singapore", "Singapore", (1.20, 103.60, 1.47, 104.05), "Singapore", 1, 10000),
    
    # Malaysia (مليسيا)
    Region("Kuala Lumpur", "Kuala Lumpur", (3.00, 101.55, 3.25, 101.80), "Malaysia", 1, 8000),
    Region("Penang", "Penang", (5.20, 100.20, 5.50, 100.35), "Malaysia", 1, 4000),
    Region("Malacca", "Malacca", (2.15, 102.15, 2.30, 102.35), "Malaysia", 2, 2000),
    Region("Langkawi", "Langkawi", (6.25, 99.65, 6.50, 99.90), "Malaysia", 2, 2000),
    Region("Johor Bahru", "Johor Bahru", (1.40, 103.65, 1.55, 103.85), "Malaysia", 2, 2000),
    
    # Indonesia
    Region("Jakarta", "Jakarta", (-6.35, 106.70, -6.05, 107.00), "Indonesia", 1, 10000),
    Region("Bali", "Bali", (-8.85, 114.90, -8.05, 115.75), "Indonesia", 1, 8000),
    Region("Yogyakarta", "Yogyakarta", (-8.00, 110.25, -7.70, 110.55), "Indonesia", 1, 4000),
    Region("Bandung", "Bandung", (-7.05, 107.50, -6.80, 107.75), "Indonesia", 2, 3000),
    Region("Surabaya", "Surabaya", (-7.40, 112.60, -7.15, 112.85), "Indonesia", 2, 3000),
    
    # Philippines (Pilipinas)
    Region("Manila", "Manila", (14.45, 120.90, 14.75, 121.15), "Philippines", 1, 8000),
    Region("Cebu", "Cebu", (10.20, 123.80, 10.45, 124.05), "Philippines", 1, 4000),
    Region("Boracay", "Boracay", (11.90, 121.90, 12.05, 122.05), "Philippines", 2, 2000),
    Region("Palawan", "Palawan", (9.50, 118.00, 11.00, 119.50), "Philippines", 2, 3000),
    
    # Cambodia (កម្ពុជា)
    Region("Phnom Penh", "Phnom Penh", (11.50, 104.85, 11.65, 105.00), "Cambodia", 1, 3000),
    Region("Siem Reap", "Siem Reap", (13.30, 103.80, 13.45, 103.95), "Cambodia", 1, 3000),
    Region("Sihanoukville", "Sihanoukville", (10.55, 103.45, 10.70, 103.60), "Cambodia", 2, 1500),
    
    # Laos (ລາວ)
    Region("Vientiane", "Vientiane", (17.90, 102.55, 18.05, 102.70), "Laos", 1, 2000),
    Region("Luang Prabang", "Luang Prabang", (19.85, 102.10, 19.95, 102.20), "Laos", 1, 2000),
    Region("Vang Vieng", "Vang Vieng", (18.90, 102.40, 18.95, 102.50), "Laos", 2, 1000),
    
    # Myanmar (မြန်မာ)
    Region("Yangon", "Yangon", (16.70, 96.05, 16.95, 96.25), "Myanmar", 1, 4000),
    Region("Mandalay", "Mandalay", (21.90, 95.95, 22.10, 96.15), "Myanmar", 2, 2000),
    Region("Bagan", "Bagan", (21.10, 94.80, 21.25, 95.00), "Myanmar", 1, 2000),
]

# ============================================================================
# EAST ASIA - 5 Countries/Regions
# ============================================================================

EAST_ASIA = [
    # Japan (日本)
    Region("Tokyo", "Tokyo", (35.50, 139.50, 35.85, 139.95), "Japan", 1, 20000),
    Region("Osaka", "Osaka", (34.55, 135.35, 34.80, 135.65), "Japan", 1, 10000),
    Region("Kyoto", "Kyoto", (34.90, 135.65, 35.10, 135.85), "Japan", 1, 8000),
    Region("Hokkaido", "Hokkaido", (42.80, 141.20, 43.25, 141.70), "Japan", 2, 5000),
    Region("Fukuoka", "Fukuoka", (33.50, 130.30, 33.70, 130.50), "Japan", 2, 4000),
    Region("Okinawa", "Okinawa", (26.10, 127.60, 26.40, 127.90), "Japan", 2, 3000),
    
    # South Korea (대한민국)
    Region("Seoul", "Seoul", (37.40, 126.80, 37.70, 127.20), "South Korea", 1, 15000),
    Region("Busan", "Busan", (35.00, 128.95, 35.30, 129.25), "South Korea", 1, 6000),
    Region("Jeju", "Jeju", (33.25, 126.30, 33.55, 126.90), "South Korea", 1, 5000),
    Region("Incheon", "Incheon", (37.35, 126.55, 37.55, 126.75), "South Korea", 2, 3000),
    
    # China (中国) - Major tourist cities
    Region("Beijing", "Beijing", (39.70, 116.20, 40.10, 116.60), "China", 1, 20000),
    Region("Shanghai", "Shanghai", (30.95, 121.20, 31.45, 121.75), "China", 1, 18000),
    Region("Guangzhou", "Guangzhou", (22.95, 113.10, 23.35, 113.50), "China", 1, 10000),
    Region("Shenzhen", "Shenzhen", (22.45, 113.80, 22.75, 114.30), "China", 1, 8000),
    Region("Chengdu", "Chengdu", (30.50, 103.90, 30.85, 104.30), "China", 2, 6000),
    Region("Xi'an", "Xi'an", (34.15, 108.80, 34.45, 109.10), "China", 1, 5000),
    Region("Hangzhou", "Hangzhou", (30.10, 120.00, 30.40, 120.30), "China", 2, 5000),
    Region("Suzhou", "Suzhou", (31.15, 120.45, 31.45, 120.75), "China", 2, 4000),
    
    # Taiwan (臺灣)
    Region("Taipei", "Taipei", (24.95, 121.45, 25.25, 121.70), "Taiwan", 1, 10000),
    Region("Kaohsiung", "Kaohsiung", (22.55, 120.25, 22.75, 120.45), "Taiwan", 2, 4000),
    Region("Taichung", "Taichung", (24.10, 120.60, 24.30, 120.80), "Taiwan", 2, 3000),
    
    # Hong Kong (香港)
    Region("Hong Kong", "Hong Kong", (22.20, 114.05, 22.45, 114.30), "Hong Kong", 1, 12000),
]

# ============================================================================
# Utility Functions
# ============================================================================

def get_all_regions() -> List[Region]:
    """Get all regions (Vietnam + Southeast Asia + East Asia)"""
    return VIETNAM_PROVINCES + SOUTHEAST_ASIA + EAST_ASIA

def get_vietnam_regions() -> List[Region]:
    """Get only Vietnam provinces"""
    return VIETNAM_PROVINCES

def get_international_regions() -> List[Region]:
    """Get international regions (Southeast Asia + East Asia)"""
    return SOUTHEAST_ASIA + EAST_ASIA

def get_priority_regions(priority: int = 1) -> List[Region]:
    """Get regions by priority level"""
    all_regions = get_all_regions()
    return [r for r in all_regions if r.priority == priority]

def get_regions_by_country(country: str) -> List[Region]:
    """Get all regions in a specific country"""
    all_regions = get_all_regions()
    return [r for r in all_regions if r.country == country]

def estimate_total_pois() -> int:
    """Estimate total POIs across all regions"""
    return sum(r.estimated_pois for r in get_all_regions())

# ============================================================================
# Statistics
# ============================================================================

if __name__ == "__main__":
    print("="*70)
    print("WANDERLUST DATA COLLECTION - REGIONS SUMMARY")
    print("="*70)
    
    print(f"\n📍 Total Regions: {len(get_all_regions())}")
    print(f"   - Vietnam: {len(VIETNAM_PROVINCES)} provinces")
    print(f"   - Southeast Asia: {len(SOUTHEAST_ASIA)} cities")
    print(f"   - East Asia: {len(EAST_ASIA)} cities")
    
    print(f"\n🎯 Priority Distribution:")
    print(f"   - Priority 1 (High): {len(get_priority_regions(1))} regions")
    print(f"   - Priority 2 (Medium): {len(get_priority_regions(2))} regions")
    print(f"   - Priority 3 (Low): {len(get_priority_regions(3))} regions")
    
    print(f"\n📊 Estimated POIs:")
    vietnam_pois = sum(r.estimated_pois for r in VIETNAM_PROVINCES)
    sea_pois = sum(r.estimated_pois for r in SOUTHEAST_ASIA)
    ea_pois = sum(r.estimated_pois for r in EAST_ASIA)
    
    print(f"   - Vietnam: {vietnam_pois:,} POIs")
    print(f"   - Southeast Asia: {sea_pois:,} POIs")
    print(f"   - East Asia: {ea_pois:,} POIs")
    print(f"   - TOTAL: {estimate_total_pois():,} POIs")
    
    print(f"\n🌏 Countries Covered:")
    countries = set(r.country for r in get_all_regions())
    for country in sorted(countries):
        regions = get_regions_by_country(country)
        total_pois = sum(r.estimated_pois for r in regions)
        print(f"   - {country}: {len(regions)} regions, ~{total_pois:,} POIs")
    
    print("\n" + "="*70)
