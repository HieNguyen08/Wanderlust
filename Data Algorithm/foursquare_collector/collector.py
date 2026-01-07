"""
Foursquare Places API Collector
Collects POI data using Foursquare API v3
Free tier: 10,000 requests/month = ~500,000 venues
"""

import requests
import time
from typing import Dict, List, Optional
from datetime import datetime
import logging
from pymongo import MongoClient
import json

from config import (
    CLIENT_ID, CLIENT_SECRET, API_VERSION, API_BASE_URL, MONGO_URI, DB_NAME, COLLECTION_NAME,
    REGIONS, CATEGORY_MAPPING, BATCH_SIZE, MAX_RADIUS, REQUESTS_PER_SECOND
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('foursquare_collection.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class FoursquareCollector:
    """Collect POI data from Foursquare Places API"""
    
    def __init__(self):
        self.client_id = CLIENT_ID
        self.client_secret = CLIENT_SECRET
        self.api_version = API_VERSION
        self.base_url = API_BASE_URL
        
        # MongoDB setup
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.collection = self.db[COLLECTION_NAME]
        
        # Statistics
        self.stats = {
            "total_requests": 0,
            "total_venues": 0,
            "by_country": {},
            "by_category": {},
            "verified_venues": 0,
            "open_venues": 0,
            "closed_venues": 0,
            "with_photos": 0,
            "errors": 0
        }
    
    def search_venues(self, 
                     lat: float, 
                     lng: float, 
                     radius: int = MAX_RADIUS,
                     categories: Optional[str] = None,
                     limit: int = 50) -> List[Dict]:
        """
        Search venues near a location using Foursquare v2 API
        
        Args:
            lat: Latitude
            lng: Longitude
            radius: Search radius in meters (max 50000)
            categories: Comma-separated category IDs (not used in v2)
            limit: Number of results (max 50)
        
        Returns:
            List of venue dictionaries
        """
        
        endpoint = f"{self.base_url}/venues/search"
        
        params = {
            "ll": f"{lat},{lng}",
            "radius": min(radius, MAX_RADIUS),
            "limit": min(limit, 50),
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "v": self.api_version
        }
        
        if categories:
            params["categoryId"] = categories
        
        try:
            response = requests.get(
                endpoint, 
                params=params,
                timeout=30
            )
            
            self.stats["total_requests"] += 1
            
            if response.status_code == 200:
                data = response.json()
                venues = data.get("response", {}).get("venues", [])
                logger.debug(f"Found {len(venues)} venues at ({lat}, {lng})")
                return venues
            
            elif response.status_code == 429:
                logger.warning("Rate limit exceeded - sleeping 60s")
                time.sleep(60)
                return []
            
            else:
                logger.error(f"API error {response.status_code}: {response.text}")
                self.stats["errors"] += 1
                return []
        
        except Exception as e:
            logger.error(f"Request failed: {e}")
            self.stats["errors"] += 1
            return []
    
    def transform_venue(self, venue: Dict, country: str, region: str) -> Dict:
        """
        Transform Foursquare v2 venue to wanderlust_ai schema
        
        Args:
            venue: Foursquare v2 venue dict
            country: Country name
            region: Region name
        
        Returns:
            Transformed POI dict
        """
        
        # Extract coordinates (v2 API format)
        location_data = venue.get("location", {})
        lat = location_data.get("lat")
        lng = location_data.get("lng")
        
        # Extract categories
        categories_raw = venue.get("categories", [])
        categories = []
        for cat in categories_raw:
            cat_name = cat.get("name", "").lower()
            # Map to our category system
            if "restaurant" in cat_name or "dining" in cat_name:
                categories.append("restaurant")
            elif "cafe" in cat_name or "coffee" in cat_name:
                categories.append("cafe")
            elif "hotel" in cat_name or "hostel" in cat_name:
                categories.append("accommodation")
            elif "temple" in cat_name or "shrine" in cat_name:
                categories.append("temple")
            elif "museum" in cat_name:
                categories.append("museum")
            elif "beach" in cat_name:
                categories.append("beach")
            elif "mountain" in cat_name or "hill" in cat_name:
                categories.append("mountain")
            elif any(x in cat_name for x in ["landmark", "monument", "historic"]):
                categories.append("historical")
            elif any(x in cat_name for x in ["tourist", "attraction", "sight"]):
                categories.append("tourist_attraction")
            else:
                categories.append(cat_name.replace(" ", "_"))
        
        # Remove duplicates
        categories = list(set(categories)) if categories else ["general"]
        
        # v2 API doesn't have closed_bucket, verified fields
        is_closed = False
        verified = False
        
        # Extract other data (v2 format)
        # Note: v2 API has different fields than v3
        stats = venue.get("stats", {})
        rating = 0  # v2 doesn't provide ratings in search
        popularity = stats.get("checkinsCount", 0) / 100  # Normalize
        
        # Photos - v2 API doesn't include photos in search
        image_url = None
        
        # Price level - v2 doesn't have this
        price_level = 0
        
        # Hours
        hours_data = venue.get("hours", {})
        opening_hours = {}
        if hours_data:
            for day in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
                opening_hours[day] = "00:00-23:59"  # Simplified for now
        
        # Build POI document
        poi = {
            "name": venue.get("name", "Unknown"),
            "name_en": venue.get("name", ""),
            "location": {
                "type": "Point",
                "coordinates": [lng, lat] if lng and lat else [0, 0]
            },
            "address": {
                "province": region,
                "country": country,
                "full_address": location_data.get("formattedAddress", [""])[0] if location_data.get("formattedAddress") else "",
                "street": location_data.get("address", ""),
                "district": location_data.get("city", "")
            },
            "categories": categories,
            "description": {
                "vi": "",
                "en": ""
            },
            "features": [],
            "ratings": {
                "overall": rating,
                "count": stats.get("checkinsCount", 0)
            },
            "visiting_info": {
                "avg_staying_time": 1,
                "opening_hours": opening_hours
            },
            "cost": {
                "entrance_fee": 0,
                "price_level": price_level
            },
            "amenities": {
                "wheelchair_accessible": False,
                "wifi": False,
                "parking": False
            },
            "popularity_score": min(popularity, 100),
            "image_url": image_url,
            "metadata": {
                "foursquare_id": venue.get("id"),
                "verified": verified,
                "closed": is_closed,
                "distance": location_data.get("distance"),
                "contact": venue.get("contact", {}),
                "url": venue.get("url"),
                "stats": stats
            },
            "sources": [
                {
                    "platform": "foursquare",
                    "external_id": venue.get("fsq_id"),
                    "url": f"https://foursquare.com/v/{venue.get('fsq_id')}",
                    "last_updated": datetime.utcnow()
                }
            ],
            "source_platform": "foursquare",
            "source_id": venue.get("id"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Update stats
        if verified:
            self.stats["verified_venues"] += 1
        if is_closed:
            self.stats["closed_venues"] += 1
        else:
            self.stats["open_venues"] += 1
        if image_url:
            self.stats["with_photos"] += 1
        
        return poi
    
    def collect_region(self, country: str, region: Dict) -> int:
        """
        Collect all venues in a region
        
        Args:
            country: Country name
            region: Region dict with name, lat, lng
        
        Returns:
            Number of venues collected
        """
        
        region_name = region["name"]
        lat = region["lat"]
        lng = region["lng"]
        
        logger.info(f"\n{'='*60}")
        logger.info(f"Collecting: {region_name}, {country}")
        logger.info(f"Coordinates: ({lat}, {lng})")
        logger.info(f"{'='*60}")
        
        collected = 0
        
        # Search without category filter to get all types
        venues = self.search_venues(lat, lng, radius=MAX_RADIUS, limit=BATCH_SIZE)
        
        if not venues:
            logger.warning(f"No venues found in {region_name}")
            return 0
        
        # Transform and save
        pois = []
        for venue in venues:
            try:
                poi = self.transform_venue(venue, country, region_name)
                pois.append(poi)
                collected += 1
            except Exception as e:
                logger.error(f"Failed to transform venue: {e}")
                continue
        
        # Bulk insert
        if pois:
            try:
                self.collection.insert_many(pois, ordered=False)
                logger.info(f"✅ Saved {len(pois)} venues to database")
            except Exception as e:
                logger.error(f"Database insert error: {e}")
        
        # Update stats
        self.stats["total_venues"] += collected
        self.stats["by_country"][country] = self.stats["by_country"].get(country, 0) + collected
        
        # Rate limiting
        time.sleep(1.0 / REQUESTS_PER_SECOND)
        
        return collected
    
    def run_collection(self):
        """Run full data collection"""
        
        logger.info("\n" + "="*80)
        logger.info("🚀 FOURSQUARE DATA COLLECTION START")
        logger.info("="*80)
        logger.info(f"Target: {sum(len(c['regions']) for c in REGIONS.values())} regions")
        logger.info(f"Budget: 10,000 requests (free tier)")
        logger.info(f"Expected venues: ~500,000")
        logger.info("="*80 + "\n")
        
        start_time = time.time()
        
        # Setup database indexes
        logger.info("Setting up database indexes...")
        self.collection.create_index([("location", "2dsphere")])
        self.collection.create_index([("source_id", 1)], unique=True)
        self.collection.create_index([("categories", 1)])
        self.collection.create_index([("metadata.verified", 1)])
        self.collection.create_index([("metadata.closed", 1)])
        
        # Collect data
        for country, data in REGIONS.items():
            logger.info(f"\n{'#'*80}")
            logger.info(f"COUNTRY: {country}")
            logger.info(f"{'#'*80}")
            
            regions = data["regions"]
            
            for i, region in enumerate(regions, 1):
                logger.info(f"\n[{i}/{len(regions)}] {region['name']}")
                
                collected = self.collect_region(country, region)
                
                # Progress update
                logger.info(f"Progress: {self.stats['total_venues']:,} venues, "
                          f"{self.stats['total_requests']:,} requests")
                
                # Check if approaching request limit
                if self.stats["total_requests"] >= 9500:
                    logger.warning("⚠️  Approaching request limit! Stopping.")
                    break
        
        # Final report
        elapsed = time.time() - start_time
        
        logger.info("\n" + "="*80)
        logger.info("🎉 COLLECTION COMPLETE!")
        logger.info("="*80)
        logger.info(f"\n📊 STATISTICS:")
        logger.info(f"  Total venues: {self.stats['total_venues']:,}")
        logger.info(f"  Total requests: {self.stats['total_requests']:,}")
        logger.info(f"  Verified venues: {self.stats['verified_venues']:,} "
                   f"({self.stats['verified_venues']/self.stats['total_venues']*100:.1f}%)")
        logger.info(f"  Open venues: {self.stats['open_venues']:,}")
        logger.info(f"  Closed venues: {self.stats['closed_venues']:,}")
        logger.info(f"  With photos: {self.stats['with_photos']:,} "
                   f"({self.stats['with_photos']/self.stats['total_venues']*100:.1f}%)")
        logger.info(f"  Errors: {self.stats['errors']}")
        logger.info(f"  Time: {elapsed/60:.1f} minutes")
        
        logger.info(f"\n🌍 BY COUNTRY:")
        for country, count in sorted(self.stats["by_country"].items(), 
                                     key=lambda x: x[1], reverse=True):
            logger.info(f"  {country:<20} {count:>8,} venues")
        
        logger.info("\n" + "="*80)
        
        # Save stats
        with open("collection_stats.json", "w", encoding="utf-8") as f:
            json.dump(self.stats, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info("📁 Stats saved to collection_stats.json")


def main():
    """Main entry point"""
    collector = FoursquareCollector()
    collector.run_collection()


if __name__ == "__main__":
    main()
