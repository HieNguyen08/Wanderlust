# Wanderlust Deployment Guide - Production Readiness

**Version:** 1.0  
**Date:** January 4, 2026  
**Target:** 2,000 Concurrent Users

---

## Quick Start Checklist

```
[ ] 1. Create MongoDB indexes (CRITICAL - 5 mins)
[ ] 2. Build backend JAR (15-20 mins)
[ ] 3. Build frontend static files (10 mins)
[ ] 4. Configure environment variables
[ ] 5. Deploy backend (30 mins)
[ ] 6. Deploy frontend (15 mins)
[ ] 7. Verify deployment (20 mins)
[ ] 8. Run load tests (1-2 hours)
```

**Estimated Total Time:** 3-4 hours

---

## Phase 1: Database Migration (CRITICAL)

### Step 1.1: Backup Database

```bash
# Create backup before making changes
mongodump --db wanderlust --out ./backup-$(date +%Y%m%d-%H%M%S)
```

### Step 1.2: Create Indexes

**Option A: Using MongoDB Shell**
```bash
cd BackEnd/api/src/main/resources
mongosh "mongodb://localhost:27017/wanderlust" mongodb-indexes.js
```

**Option B: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to your database
3. For each collection, go to Indexes tab
4. Copy index definitions from `mongodb-indexes.js`
5. Click "Create Index" and paste JSON

### Step 1.3: Verify Indexes

```javascript
// In mongosh
use wanderlust

// Check users collection (should have 5 indexes including _id)
db.users.getIndexes()

// Verify email index is unique
db.users.getIndexes().filter(idx => idx.name === "email_unique_idx")

// Check all collections
["users", "flight_seat", "wallets", "bookings", "flights", "hotels", "notifications", "payments"].forEach(coll => {
    print(coll + ": " + db.getCollection(coll).getIndexes().length + " indexes")
})
```

**Expected Output:**
```
users: 5 indexes
flight_seat: 3 indexes  
wallets: 2 indexes
bookings: 6 indexes
flights: 5 indexes
hotels: 5 indexes
notifications: 3 indexes
payments: 5 indexes
```

---

## Phase 2: Backend Deployment

### Step 2.1: Update Configuration

**File:** `BackEnd/api/src/main/resources/application.yml`

```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/wanderlust}
      # Connection pool for 2,000 concurrent users
      # Recommended: 50-100 connections per backend instance
      max-pool-size: 100
      min-pool-size: 10
      
server:
  port: ${PORT:8080}
  
# Retry configuration (already enabled via @EnableRetry)
spring.retry:
  enabled: true
  
logging:
  level:
    org.springframework.retry: DEBUG  # Monitor retry attempts in logs
    com.wanderlust.api: INFO
```

### Step 2.2: Build Backend

```bash
cd BackEnd/api

# Clean build with all tests
.\mvnw clean package

# OR skip tests for faster build (20s vs 2-5 mins)
.\mvnw clean package -DskipTests
```

**Output:** `target/api-0.0.1-SNAPSHOT.jar` (~80-100MB)

### Step 2.3: Test Local Run

```bash
# Test the JAR locally before deploying
java -jar target/api-0.0.1-SNAPSHOT.jar

# Verify startup logs show:
#   ✅ "Started ApiApplication in X seconds"
#   ✅ "Mapped [/api/...] onto ..."
#   ✅ MongoDB connection established
```

### Step 2.4: Deploy to Server

**Option A: Traditional Server**
```bash
# Copy JAR to server
scp target/api-0.0.1-SNAPSHOT.jar user@server:/opt/wanderlust/

# SSH to server
ssh user@server

# Create systemd service
sudo nano /etc/systemd/system/wanderlust-api.service
```

```ini
[Unit]
Description=Wanderlust Travel Booking API
After=network.target

[Service]
Type=simple
User=wanderlust
WorkingDirectory=/opt/wanderlust
ExecStart=/usr/bin/java -Xmx2g -Xms1g -jar /opt/wanderlust/api-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
Environment="MONGODB_URI=mongodb://localhost:27017/wanderlust"
Environment="SPRING_PROFILES_ACTIVE=production"

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable wanderlust-api
sudo systemctl start wanderlust-api
sudo systemctl status wanderlust-api

# View logs
sudo journalctl -u wanderlust-api -f
```

**Option B: Docker**
```bash
# Build Docker image
cd BackEnd/api
docker build -t wanderlust-api:latest .

# Run container
docker run -d \
  --name wanderlust-api \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/wanderlust \
  --restart unless-stopped \
  wanderlust-api:latest
```

---

## Phase 3: Frontend Deployment

### Step 3.1: Configure API Endpoint

**File:** `FrontEnd/wanderlust/.env.production`

```env
VITE_API_BASE_URL=https://api.wanderlust.com
# OR for local testing
# VITE_API_BASE_URL=http://localhost:8080
```

### Step 3.2: Build Frontend

```bash
cd FrontEnd/wanderlust

# Install dependencies (if not already done)
npm install

# Production build
npm run build

# Verify build output
ls -lh build/
```

**Output:** `build/` directory (~3-5MB)
- `index.html`
- `assets/*.js` (2.3MB main bundle)
- `assets/*.css` (352KB)
- `assets/images/*`

### Step 3.3: Deploy Static Files

**Option A: Nginx**
```bash
# Copy build files
sudo cp -r build/* /var/www/wanderlust/

# Nginx configuration
sudo nano /etc/nginx/sites-available/wanderlust
```

```nginx
server {
    listen 80;
    server_name wanderlust.com www.wanderlust.com;
    
    root /var/www/wanderlust;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # SPA routing - all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site and reload nginx
sudo ln -s /etc/nginx/sites-available/wanderlust /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Option B: Netlify/Vercel**
```bash
# Netlify
npx netlify-cli deploy --prod --dir=build

# Vercel
npx vercel --prod
```

---

## Phase 4: Verification & Testing

### Step 4.1: Health Checks

```bash
# Backend health check
curl http://localhost:8080/actuator/health

# Frontend accessibility
curl -I https://wanderlust.com

# API endpoint test
curl http://localhost:8080/api/public/test
```

### Step 4.2: Functional Testing

**Test User Login:**
```bash
# Login request
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test Flight Search (with index):**
```bash
# Should return results in <200ms
time curl "http://localhost:8080/api/flights/search?from=HAN&to=SGN&date=2026-02-01"
```

### Step 4.3: Database Performance Check

```javascript
// In mongosh
use wanderlust

// Test User login query (should use email_unique_idx)
db.users.find({ email: "test@example.com" }).explain("executionStats")
// Check: executionStats.executionTimeMillis < 5ms
// Check: winningPlan uses "email_unique_idx"

// Test Flight search query (should use route_date_status_idx)
db.flights.find({
    departureAirport: "HAN",
    arrivalAirport: "SGN",
    departureTime: { $gte: new Date("2026-02-01") },
    status: "ACTIVE"
}).explain("executionStats")
// Check: executionStats.executionTimeMillis < 100ms
// Check: winningPlan uses "route_date_status_idx"
```

### Step 4.4: Concurrency Testing

**Test Double-Booking Prevention:**
```bash
# Run 10 concurrent seat booking requests
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/seats/book \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"seatId":"SEAT123","userId":"USER123"}' &
done
wait

# Verify: Only 1 booking succeeded, others got 409 Conflict
# Check logs for OptimisticLockingFailureException and retry attempts
```

**Test Wallet Balance Integrity:**
```bash
# Run 20 concurrent wallet transactions
for i in {1..20}; do
  curl -X POST http://localhost:8080/api/wallet/topup \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"amount":1000}' &
done
wait

# Verify: Final balance = initial + (20 * 1000)
# Check transaction history matches balance
```

### Step 4.5: Load Testing (Apache JMeter)

**Install JMeter:**
```bash
# Download from https://jmeter.apache.org/
# OR via package manager
brew install jmeter  # macOS
sudo apt install jmeter  # Ubuntu
```

**Simple Load Test Plan:**
1. Create test plan: 2,000 threads (users)
2. Ramp-up: 60 seconds
3. Test scenarios:
   - 30% Login requests
   - 40% Flight search requests
   - 20% Booking history queries
   - 10% Notification checks

**Expected Results:**
- Throughput: 500-1000 req/sec
- Average response time: <500ms
- p95 response time: <2s
- Error rate: <1%

---

## Phase 5: Monitoring Setup

### Step 5.1: Application Metrics

**Add Spring Boot Actuator endpoints:**
```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

### Step 5.2: MongoDB Monitoring

```javascript
// Monitor slow queries
db.setProfilingLevel(1, { slowms: 100 })

// View slow operations
db.system.profile.find().sort({ ts: -1 }).limit(10).pretty()

// Monitor index usage
db.bookings.aggregate([{ $indexStats: {} }])
```

### Step 5.3: Alert Configuration

**Key Metrics to Monitor:**
1. **OptimisticLockingFailureException rate** - Should be <1% of booking attempts
2. **Query response time p95** - Should be <200ms for indexed queries
3. **Connection pool usage** - Should not exceed 80% of max pool size
4. **Memory usage** - Backend should stay under 2GB heap
5. **Error rate** - Should be <0.1% for 5xx errors

---

## Troubleshooting

### Issue: Backend fails to start

**Symptoms:** `Error connecting to MongoDB`

**Solution:**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test MongoDB connection manually
mongosh "mongodb://localhost:27017/wanderlust" --eval "db.runCommand({ ping: 1 })"
```

### Issue: High response times after deployment

**Symptoms:** Queries taking 1-2 seconds

**Solution:**
```javascript
// Verify indexes exist
use wanderlust
db.users.getIndexes()
db.flights.getIndexes()

// If indexes missing, run mongodb-indexes.js script
```

### Issue: OptimisticLockingFailureException too frequent

**Symptoms:** >5% of booking attempts failing with version conflict

**Solution:**
```yaml
# Increase retry attempts in application.yml
spring:
  retry:
    max-attempts: 5  # Increase from 3
    backoff:
      delay: 200ms   # Increase from 100ms
```

### Issue: Frontend can't reach backend

**Symptoms:** CORS errors or 502 Bad Gateway

**Solution:**
```java
// Verify CORS configuration in SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("https://wanderlust.com");
    configuration.addAllowedOrigin("http://localhost:3000"); // Dev
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    // ... rest of config
}
```

---

## Rollback Plan

### If issues occur in production:

1. **Restore previous backend:**
   ```bash
   sudo systemctl stop wanderlust-api
   sudo cp /opt/wanderlust/api-0.0.1-SNAPSHOT.jar.backup /opt/wanderlust/api-0.0.1-SNAPSHOT.jar
   sudo systemctl start wanderlust-api
   ```

2. **Restore MongoDB (if needed):**
   ```bash
   mongorestore --db wanderlust ./backup-20260104-120000/wanderlust/
   ```

3. **Restore frontend:**
   ```bash
   sudo cp -r /var/www/wanderlust.backup/* /var/www/wanderlust/
   ```

---

## Post-Deployment Checklist

- [ ] All MongoDB indexes created and verified
- [ ] Backend responding to health checks
- [ ] Frontend loads in browser
- [ ] User login working (<5ms response time)
- [ ] Flight search working (<200ms response time)
- [ ] Booking queries working (<100ms response time)
- [ ] Seat booking concurrency test passed (0% double-booking)
- [ ] Wallet transaction test passed (100% balance integrity)
- [ ] Load test passed (2,000 concurrent users)
- [ ] Monitoring and alerts configured
- [ ] Backup strategy verified

---

## Success Criteria

✅ **Performance:**
- Login: <5ms p95
- Search: <200ms p95
- Queries: <100ms p95

✅ **Reliability:**
- Uptime: 99.9%
- Error rate: <0.1%
- Zero data corruption

✅ **Scalability:**
- 2,000 concurrent users
- 500-1000 req/sec throughput
- Horizontal scaling ready

---

## Support & Resources

- **Technical Documentation:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Status Report:** [FINAL_STATUS_REPORT.md](FINAL_STATUS_REPORT.md)
- **MongoDB Index Script:** [BackEnd/api/src/main/resources/mongodb-indexes.js](BackEnd/api/src/main/resources/mongodb-indexes.js)

**For Issues:**
1. Check logs: `sudo journalctl -u wanderlust-api -f`
2. Verify indexes: `db.collection.getIndexes()`
3. Monitor performance: `db.collection.explain("executionStats")`

---

*Last Updated: January 4, 2026*
