# Phase 1 Week 1 - Database Setup & Crawler Architecture

## ✅ Hoàn thành

### 1. MongoDB Schema Design
📁 **Files:** `schema/mongodb_schema.js`, `schema/README.md`

**Collections được thiết kế:**
- ✅ **POIs** - 800-1000 địa điểm du lịch Vietnam
- ✅ **Users** - User profiles + MDPI learned preferences
- ✅ **Itineraries** - Generated tour plans với budget tracking
- ✅ **User_POI_Interactions** - Implicit feedback cho collaborative filtering
- ✅ **Algorithm_Models** - ML model metadata & versioning
- ✅ **System_Logs** - Performance monitoring với TTL auto-cleanup

**Key Features:**
- GeoJSON 2dsphere indexes cho geospatial queries
- Full-text search indexes (Vietnamese + English)
- Validation schemas cho data quality
- Budget optimization support (missing trong tất cả 3 papers!)
- Dietary restrictions & allergen tracking
- Dynamic staying time fields (NMF từ MDPI)
- Time-based user interest (MDPI Stage 1)

### 2. Setup Scripts
📁 **File:** `schema/setup_mongodb.py`

**Chức năng:**
- ✅ Auto-create 6 collections với validation
- ✅ Create 15+ indexes cho performance
- ✅ Insert sample POI (Hồ Hoàn Kiếm)
- ✅ Validate setup & test geospatial queries
- ✅ Support cả local MongoDB và Atlas

**Usage:**
```bash
cd "Data Algorithm/schema"
pip install -r requirements.txt
python setup_mongodb.py
```

### 3. Data Crawler Architecture
📁 **File:** `crawler/crawler_architecture.py`

**Design Patterns:**
- ✅ Abstract `BaseCrawler` class (extensible)
- ✅ Async/await với aiohttp (high performance)
- ✅ Rate limiting per source (Google: 10 req/s, TripAdvisor: 5 req/s)
- ✅ Concurrent requests với semaphore (default 5)
- ✅ Automatic deduplication by name + location
- ✅ Standardized `POIData` model → MongoDB format

**Implemented Crawlers:**
- ✅ **GooglePlacesCrawler** - Google Places API (primary source)
  - Text Search API (max 60 results per query)
  - Place Details API (full info)
  - Category mapping: Wanderlust → Google types
  - Address parsing for Vietnam provinces
  
- ⏳ **TripAdvisorCrawler** - Placeholder (need API key)
- ⏳ **VietnamTravelScraper** - Placeholder (need BeautifulSoup implementation)

**Orchestrator:**
- ✅ `CrawlerOrchestrator` - Manages multiple crawlers
- ✅ Province-by-province crawling (9 target provinces)
- ✅ Auto-deduplication across sources
- ✅ JSON export for batch processing

---

## 📊 Target Data Collection (Week 1-2)

### Provinces Priority (800-1000 POIs total)

| Province | Target POIs | Priority | Reason |
|----------|-------------|----------|--------|
| Hà Nội | 150-200 | 🔴 High | Capital, rich culture |
| Hồ Chí Minh | 150-200 | 🔴 High | Largest city, diverse |
| Đà Nẵng | 80-100 | 🟡 Medium | Central hub, beach |
| Quảng Ninh | 80-100 | 🟡 Medium | Hạ Long Bay UNESCO |
| Lào Cai | 80-100 | 🟡 Medium | Sapa mountains |
| Khánh Hòa | 80-100 | 🟡 Medium | Nha Trang resort |
| Kiên Giang | 60-80 | 🟢 Low | Phú Quốc island |
| Thừa Thiên Huế | 60-80 | 🟢 Low | Imperial city |
| Lâm Đồng | 60-80 | 🟢 Low | Đà Lạt highlands |

### Category Distribution

| Category | % | Target Count | Examples |
|----------|---|--------------|----------|
| Nature/Outdoor | 30% | 240-300 | Mountains, beaches, lakes, waterfalls |
| Culture/Historical | 25% | 200-250 | Temples, pagodas, museums, UNESCO sites |
| Food/Restaurant | 20% | 160-200 | Phở, bánh mì, seafood, local specialties |
| Shopping | 10% | 80-100 | Markets, malls, craft villages |
| Entertainment | 10% | 80-100 | Theme parks, nightlife, shows |
| Adventure | 5% | 40-50 | Trekking, diving, rafting, caving |

---

## 🚀 Next Steps (Week 2)

### 1. Get API Keys (Day 1)
```bash
# Google Places API
# 1. Go to: https://console.cloud.google.com/
# 2. Create project "Wanderlust AI"
# 3. Enable "Places API" & "Maps JavaScript API"
# 4. Create credentials → API Key
# 5. Restrict key to Places API only
# 6. Set quota: 10,000 requests/day (free tier)

# TripAdvisor API (Optional)
# 1. Go to: https://www.tripadvisor.com/developers
# 2. Register for API access
# 3. Note: Limited free tier, may need web scraping fallback
```

### 2. Run Initial Crawl (Day 2-3)
```bash
cd "Data Algorithm/crawler"
pip install -r requirements.txt

# Edit crawler_architecture.py:
# - Add your Google API key
# - Start with 2 provinces: ["Hà Nội", "Đà Nẵng"]

python crawler_architecture.py

# Expected output: 300-400 POIs in crawled_pois.json
```

### 3. Data Quality Check (Day 4)
- Validate all POIs have coordinates
- Check description lengths (min 50 chars Vietnamese)
- Verify rating counts > 0
- Ensure categories are mapped correctly

### 4. Batch Insert to MongoDB (Day 5)
```python
# Create insert_pois.py script
import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["wanderlust_ai"]

with open("crawled_pois.json") as f:
    pois = json.load(f)

# Transform to MongoDB format
docs = [poi.to_mongodb_document() for poi in pois]

# Batch insert
result = db.pois.insert_many(docs)
print(f"Inserted {len(result.inserted_ids)} POIs")
```

### 5. Expand to All Provinces (Week 2)
- Add remaining 7 provinces
- Implement TripAdvisor crawler
- Add vietnam.travel scraper
- Target: 800-1000 POIs by end of Week 2

---

## 📁 Project Structure

```
Data Algorithm/
├── schema/
│   ├── mongodb_schema.js       # ✅ Collection definitions
│   ├── setup_mongodb.py        # ✅ Auto-setup script
│   ├── requirements.txt        # ✅ pymongo, dnspython
│   └── README.md               # ✅ Detailed documentation
│
├── crawler/
│   ├── crawler_architecture.py # ✅ Multi-source crawler
│   ├── requirements.txt        # ✅ aiohttp, scrapy, beautifulsoup4
│   └── crawled_data/           # Output directory
│       ├── crawled_pois.json
│       └── logs/
│
├── algorithm_comparison/
│   ├── benchmark.py            # ✅ Performance testing
│   └── requirements.txt
│
├── ALGORITHM_COMPARISON_ANALYSIS.md  # ✅ 3-paper comparison
├── DETAILED_IMPLEMENTATION_PLAN.md   # ✅ 16-week roadmap
└── QUICK_START.md                    # ✅ Quick reference
```

---

## 💡 Technical Decisions Made

### 1. MongoDB vs PostgreSQL?
**Choice: MongoDB**
- ✅ GeoJSON native support (2dsphere indexes)
- ✅ Flexible schema for varying POI data
- ✅ Horizontal scaling ready (sharding)
- ✅ JSON documents match API responses
- ✅ Easy to add new fields (e.g., new amenities)

### 2. Async vs Sync Crawler?
**Choice: Async (asyncio + aiohttp)**
- ✅ 5-10x faster for I/O-bound tasks
- ✅ Handle 1000s of API requests efficiently
- ✅ Rate limiting with semaphores
- ✅ Concurrent multi-source crawling

### 3. Real-time vs Batch Processing?
**Choice: Batch processing with periodic updates**
- ✅ POI data changes slowly (monthly updates sufficient)
- ✅ Easier error handling & retry logic
- ✅ Lower API costs (no real-time webhooks)
- ✅ Can process offline (PhoBERT, NLP)

### 4. Category System?
**Choice: Multi-category tags (array)**
- ✅ POIs often have multiple purposes (e.g., temple + historical + culture)
- ✅ Better for recommendation diversity
- ✅ Flexible filtering in queries
- ❌ Single category too restrictive

---

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --dbpath="D:/mongodb/data"

# Or use MongoDB Compass GUI
# Download: https://www.mongodb.com/products/compass
```

### Google Places API Quota Exceeded
```python
# Check quota usage in Google Cloud Console
# Free tier: 10,000 requests/month
# Each province search = ~60 results = 3 requests
# 9 provinces × 6 categories × 3 requests = 162 requests
# Still within free tier!

# If exceeded:
# - Reduce concurrent_requests in config
# - Add longer delays between provinces
# - Consider paid plan ($5/1000 requests)
```

### Deduplication Issues
```python
# If seeing too many duplicates:
# - Adjust coordinate rounding in _deduplicate_pois()
# - Currently: round(lat, 3) = ~100m precision
# - Increase to round(lat, 4) = ~10m precision for finer control
```

---

## 📈 Expected Metrics

### Week 1 End
- ✅ MongoDB schema complete with 6 collections
- ✅ 15+ indexes created
- ✅ Crawler architecture implemented
- ⏳ 0 POIs (API keys needed)

### Week 2 End
- ⏳ 800-1000 POIs collected
- ⏳ 9 provinces covered
- ⏳ 3 data sources integrated
- ⏳ 95%+ POIs with descriptions
- ⏳ 80%+ POIs with ratings

---

## 🎯 Success Criteria

### Data Quality
- [ ] Every POI has valid coordinates
- [ ] 95%+ have Vietnamese descriptions (min 50 chars)
- [ ] 80%+ have ratings with count > 10
- [ ] All POIs have at least 1 category
- [ ] Entrance fees validated (0 for free POIs)

### Coverage
- [ ] All 9 target provinces represented
- [ ] Category distribution within 5% of target
- [ ] No duplicate POIs (same name + location)

### Performance
- [ ] Geospatial queries < 100ms
- [ ] Text search queries < 200ms
- [ ] Crawler processes 100 POIs/hour
- [ ] API rate limits not exceeded

---

## 📚 References

- [MongoDB Schema Design Best Practices](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Python asyncio Tutorial](https://docs.python.org/3/library/asyncio.html)
- [MDPI Algorithm Paper](https://www.mdpi.com/2078-2489/12/10/402)

---

**Status:** ✅ Phase 1 Week 1 Complete  
**Next:** Week 2 - Data Collection & Quality Assurance  
**Updated:** 2026-01-06
