# KẾ HOẠCH CHI TIẾT XÂY DỰNG MODULE AI ASSISTANT - WANDERLUST

## 🎯 TỔNG QUAN DỰ ÁN

**Mục tiêu:** Xây dựng module AI Assistant có khả năng:
- Trò chuyện tự nhiên về du lịch (OpenAI GPT-3.5)
- Lập kế hoạch du lịch tối ưu dựa trên budget, sở thích, constraints
- Visualize lịch trình trên map
- Focus: Vietnam (Sapa, Đà Lạt, Phú Quốc...) → mở rộng quốc tế

**Timeline dự kiến:** 6-8 tuần
**Team size:** 1-2 người (Data Engineer/Analyst + Backend Developer)

---

## 📋 GIAI ĐOẠN 1: THU THẬP & XỬ LÝ DATA (3-4 tuần)

### **TUẦN 1: Thiết kế Data Schema & Infrastructure Setup**

#### **1.1. Thiết kế Database Schema** (2 ngày)

**File output:** `Data Algorithm/schema/mongodb_schema.json`

**Collections cần thiết:**

```javascript
// 1. POIs (Points of Interest)
{
  _id: ObjectId,
  name: String,              // Tên địa điểm
  name_en: String,           // Tên tiếng Anh
  location: {
    type: "Point",
    coordinates: [lon, lat]  // GeoJSON format
  },
  address: {
    province: String,        // Tỉnh/thành
    district: String,        // Quận/huyện
    ward: String,            // Phường/xã
    street: String           // Địa chỉ cụ thể
  },
  categories: [String],      // ["nature", "temple", "food", "shopping"]
  description: {
    vi: String,              // Mô tả tiếng Việt
    en: String               // Mô tả tiếng Anh
  },
  features: {                // Đặc điểm tiềm ẩn (implicit features)
    vector: [Float],         // 128-dim vector từ description
    keywords: [String]       // Keywords trích xuất
  },
  ratings: {
    average: Float,          // 0-5
    count: Int,
    distribution: {          // Phân bố rating
      "5": Int, "4": Int, "3": Int, "2": Int, "1": Int
    }
  },
  visiting_info: {
    avg_staying_time: Float, // hours
    best_time_slots: [Int],  // [9, 10, 14, 15] (giờ tốt nhất)
    peak_season: [String],   // ["summer", "winter"]
    crowd_level: String      // "low", "medium", "high"
  },
  cost: {
    entrance_fee: Float,     // VND
    avg_meal_cost: Float,    // VND (nếu là nhà hàng)
    avg_shopping: Float      // VND (nếu có shopping)
  },
  amenities: {               // Tiện ích
    parking: Boolean,
    wifi: Boolean,
    wheelchair_accessible: Boolean,
    kid_friendly: Boolean,
    food_available: Boolean
  },
  dietary_info: {            // Nếu là food POI
    cuisine_types: [String], // ["vietnamese", "seafood"]
    allergens: [String],     // ["peanuts", "seafood", "dairy"]
    vegetarian_options: Boolean,
    vegan_options: Boolean
  },
  images: [String],          // URLs
  contact: {
    phone: String,
    website: String,
    email: String
  },
  opening_hours: {           // Giờ mở cửa
    monday: {open: String, close: String},
    tuesday: {open: String, close: String},
    // ... các ngày khác
  },
  created_at: Date,
  updated_at: Date
}

// 2. Users
{
  _id: ObjectId,
  name: String,
  email: String,
  preferences: {
    categories: {            // Weight cho mỗi category
      "nature": Float,       // 0-1
      "temple": Float,
      "food": Float,
      // ...
    },
    dietary_restrictions: [String],  // ["vegetarian", "no_seafood"]
    allergies: [String],              // ["peanuts", "shellfish"]
    budget_level: String,             // "budget", "moderate", "luxury"
    transportation_pref: [String],    // ["public", "taxi", "motorbike"]
    activity_level: String,           // "relaxed", "moderate", "active"
    travel_style: String              // "cultural", "adventure", "foodie"
  },
  visit_history: [{
    poi_id: ObjectId,
    visited_date: Date,
    staying_time: Float,     // hours
    rating: Float,
    review: String
  }],
  created_at: Date,
  updated_at: Date
}

// 3. Trip History (for learning)
{
  _id: ObjectId,
  user_id: ObjectId,
  sequence: [ObjectId],      // Ordered POI IDs
  start_date: Date,
  end_date: Date,
  total_cost: Float,
  total_time: Float,
  satisfaction_score: Float, // 0-5
  created_at: Date
}

// 4. Accommodations
{
  _id: ObjectId,
  name: String,
  location: {
    type: "Point",
    coordinates: [lon, lat]
  },
  type: String,              // "hotel", "hostel", "homestay"
  price_range: {
    min: Float,              // Per night VND
    max: Float
  },
  amenities: [String],
  rating: Float,
  images: [String],
  contact: Object
}

// 5. Transportation
{
  _id: ObjectId,
  from_poi: ObjectId,
  to_poi: ObjectId,
  distance: Float,           // km
  methods: [{
    type: String,            // "car", "bus", "train", "motorbike"
    duration: Float,         // hours
    cost: Float,             // VND
    schedule: [String]       // Lịch trình nếu có
  }]
}
```

**Indexes cần tạo:**
```javascript
// POIs
db.pois.createIndex({ location: "2dsphere" })
db.pois.createIndex({ "categories": 1 })
db.pois.createIndex({ "address.province": 1 })

// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Trip History
db.trip_history.createIndex({ user_id: 1 })

// Transportation
db.transportation.createIndex({ from_poi: 1, to_poi: 1 })
```

#### **1.2. Setup Data Collection Infrastructure** (1 ngày)

**Tạo folder structure:**
```
Data Algorithm/
├── crawlers/              # Web scrapers
│   ├── __init__.py
│   ├── base_crawler.py
│   ├── tripadvisor_crawler.py
│   ├── google_places_crawler.py
│   ├── vietnam_tourism_crawler.py
│   └── foody_crawler.py
├── processors/            # Data processing
│   ├── __init__.py
│   ├── text_processor.py  # NLP processing
│   ├── image_processor.py
│   └── validator.py
├── utils/
│   ├── __init__.py
│   ├── db_connector.py
│   ├── logger.py
│   └── config.py
├── data/
│   ├── raw/              # Raw scraped data
│   ├── processed/        # Cleaned data
│   └── enriched/         # Data với features
└── tests/
```

**Dependencies:**
```
# requirements.txt
scrapy>=2.11.0
beautifulsoup4>=4.12.0
selenium>=4.15.0
requests>=2.31.0
pandas>=2.0.0
numpy>=1.24.0
pymongo>=4.6.0
python-dotenv>=1.0.0

# NLP
underthesea>=6.7.0        # Vietnamese NLP
transformers>=4.35.0       # PhoBERT for Vietnamese
torch>=2.1.0

# Geocoding
geopy>=2.4.0
googlemaps>=4.10.0

# Image processing
Pillow>=10.1.0
opencv-python>=4.8.0
```

#### **1.3. Setup Logging & Monitoring** (0.5 ngày)

**File:** `Data Algorithm/utils/logger.py`
- Setup structured logging
- Error tracking
- Progress monitoring
- Data quality metrics

---

### **TUẦN 2: Data Collection - Vietnam Popular Destinations**

#### **2.1. Priority Destinations (Top 20)**

**Danh sách ưu tiên:**
1. **Hà Nội** (100+ POIs)
2. **Sapa, Lào Cai** (50+ POIs)
3. **Hạ Long, Quảng Ninh** (40+ POIs)
4. **Huế, Thừa Thiên Huế** (60+ POIs)
5. **Hội An, Quảng Nam** (50+ POIs)
6. **Đà Nẵng** (80+ POIs)
7. **Nha Trang, Khánh Hòa** (70+ POIs)
8. **Đà Lạt, Lâm Đồng** (80+ POIs)
9. **TP. Hồ Chí Minh** (120+ POIs)
10. **Vũng Tàu, Bà Rịa - Vũng Tàu** (40+ POIs)
11. **Phú Quốc, Kiên Giang** (60+ POIs)
12. **Cần Thơ** (40+ POIs)
13. **Mũi Né, Bình Thuận** (30+ POIs)
14. **Ninh Bình** (40+ POIs)
15. **Phong Nha-Kẻ Bàng, Quảng Bình** (30+ POIs)

**Target:** 800-1000 POIs cho giai đoạn đầu

#### **2.2. Data Sources**

**A. TripAdvisor (Primary)**
- POI names, descriptions
- Ratings, reviews
- Categories
- Photos
- Opening hours
- Price range

**Crawler:** `crawlers/tripadvisor_crawler.py`
```python
# Pseudo code
class TripAdvisorCrawler:
    def crawl_destination(self, destination_name):
        # 1. Search destination
        # 2. Get POI list
        # 3. For each POI:
        #    - Basic info
        #    - Reviews (sample 100 recent)
        #    - Photos (top 10)
        #    - Details
        # 4. Save to raw/
```

**B. Google Places API**
- GPS coordinates (accurate)
- Address details
- Contact information
- Current ratings
- Price levels

**C. Vietnam Tourism Websites**
- vietnam.travel
- dulich.gov.vn
- Detailed descriptions in Vietnamese

**D. Foody.vn (for Food POIs)**
- Restaurant details
- Menu prices
- Dietary information
- Allergen info

**E. Other sources:**
- wikipedia.org (historical info)
- wikitravel.org
- lonelyplanet.com

#### **2.3. Data Collection Process** (7 ngày)

**Day 1-2:** Setup & test crawlers
**Day 3-5:** Crawl top 10 destinations
**Day 6-7:** Crawl remaining destinations

**Crawler rate limits:**
- TripAdvisor: 1 request / 2 seconds
- Google Places: 100 requests / day (free tier)
- Other sources: 1 request / 1 second

**Expected raw data:** ~1GB JSON files

---

### **TUẦN 3: Data Cleaning & Processing**

#### **3.1. Data Cleaning** (3 ngày)

**Tasks:**

**A. Deduplication**
```python
# processors/deduplicator.py
# - Remove exact duplicates
# - Merge similar POIs (fuzzy matching)
# - Levenshtein distance for names
# - GPS proximity check (within 100m = same POI)
```

**B. Data Validation**
```python
# processors/validator.py
# - Check required fields
# - Validate GPS coordinates
# - Validate price ranges (remove outliers)
# - Check rating values (0-5)
# - Validate phone numbers, emails
```

**C. Standardization**
- Địa chỉ format chuẩn hóa
- Phone number format (+84...)
- Category mapping to standard taxonomy
- Currency normalization (all to VND)

**D. Missing Data Handling**
- Impute missing ratings (use category average)
- Geocode missing GPS (from address)
- Default staying time by category
- Default cost estimates

**Output:** `data/processed/pois_cleaned.json`

#### **3.2. Text Processing & Feature Extraction** (2 ngày)

**A. Vietnamese Text Processing**
```python
# processors/text_processor.py

from underthesea import word_tokenize, pos_tag
from transformers import AutoModel, AutoTokenizer

class VietnameseTextProcessor:
    def __init__(self):
        # Load PhoBERT
        self.tokenizer = AutoTokenizer.from_pretrained(
            "vinai/phobert-base"
        )
        self.model = AutoModel.from_pretrained(
            "vinai/phobert-base"
        )
    
    def extract_features(self, description):
        # 1. Tokenization
        tokens = word_tokenize(description)
        
        # 2. Remove stopwords
        # 3. TF-IDF
        # 4. PhoBERT embeddings (768-dim)
        # 5. Dimension reduction (PCA/Autoencoder to 128-dim)
        
        return feature_vector
    
    def extract_keywords(self, description):
        # Extract important keywords
        # Use TF-IDF + POS tagging
        return keywords
```

**B. Feature Engineering**
- Create implicit feature vectors (128-dim)
- Extract keywords for each POI
- Category embeddings
- Sentiment analysis from reviews

**Output:** `data/processed/pois_with_features.json`

#### **3.3. Enrichment with Computed Data** (2 ngày)

**A. Calculate Transportation Matrix**
```python
# processors/transportation_calculator.py

# For each pair of POIs in same province:
# - Distance (km)
# - Travel time by car (Google Maps API)
# - Estimated cost by taxi
# - Check public transport availability
```

**B. Calculate Time Statistics**
```python
# From TripAdvisor reviews:
# - Average staying time per POI
# - Time slot popularity (morning/afternoon/evening)
# - Seasonal patterns
```

**C. Cost Estimation**
```python
# Estimate costs if missing:
# - Entrance fees from web scraping
# - Meal costs from Foody.vn
# - Transportation costs from distance
```

**D. Popularity Score**
```python
# Normalize popularity:
# popularity = (rating * num_reviews) / max_reviews
# Scale to 0-1
```

**Output:** `data/enriched/pois_final.json`

---

### **TUẦN 4: Data Validation & Loading to MongoDB**

#### **4.1. Final Data Quality Check** (1 ngày)

**Checklist:**
- ✅ All required fields present
- ✅ No duplicates
- ✅ GPS coordinates valid
- ✅ Categories assigned correctly
- ✅ Feature vectors computed
- ✅ Transportation matrix complete
- ✅ Price data reasonable

**Generate data quality report:**
```
Data Quality Report
===================
Total POIs: 852
Complete records: 820 (96.2%)
Missing GPS: 12 (1.4%)
Missing descriptions: 20 (2.3%)
...
```

#### **4.2. Load Data to MongoDB** (1 ngày)

**Script:** `data/load_to_mongodb.py`

```python
from pymongo import MongoClient
import json

def load_data():
    client = MongoClient("mongodb://localhost:27017")
    db = client.wanderlust
    
    # Load POIs
    with open('data/enriched/pois_final.json') as f:
        pois = json.load(f)
        db.pois.insert_many(pois)
    
    # Load transportation
    with open('data/enriched/transportation.json') as f:
        trans = json.load(f)
        db.transportation.insert_many(trans)
    
    # Create indexes
    create_indexes(db)
    
    print("Data loaded successfully!")
```

#### **4.3. Create Sample User Profiles** (1 ngày)

**Generate 50-100 synthetic user profiles for testing:**
```python
# utils/generate_sample_users.py

# Create diverse user profiles:
# - Budget travelers
# - Luxury travelers
# - Families with kids
# - Solo adventurers
# - Foodies
# - Culture enthusiasts
# - Nature lovers
# With various:
# - Dietary restrictions
# - Budget levels
# - Activity preferences
```

#### **4.4. Documentation** (1 ngày)

**Create documentation:**
- Data dictionary
- Collection schemas
- Data sources & attribution
- Data quality metrics
- Known limitations
- Update procedures

**File:** `Data Algorithm/DATA_DOCUMENTATION.md`

---

## 🎨 GIAI ĐOẠN 2: XÂY DỰNG DB-BE-FE (4-5 tuần)

### **TUẦN 5: Backend Development - Algorithm Implementation**

#### **5.1. Implement Core Algorithm** (4 ngày)

**Đề xuất thuật toán hybrid:**

```
WanderlustRecommendationAlgorithm (Hybrid Approach)
====================================================

Kết hợp:
1. MDPI paper: 
   - Implicit feature extraction
   - Dynamic staying time (NMF)
   - Sequence-based clustering
   
2. Multi-objective optimization (from literature):
   - Budget constraint (hard constraint)
   - Time constraint (hard constraint)
   - Preference maximization (objective 1)
   - Diversity (objective 2)
   - Cost minimization (objective 3)
   
3. Custom additions for Wanderlust:
   - Dietary constraint handling
   - Transportation optimization
   - Multi-day planning
   - Accommodation selection
   - Cold start solution
```

**File structure:**
```
BackEnd/api/src/main/java/com/wanderlust/ai/
├── algorithm/
│   ├── RecommendationEngine.java
│   ├── UserPreferenceCalculator.java
│   ├── ClusteringService.java
│   ├── StayingTimePrediction.java
│   ├── ItineraryOptimizer.java
│   └── BudgetOptimizer.java
├── service/
│   ├── AIAssistantService.java
│   ├── ConversationService.java
│   └── VisualizationService.java
├── model/
│   ├── POI.java
│   ├── User.java
│   ├── Itinerary.java
│   ├── Recommendation.java
│   └── Constraint.java
└── controller/
    ├── AIAssistantController.java
    └── RecommendationController.java
```

**Core algorithm flow:**

```java
public class RecommendationEngine {
    
    public Itinerary generateItinerary(
        User user,
        TripConstraints constraints
    ) {
        // 1. Cold start check
        if (user.getVisitHistory().isEmpty()) {
            return handleColdStart(user, constraints);
        }
        
        // 2. Cluster user
        UserCluster cluster = clusteringService
            .assignUserToCluster(user);
        
        // 3. Calculate user preferences
        Map<String, Double> preferences = 
            preferenceCalculator.calculate(user, cluster);
        
        // 4. Filter POIs by constraints
        List<POI> candidatePOIs = filterPOIs(
            constraints.getLocation(),
            constraints.getDietaryRestrictions(),
            constraints.getBudget()
        );
        
        // 5. Predict dynamic staying time
        Map<POI, Double> stayingTimes = 
            stayingTimePrediction.predict(
                user, candidatePOIs, 
                constraints.getStartTime()
            );
        
        // 6. Multi-objective optimization
        Itinerary itinerary = itineraryOptimizer
            .optimize(
                candidatePOIs,
                preferences,
                stayingTimes,
                constraints
            );
        
        // 7. Add accommodations if multi-day
        if (constraints.getDays() > 1) {
            itinerary.addAccommodations(
                accommodationService.recommend(...)
            );
        }
        
        return itinerary;
    }
    
    private Itinerary handleColdStart(
        User user, 
        TripConstraints constraints
    ) {
        // Content-based filtering
        // Use user's stated preferences only
        // Recommend popular POIs matching preferences
        ...
    }
}
```

#### **5.2. OpenAI Integration** (1 ngày)

**File:** `BackEnd/api/src/main/java/com/wanderlust/ai/service/ConversationService.java`

```java
@Service
public class ConversationService {
    
    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    private static final String SYSTEM_PROMPT = 
        "Bạn là trợ lý du lịch AI cho hệ thống Wanderlust. " +
        "Nhiệm vụ của bạn là trò chuyện về du lịch Việt Nam, " +
        "giúp người dùng lập kế hoạch, và trả lời câu hỏi về " +
        "địa điểm, văn hóa, ẩm thực. Luôn thân thiện và hữu ích.";
    
    public String chat(String userMessage, String conversationId) {
        // 1. Load conversation history
        List<Message> history = loadHistory(conversationId);
        
        // 2. Add context from database if needed
        String enrichedMessage = enrichWithContext(userMessage);
        
        // 3. Call OpenAI API
        String response = callOpenAI(
            SYSTEM_PROMPT, 
            history, 
            enrichedMessage
        );
        
        // 4. Save to history
        saveMessage(conversationId, userMessage, response);
        
        // 5. Check if user wants recommendation
        if (detectRecommendationIntent(userMessage)) {
            // Trigger recommendation engine
            return handleRecommendationRequest(
                userMessage, response
            );
        }
        
        return response;
    }
    
    private boolean detectRecommendationIntent(String message) {
        // Check keywords: "lập kế hoạch", "gợi ý", 
        // "du lịch", "budget", "khách sạn"
        ...
    }
}
```

#### **5.3. API Endpoints** (1 ngày)

```java
@RestController
@RequestMapping("/api/ai-assistant")
public class AIAssistantController {
    
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
        @RequestBody ChatRequest request
    ) {
        // Simple conversation
        ...
    }
    
    @PostMapping("/recommend")
    public ResponseEntity<RecommendationResponse> recommend(
        @RequestBody RecommendationRequest request
    ) {
        // Generate itinerary
        ...
    }
    
    @GetMapping("/itinerary/{id}")
    public ResponseEntity<Itinerary> getItinerary(
        @PathVariable String id
    ) {
        // Retrieve saved itinerary
        ...
    }
    
    @PutMapping("/itinerary/{id}")
    public ResponseEntity<Itinerary> updateItinerary(
        @PathVariable String id,
        @RequestBody ItineraryUpdate update
    ) {
        // User modification
        ...
    }
    
    @GetMapping("/itinerary/{id}/visualize")
    public ResponseEntity<VisualizationData> visualize(
        @PathVariable String id
    ) {
        // Data for map visualization
        ...
    }
}
```

---

### **TUẦN 6: Backend Development - Advanced Features**

#### **6.1. User Clustering Implementation** (2 ngày)

**Using K-Means on visit sequences:**
```java
@Service
public class ClusteringService {
    
    private static final int NUM_CLUSTERS = 6;
    
    public void trainClusters() {
        // 1. Load all user trip histories
        List<TripHistory> histories = 
            tripHistoryRepository.findAll();
        
        // 2. Convert to sequence vectors
        List<double[]> vectors = histories.stream()
            .map(this::convertToSequenceVector)
            .collect(Collectors.toList());
        
        // 3. K-Means clustering
        KMeans kmeans = new KMeans(NUM_CLUSTERS);
        kmeans.fit(vectors);
        
        // 4. Save cluster centroids
        saveClusterCentroids(kmeans.getCentroids());
    }
    
    public UserCluster assignUserToCluster(User user) {
        // Calculate similarity to each centroid
        // Assign to closest cluster
        ...
    }
}
```

#### **6.2. Dynamic Staying Time with NMF** (2 ngày)

```java
@Service
public class StayingTimePrediction {
    
    // 3D tensor: [users × POIs × time_slots]
    private NMFModel nmfModel;
    
    public void train() {
        // 1. Build staying time matrix
        double[][][] stayingTimeMatrix = 
            buildStayingTimeMatrix();
        
        // 2. Apply NMF
        nmfModel = NMF.fit(stayingTimeMatrix, RANK);
        
        // 3. Save model
        saveModel(nmfModel);
    }
    
    public double predict(
        User user, 
        POI poi, 
        int timeSlot
    ) {
        // Use trained NMF model to predict
        return nmfModel.predict(
            user.getId(), 
            poi.getId(), 
            timeSlot
        );
    }
}
```

#### **6.3. Multi-objective Optimization** (1 ngày)

**Using NSGA-II or weighted sum approach:**
```java
@Service
public class ItineraryOptimizer {
    
    public Itinerary optimize(
        List<POI> candidates,
        Map<String, Double> preferences,
        Map<POI, Double> stayingTimes,
        TripConstraints constraints
    ) {
        // Objective 1: Maximize preference score
        // Objective 2: Maximize diversity
        // Objective 3: Minimize cost
        // Constraints: time, budget
        
        // Use genetic algorithm or ILP
        GeneticAlgorithm ga = new GeneticAlgorithm();
        ga.setPopulationSize(100);
        ga.setGenerations(50);
        
        Solution solution = ga.solve(
            candidates,
            preferences,
            stayingTimes,
            constraints
        );
        
        return solution.toItinerary();
    }
}
```

---

### **TUẦN 7: Frontend Development**

#### **7.1. AI Chat Interface** (2 ngày)

**File:** `FrontEnd/wanderlust/src/pages/AIAssistant.tsx`

```tsx
const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async () => {
    setLoading(true);
    
    const response = await fetch('/api/ai-assistant/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        conversationId: conversationId
      })
    });
    
    const data = await response.json();
    
    setMessages([
      ...messages,
      { role: 'user', content: input },
      { role: 'assistant', content: data.response }
    ]);
    
    setLoading(false);
    setInput('');
  };
  
  return (
    <div className="ai-chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>
      
      <div className="input-area">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Hỏi về du lịch Việt Nam..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Gửi
        </button>
      </div>
    </div>
  );
};
```

#### **7.2. Recommendation Form** (1 ngày)

```tsx
const RecommendationForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    budget: 0,
    days: 1,
    startDate: '',
    preferences: {},
    dietaryRestrictions: [],
    transportationPref: []
  });
  
  const handleSubmit = async () => {
    const response = await fetch('/api/ai-assistant/recommend', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    const itinerary = await response.json();
    
    // Redirect to itinerary page
    router.push(`/itinerary/${itinerary.id}`);
  };
  
  return (
    <form>
      <LocationSelect 
        value={formData.location}
        onChange={v => setFormData({...formData, location: v})}
      />
      
      <BudgetInput 
        value={formData.budget}
        onChange={v => setFormData({...formData, budget: v})}
      />
      
      <DaysSelect ... />
      <DatePicker ... />
      <PreferencesSelector ... />
      <DietaryRestrictionsSelector ... />
      <TransportationSelector ... />
      
      <button onClick={handleSubmit}>
        Lên kế hoạch
      </button>
    </form>
  );
};
```

#### **7.3. Map Visualization** (2 ngày)

**Using Google Maps API:**

```tsx
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

const ItineraryMap = ({ itinerary }) => {
  const [map, setMap] = useState(null);
  
  const pois = itinerary.pois.map(poi => ({
    position: { lat: poi.lat, lng: poi.lon },
    label: poi.name
  }));
  
  const path = pois.map(p => p.position);
  
  return (
    <GoogleMap
      center={pois[0]?.position}
      zoom={12}
      onLoad={setMap}
    >
      {pois.map((poi, i) => (
        <Marker 
          key={i}
          position={poi.position}
          label={String(i+1)}
          onClick={() => showPOIDetails(itinerary.pois[i])}
        />
      ))}
      
      <Polyline 
        path={path}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2
        }}
      />
    </GoogleMap>
  );
};
```

#### **7.4. Itinerary Display & Edit** (2 ngày)

```tsx
const ItineraryPage = ({ itineraryId }) => {
  const [itinerary, setItinerary] = useState(null);
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="itinerary-page">
      <div className="itinerary-header">
        <h1>{itinerary.name}</h1>
        <div className="stats">
          <span>Tổng: {itinerary.totalCost.toLocaleString()} VND</span>
          <span>Thời gian: {itinerary.totalTime} giờ</span>
          <span>{itinerary.pois.length} địa điểm</span>
        </div>
      </div>
      
      <div className="itinerary-content">
        <div className="left-panel">
          <ItineraryTimeline 
            itinerary={itinerary}
            onEdit={editing ? handleEdit : null}
          />
        </div>
        
        <div className="right-panel">
          <ItineraryMap itinerary={itinerary} />
        </div>
      </div>
      
      <div className="actions">
        <button onClick={() => setEditing(!editing)}>
          {editing ? 'Lưu' : 'Chỉnh sửa'}
        </button>
        <button onClick={handleExport}>
          Xuất PDF
        </button>
        <button onClick={handleShare}>
          Chia sẻ
        </button>
      </div>
    </div>
  );
};
```

---

### **TUẦN 8-9: Testing, Optimization & Deployment**

#### **8.1. Testing** (3 ngày)

**Unit tests:**
- Algorithm components
- API endpoints
- Data processing functions

**Integration tests:**
- End-to-end user flows
- OpenAI integration
- Database operations

**User acceptance testing:**
- Test with real users
- Collect feedback
- Iterate on UX

#### **8.2. Performance Optimization** (2 ngày)

- Cache frequent queries
- Index optimization
- Algorithm performance tuning
- Frontend bundle optimization

#### **8.3. Documentation** (1 ngày)

- API documentation (Swagger)
- User manual
- Developer guide
- Deployment guide

#### **8.4. Deployment** (1 ngày)

- Deploy Backend to production
- Deploy Frontend
- Setup monitoring
- Setup backups

---

## 📊 DELIVERABLES

### Giai đoạn 1 (Data):
✅ MongoDB với 800-1000 POIs Vietnam
✅ Transportation matrix
✅ Data quality report
✅ Documentation

### Giai đoạn 2 (Implementation):
✅ Backend API với AI recommendation
✅ OpenAI chat integration
✅ Frontend UI/UX
✅ Map visualization
✅ Comprehensive tests
✅ Deployed system

---

## 🎯 SUCCESS METRICS

### Data Quality:
- ≥95% POIs with complete information
- ≥90% accurate GPS coordinates
- ≥80% POIs with valid cost estimates

### Algorithm Performance:
- Response time < 2 seconds for recommendations
- User satisfaction score ≥4/5
- ≥85% itineraries meet budget constraints

### System Performance:
- API response time < 500ms (p95)
- Frontend load time < 3 seconds
- 99.9% uptime

---

## 💡 NOTES & RECOMMENDATIONS

### Priorities:
1. **Focus on data quality** - This is foundation
2. **Start simple, iterate** - Launch with basic algorithm first
3. **User feedback early** - Test with real users ASAP
4. **Vietnam first** - International can wait

### Risks & Mitigations:
- **Risk:** Data collection takes longer than expected
  - **Mitigation:** Start with top 5 destinations only
  
- **Risk:** Algorithm too slow
  - **Mitigation:** Pre-compute recommendations, use caching
  
- **Risk:** OpenAI costs too high
  - **Mitigation:** Add response caching, limit context window

### Future Enhancements:
- Real-time crowd data
- Weather integration
- Social features (share itineraries)
- Booking integration
- Mobile app
- Multiple languages

---

*Kế hoạch này có thể điều chỉnh dựa trên tiến độ thực tế và feedback.*
