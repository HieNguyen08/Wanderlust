# FREE Data Sources Strategy - Zero Cost Implementation

## 🎯 Quyết định quan trọng: KHÔNG dùng API có phí!

### ❌ APIs BỊ LOẠI BỎ (có phí):
1. **Google Places API** 
   - ❌ Phí: $5/1000 requests sau 10K free
   - ❌ Quota: 10,000 requests/month miễn phí (không đủ)
   
2. **TripAdvisor API**
   - ❌ Phí: Enterprise license required
   - ❌ Rate limit: Rất chặt, không phù hợp crawling

---

## ✅ NGUỒN DATA MIỄN PHÍ (100% FREE)

### 🗺️ 1. OpenStreetMap (OSM) - Core Data
**Rating: ⭐⭐⭐⭐⭐ (Core)**

**Lấy được:**
- ✅ Location (coordinates)
- ✅ Name (Vietnamese + English)
- ✅ Category/Tags (tourism, historic, amenity, etc.)
- ✅ Basic metadata (opening hours, contact, wheelchair access)
- ✅ Address details

**APIs:**
- **Overpass API** - Query POI data
  - Endpoint: `https://overpass-api.de/api/interpreter`
  - Rate limit: ~1 request/second (miễn phí)
  - Data: Toàn bộ Vietnam POIs
  
- **Nominatim** - Geocoding & reverse geocoding
  - Endpoint: `https://nominatim.openstreetmap.org`
  - Rate limit: 1 request/second
  - Data: Address details

**Coverage Vietnam:**
- Hà Nội: ~15,000 POIs
- Hồ Chí Minh: ~20,000 POIs
- Đà Nẵng: ~5,000 POIs
- Total Vietnam: ~100,000+ POIs

**Ví dụ query:**
```javascript
// Overpass QL - Get all tourist attractions in Hà Nội
[out:json][timeout:60];
(
  node["tourism"](20.9,105.7,21.1,105.95);
  node["historic"](20.9,105.7,21.1,105.95);
);
out body;
```

---

### 📚 2. Wikipedia/Wikidata - NLP Content
**Rating: ⭐⭐⭐⭐⭐ (NLP)**

**Lấy được:**
- ✅ Detailed descriptions (Vietnamese + English)
- ✅ Historical information
- ✅ Structured data (Wikidata properties)
- ✅ Images (Wikimedia Commons)
- ✅ Related articles

**APIs:**
- **Wikipedia API** - Article content
  - Endpoint: `https://vi.wikipedia.org/w/api.php`
  - Rate limit: Không giới hạn (reasonable use)
  - Data: Extracts, full text, images
  
- **Wikidata API** - Structured data
  - Endpoint: `https://www.wikidata.org/w/api.php`
  - Data: Coordinates, properties, relationships

**Coverage Vietnam:**
- Vietnamese Wikipedia: ~5,000 travel articles
- Wikidata: ~50,000 Vietnam entities
- Quality: High (community-curated)

**Ví dụ:**
```python
# Get Wikipedia description
https://vi.wikipedia.org/w/api.php?
  action=query&
  prop=extracts&
  exintro=true&
  titles=Hồ_Hoàn_Kiếm&
  format=json
```

---

### 🚗 3. OSRM/GraphHopper - Routing
**Rating: ⭐⭐⭐⭐ (Matrix)**

**Lấy được:**
- ✅ Travel time between POIs
- ✅ Distance (km)
- ✅ Optimal routes
- ✅ Distance matrices (for tour optimization)

**OSRM (Open Source Routing Machine):**
- Public server: `https://router.project-osrm.org`
- Rate limit: Reasonable use (no hard limit)
- Profiles: driving, walking, cycling
- FREE, open source

**GraphHopper:**
- Public API: `https://graphhopper.com/api/`
- Free tier: 500 requests/day
- Backup option nếu OSRM bị quá tải

**Ví dụ:**
```python
# OSRM route calculation
https://router.project-osrm.org/route/v1/driving/
  105.8526,21.0285;105.8355,21.0286?
  overview=false

# Response:
{
  "routes": [{
    "distance": 2431.5,  // meters
    "duration": 423.8    // seconds
  }]
}
```

---

### 🌤️ 4. OpenWeatherMap - Weather Data
**Rating: ⭐⭐⭐ (Feature)**

**Lấy được:**
- ✅ Current weather
- ✅ 5-day forecast
- ✅ Historical data
- ✅ Weather alerts

**API:**
- Endpoint: `https://api.openweathermap.org/data/2.5/`
- Free tier: 60 calls/minute, 1M calls/month
- Data: Temperature, conditions, humidity, etc.

**Cách dùng:**
- Weather for POI recommendations ("Avoid rainy days")
- Seasonal planning (best time to visit)
- Real-time weather alerts

---

### 🏛️ 5. Community Data - Administrative Units
**Rating: ⭐⭐⭐ (Clean)**

**Lấy được:**
- ✅ Vietnam province/district/ward boundaries
- ✅ Administrative hierarchies
- ✅ Population data
- ✅ Postal codes

**Sources:**
- **GADM** - Global administrative areas
  - Data: GeoJSON boundaries for Vietnam
  - Free download
  
- **Natural Earth** - Geographic data
  - Data: Province boundaries, cities
  - Public domain

- **Vietnam Government Open Data**
  - Portal: `https://data.gov.vn`
  - Data: Official administrative units

---

### 📸 6. TripAdvisor/Google - Gap Filling (Web Scraping)
**Rating: ⭐⭐⭐⭐ (Gap fill)**

**Lấy được:**
- ✅ User reviews (sentiment analysis)
- ✅ Cost estimates (entrance fees, meal prices)
- ✅ Photos
- ✅ Ratings distribution

**Cách thức:**
- ⚠️ Web scraping (không dùng API)
- ⚠️ Respect robots.txt
- ⚠️ Rate limiting: 1 page/2-3 seconds
- ⚠️ User-Agent rotation
- ⚠️ Chỉ dùng để bổ sung, không phải primary source

**Libraries:**
- BeautifulSoup4 - HTML parsing
- Scrapy - Scraping framework
- Selenium - JavaScript rendering (nếu cần)

**Legal considerations:**
- ✅ Public data (displayed on website)
- ✅ No login required
- ✅ Non-commercial use (research/education)
- ⚠️ Check terms of service

---

## 📊 So Sánh Chi Phí

### Phương án CŨ (có phí):
| Source | Cost | Monthly Limit | Estimate/Month |
|--------|------|---------------|----------------|
| Google Places API | $5/1000 req | 10K free | $50-100/month |
| TripAdvisor API | Enterprise | N/A | $500+/month |
| **TOTAL** | | | **$550-600/month** |

### Phương án MỚI (miễn phí):
| Source | Cost | Monthly Limit | Estimate |
|--------|------|---------------|----------|
| OpenStreetMap | FREE | ∞ | $0 |
| Wikipedia/Wikidata | FREE | ∞ | $0 |
| OSRM Routing | FREE | ∞ | $0 |
| OpenWeatherMap | FREE | 1M calls | $0 |
| Web Scraping | FREE | Self-limited | $0 |
| **TOTAL** | | | **$0/month** |

**💰 TIẾT KIỆM: ~$600/month = ~$7,200/year!**

---

## 🎯 Implementation Strategy

### Phase 1: Core Data (Week 1-2)
**Priority: OpenStreetMap**

1. **Deploy OSM Crawler** (Day 1-2)
   ```bash
   cd "Data Algorithm/crawler"
   python osm_crawler.py
   ```
   - Target: 800-1000 POIs from 9 provinces
   - Source: Overpass API
   - Time: ~2-3 hours crawling

2. **Enrich with Wikipedia** (Day 3-4)
   - Match OSM POIs with Wikipedia articles
   - Extract descriptions (min 200 chars)
   - Target: 60-70% coverage

3. **Calculate Distance Matrix** (Day 5)
   - Use OSRM for all POI pairs in same city
   - Store in MongoDB for tour optimization
   - Precompute travel times

### Phase 2: Enhancement (Week 3-4)
**Priority: Web Scraping + Weather**

4. **TripAdvisor Scraping** (Week 3)
   - ⚠️ Respectful scraping (2-3 sec delays)
   - Target: Top 100 POIs per city
   - Data: Reviews, ratings, costs

5. **Weather Integration** (Week 4)
   - OpenWeatherMap API setup
   - Historical weather data for seasonal recommendations
   - Real-time weather for trip planning

---

## 🔧 Technical Implementation

### 1. OSM Data Pipeline

```python
# Simplified workflow
async def crawl_vietnam_pois():
    async with OSMCrawler() as osm:
        for province in PROVINCES:
            # Get POIs from OSM
            pois = await osm.search_pois(province)
            
            # Enhance with Wikipedia
            async with WikipediaCrawler() as wiki:
                for poi in pois:
                    description = await wiki.search_wikipedia_article(poi['name'])
                    poi['description_vi'] = description
            
            # Save to MongoDB
            await save_to_mongodb(pois)
    
    # Calculate distance matrix
    async with OSRMRouter() as router:
        for city in CITIES:
            pois = get_pois_in_city(city)
            matrix = await router.calculate_distance_matrix(pois)
            save_distance_matrix(city, matrix)
```

### 2. Data Quality Checks

```python
def validate_poi(poi):
    checks = {
        "has_coordinates": poi['latitude'] != 0 and poi['longitude'] != 0,
        "has_name": len(poi['name']) > 0,
        "has_category": len(poi['categories']) > 0,
        "has_description": len(poi.get('description_vi', '')) >= 50,
        "in_vietnam": 8.0 <= poi['latitude'] <= 24.0 and 102.0 <= poi['longitude'] <= 110.0
    }
    return all(checks.values())
```

### 3. Caching Strategy

```python
# Cache OSM data locally (update monthly)
# - Reduces API calls
# - Faster development
# - Offline testing

CACHE_DIR = "./osm_cache"
CACHE_EXPIRY = 30 * 24 * 3600  # 30 days

def get_cached_or_fetch(province):
    cache_file = f"{CACHE_DIR}/{province}.json"
    if os.path.exists(cache_file):
        age = time.time() - os.path.getmtime(cache_file)
        if age < CACHE_EXPIRY:
            return load_from_cache(cache_file)
    
    # Fetch fresh data
    data = fetch_from_osm(province)
    save_to_cache(cache_file, data)
    return data
```

---

## 📈 Expected Data Quality

### OSM Coverage (Vietnam)
| Province | Total POIs | With Names | With Categories | Quality |
|----------|-----------|------------|-----------------|---------|
| Hà Nội | 15,000+ | 98% | 95% | ⭐⭐⭐⭐⭐ |
| Hồ Chí Minh | 20,000+ | 98% | 94% | ⭐⭐⭐⭐⭐ |
| Đà Nẵng | 5,000+ | 97% | 93% | ⭐⭐⭐⭐ |
| Others | 10,000+ | 95% | 90% | ⭐⭐⭐⭐ |

### Wikipedia Coverage
| Type | Count | Description Quality |
|------|-------|---------------------|
| Major tourist attractions | 500+ | ⭐⭐⭐⭐⭐ |
| Cities & provinces | 63 | ⭐⭐⭐⭐⭐ |
| Historical sites | 1,000+ | ⭐⭐⭐⭐ |
| Natural landmarks | 500+ | ⭐⭐⭐⭐ |
| Restaurants/Hotels | Low | ⭐⭐ (need scraping) |

### OSRM Routing
| Metric | Performance | Accuracy |
|--------|-------------|----------|
| Response time | <500ms | N/A |
| Route accuracy | N/A | 95%+ (OSM road data) |
| Distance accuracy | N/A | ±5% |
| Coverage | Vietnam | 98% road network |

---

## ⚠️ Limitations & Mitigations

### 1. Reviews & Ratings
**Problem:** OSM không có reviews, Wikipedia không có ratings

**Solution:**
- Web scrape TripAdvisor (top POIs only)
- Use OSM metadata (tourism=*, historic=*) as quality signal
- Popularity score = Number of OSM editors who touched the POI

### 2. Cost Information
**Problem:** Entrance fees, meal prices không có trong OSM

**Solution:**
- Web scrape official websites
- Crowdsource from users (after launch)
- Use averages per category (e.g., temples: $1-3, museums: $2-5)

### 3. Opening Hours
**Problem:** OSM opening_hours format phức tạp, không chuẩn

**Solution:**
- Parse OSM opening_hours tag (có libraries)
- Fallback to default hours per category
- Validate with web scraping

### 4. Fresh Data
**Problem:** OSM data có thể outdated

**Solution:**
- Monthly full refresh from OSM
- User feedback mechanism (report closed POIs)
- Priority refresh for popular POIs

---

## 🚀 Quick Start - FREE Implementation

### Step 1: Install Dependencies
```bash
cd "Data Algorithm/crawler"
pip install aiohttp beautifulsoup4 pymongo

# No API keys needed!
```

### Step 2: Run OSM Crawler
```bash
python osm_crawler.py

# Expected output:
# ✅ Found 15,234 POIs in Hà Nội
# ✅ Found 8,521 POIs in Đà Nẵng
# ...
# ✅ Total: 45,789 POIs from OpenStreetMap
```

### Step 3: Enhance with Wikipedia
```bash
python enhance_with_wikipedia.py

# Expected output:
# ✅ Enhanced 2,145 POIs with Wikipedia descriptions
# Coverage: 67% of POIs
```

### Step 4: Calculate Distance Matrices
```bash
python calculate_distances.py

# Expected output:
# ✅ Calculated distance matrix for Hà Nội (150×150)
# ✅ Calculated distance matrix for Hồ Chí Minh (200×200)
```

### Step 5: Insert to MongoDB
```bash
python insert_to_mongodb.py

# Expected output:
# ✅ Inserted 45,789 POIs to MongoDB
# ✅ Created geospatial indexes
# ✅ Database ready!
```

---

## 📚 Resources

### OpenStreetMap
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass Turbo (Query Builder)](https://overpass-turbo.eu/)
- [OSM Tags for Vietnam](https://wiki.openstreetmap.org/wiki/Vietnam)
- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)

### Wikipedia/Wikidata
- [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)
- [Wikidata Query Service](https://query.wikidata.org/)
- [Vietnamese Wikipedia](https://vi.wikipedia.org/)

### OSRM
- [OSRM Documentation](http://project-osrm.org/)
- [OSRM API Reference](https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md)

### Web Scraping
- [BeautifulSoup4 Docs](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Scrapy Tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html)
- [Robots.txt Parser](https://docs.python.org/3/library/urllib.robotparser.html)

---

**Decision:** ✅ 100% FREE Data Sources  
**Cost Savings:** $600/month → $0/month  
**Implementation Time:** 2 weeks (same as original plan)  
**Data Quality:** Comparable or better (OSM more complete for Vietnam)
