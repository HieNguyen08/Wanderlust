# MongoDB Schema Documentation

## 📊 Tổng quan Database Design

Schema này được thiết kế dựa trên:
- **MDPI Hybrid Algorithm** (Implicit features + NMF staying time + Clustering)
- **Budget Optimization** (Multi-objective với budget constraint)
- **Vietnam Travel Focus** (PhoBERT, dietary info, local categories)

---

## 🗄️ Collections Overview

| Collection | Purpose | Size Estimate |
|------------|---------|---------------|
| **pois** | Địa điểm du lịch Vietnam | 800-1000 documents |
| **users** | User profiles + preferences | Growing |
| **itineraries** | Generated tour plans | Growing |
| **user_poi_interactions** | Implicit feedback tracking | Large (millions) |
| **algorithm_models** | ML model metadata | 10-20 documents |
| **system_logs** | Performance & error logs | Large (rotation) |

---

## 📝 Collection Details

### 1. POIs (Points of Interest)

**Purpose:** Lưu trữ tất cả địa điểm du lịch ở Vietnam với thông tin chi tiết

**Key Features:**
- ✅ GeoJSON location (2dsphere index cho geospatial queries)
- ✅ Multi-category classification (nature, temple, food, etc.)
- ✅ Implicit features vector (128-dim từ TF-IDF + Autoencoder)
- ✅ Dynamic staying time info (cho NMF prediction)
- ✅ Detailed cost breakdown (cho budget optimization)
- ✅ Dietary info (allergens, vegetarian, vegan)
- ✅ Opening hours, crowd levels, peak seasons

**Indexes:**
```javascript
{ location: "2dsphere" }           // Tìm POIs gần nhau
{ categories: 1 }                  // Filter theo danh mục
{ "address.province": 1 }          // Filter theo tỉnh
{ "ratings.average": -1 }          // Sort theo rating
{ popularity_score: -1 }           // Cold start recommendation
{ "cost.entrance_fee": 1 }         // Budget filtering
{ name: "text", description: "text" } // Full-text search
```

**Sample Query:**
```javascript
// Tìm tất cả POIs ở Hà Nội, category "nature", rating >= 4.0, budget <= 100k
db.pois.find({
  "address.province": "Hà Nội",
  categories: "nature",
  "ratings.average": { $gte: 4.0 },
  "cost.entrance_fee": { $lte: 100000 }
}).sort({ "ratings.average": -1 });

// Tìm POIs trong bán kính 5km từ Hồ Hoàn Kiếm
db.pois.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [105.8526, 21.0285] },
      $maxDistance: 5000  // meters
    }
  }
});
```

---

### 2. Users

**Purpose:** Lưu trữ user profiles và learned preferences từ MDPI algorithm

**Key Features:**
- ✅ Visit history (collaborative filtering data)
- ✅ Search history (implicit feedback)
- ✅ Time-based interest weights (MDPI)
- ✅ K-Means cluster assignment
- ✅ Feature vector (128-dim implicit features)
- ✅ NMF user factors (staying time prediction)
- ✅ Dietary restrictions & mobility constraints

**Cold Start Solution:**
- New users → Content-based filtering using POI popularity + stated preferences
- After 5-10 interactions → Gradual transition to collaborative filtering

**Indexes:**
```javascript
{ user_id: 1 }                     // Unique user lookup
{ "preferences.cluster_id": 1 }    // Find similar users
{ last_active: -1 }                // Active users
```

---

### 3. Itineraries

**Purpose:** Lưu trữ các tour plans được generate bởi AI Assistant

**Key Features:**
- ✅ Multi-day planning (1-14 days)
- ✅ Budget constraint hard limit
- ✅ Detailed cost breakdown by category
- ✅ POI ordering với arrival/departure times
- ✅ Predicted staying time per POI (từ NMF)
- ✅ Travel time & mode between POIs
- ✅ Accommodation recommendations
- ✅ Optimization metrics (preference, diversity, efficiency)
- ✅ User feedback tracking

**Sample Structure:**
```javascript
{
  user_id: "user123",
  title: "Sapa 3 Days Mountain Trek",
  constraints: {
    budget: 10000000,  // 10 triệu VND
    num_days: 3,
    provinces: ["Lào Cai"],
    dietary_restrictions: ["vegetarian"]
  },
  days: [
    {
      day_number: 1,
      date: ISODate("2026-02-15"),
      pois: [
        {
          poi_id: ObjectId("..."),
          poi_name: "Fansipan Peak",
          order: 1,
          arrival_time: "08:00",
          departure_time: "15:00",
          staying_time: 7.0,
          travel_time_to_next: 1.5,
          travel_mode: "cable_car",
          costs: {
            entrance: 700000,
            meal: 150000,
            transport_to_next: 200000
          },
          preference_score: 0.92
        }
        // ... more POIs
      ],
      accommodation: {
        name: "Sapa Eco Hotel",
        cost: 500000
      },
      daily_cost: 2500000
    }
    // ... more days
  ],
  total_cost: 9500000,
  cost_breakdown: {
    accommodation: 1500000,
    entrance_fees: 1500000,
    meals: 1800000,
    transport: 3200000,
    shopping: 1000000,
    other: 500000
  },
  optimization_metrics: {
    preference_score: 8.7,
    diversity_score: 0.85,
    budget_efficiency: 0.91,
    algorithm_used: "genetic_algorithm",
    computation_time: 4.2
  },
  status: "confirmed",
  created_at: ISODate("2026-01-05")
}
```

---

### 4. User_POI_Interactions

**Purpose:** Track implicit feedback cho collaborative filtering

**Interaction Types & Weights:**
| Type | Weight | Description |
|------|--------|-------------|
| view | 1.0 | User xem POI detail page |
| click | 2.0 | User click vào POI trong search results |
| save | 3.0 | User lưu POI vào wishlist |
| share | 2.5 | User share POI |
| visit | 5.0 | User đã ghé thăm (from itinerary) |
| rate | 5.0 × rating | User đánh giá POI |

**Time Decay:** Interactions cũ sẽ có weight giảm dần (MDPI time-based interest)

---

### 5. Algorithm_Models

**Purpose:** Store trained ML models metadata

**Model Types:**
- `kmeans_user_clustering`: User segmentation (Stage 1)
- `nmf_staying_time`: Staying time prediction (Stage 2)
- `tfidf_poi_features`: POI text vectorization
- `autoencoder_poi_features`: Dimensionality reduction (128-dim)
- `genetic_algorithm_params`: Multi-objective optimization config

**Versioning:** Mỗi lần retrain model sẽ tạo version mới, giữ active model

---

### 6. System_Logs

**Purpose:** Monitoring algorithm performance & debugging

**Log Types:**
- `recommendation`: Log mỗi lần generate recommendations
- `optimization`: Log multi-objective optimization results
- `error`: Error tracking
- `performance`: Execution time, memory usage

---

## 🚀 Setup Instructions

### 1. Local Development (MongoDB Compass)

```bash
# Install MongoDB Community Edition
# Download: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod --dbpath="D:/mongodb/data"

# Open MongoDB Compass
# Connection string: mongodb://localhost:27017
# Database name: wanderlust_ai
```

### 2. Production (MongoDB Atlas)

```bash
# 1. Create free cluster tại https://www.mongodb.com/cloud/atlas
# 2. Whitelist IP address
# 3. Create database user
# 4. Get connection string
# 5. Update backend application.yml with connection string
```

### 3. Initialize Schema

```bash
# Run schema script
mongosh mongodb://localhost:27017/wanderlust_ai < mongodb_schema.js

# Or in MongoDB Compass:
# - Open shell
# - Copy-paste mongodb_schema.js content
# - Execute
```

### 4. Verify Setup

```javascript
// Check collections
use wanderlust_ai;
show collections;

// Check indexes
db.pois.getIndexes();
db.users.getIndexes();
db.itineraries.getIndexes();

// Test geospatial query
db.pois.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [105.8526, 21.0285] },
      $maxDistance: 1000
    }
  }
}).limit(5);
```

---

## 📈 Data Collection Strategy

### Phase 1: Initial Data (Week 1-2)

**Target:** 800-1000 POIs across Vietnam

**Priority Provinces:**
1. **Hà Nội** (150-200 POIs) - Capital, high tourism
2. **Hồ Chí Minh** (150-200 POIs) - Largest city
3. **Đà Nẵng** (80-100 POIs) - Central hub
4. **Quảng Ninh** (80-100 POIs) - Hạ Long Bay
5. **Lào Cai** (80-100 POIs) - Sapa mountain
6. **Khánh Hòa** (80-100 POIs) - Nha Trang beach
7. **Kiên Giang** (60-80 POIs) - Phú Quốc island
8. **Thừa Thiên Huế** (60-80 POIs) - Imperial city
9. **Lâm Đồng** (60-80 POIs) - Đà Lạt
10. **Others** (50-100 POIs) - Distributed

**Data Sources:**
1. **TripAdvisor API** (primary) - Reviews, ratings, descriptions
2. **Google Places API** - Location, opening hours, photos
3. **vietnam.travel** (scraping) - Official tourism data
4. **Manual curation** - Quality control, Vietnamese descriptions

**Category Distribution:**
- Nature/Outdoor: 30%
- Culture/Historical: 25%
- Food/Restaurant: 20%
- Shopping: 10%
- Entertainment: 10%
- Adventure: 5%

### Phase 2: Enrichment (Week 3-4)

- PhoBERT processing for Vietnamese descriptions
- TF-IDF + Autoencoder feature extraction
- Cost data normalization
- Image collection & optimization
- Quality validation

---

## 🔧 Maintenance & Optimization

### Index Maintenance
```javascript
// Rebuild indexes quarterly
db.pois.reIndex();
db.users.reIndex();

// Check index usage
db.pois.aggregate([{ $indexStats: {} }]);
```

### Data Quality Checks
```javascript
// Find POIs without description
db.pois.find({ "description.vi": { $exists: false } });

// Find POIs without ratings
db.pois.find({ "ratings.count": { $eq: 0 } });

// Find users without visit history (cold start)
db.users.find({ "visit_history": { $size: 0 } });
```

### Performance Monitoring
- Query execution time: Should be < 100ms for most queries
- Index hit ratio: Should be > 95%
- Collection size: Monitor growth, plan sharding if > 10GB

---

## 🎯 Next Steps

1. ✅ **Schema design complete**
2. ⏳ **Setup MongoDB instance** (local or Atlas)
3. ⏳ **Initialize collections & indexes**
4. ⏳ **Build data crawler** (Week 1-2)
5. ⏳ **Populate initial 800-1000 POIs** (Week 2-3)
6. ⏳ **PhoBERT feature extraction** (Week 3)
7. ⏳ **Train initial ML models** (Week 4)

---

## 📚 References

- [MongoDB Schema Design Best Practices](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [GeoJSON Specification](https://geojson.org/)
- [MongoDB Text Search](https://www.mongodb.com/docs/manual/text-search/)
- [MDPI Algorithm Paper](https://www.mdpi.com/2078-2489/12/10/402)
