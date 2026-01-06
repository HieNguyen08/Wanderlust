"""
Production Crawler - Full Data Collection Pipeline
Target: 500K+ POIs across Vietnam, Southeast Asia, East Asia
Features: MongoDB integration, progress tracking, resume capability, error handling
"""

import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging
from pathlib import Path
import pymongo
from pymongo import MongoClient
import sys

# Import our modules
from regions_config import (
    get_all_regions, 
    get_vietnam_regions,
    get_priority_regions,
    Region
)

# ============================================================================
# Configuration
# ============================================================================

class CrawlerConfig:
    """Production crawler configuration"""
    # MongoDB
    MONGO_URI = "mongodb://localhost:27017/"
    DB_NAME = "wanderlust_ai"
    
    # Output
    OUTPUT_DIR = Path("./crawled_data")
    PROGRESS_FILE = OUTPUT_DIR / "progress.json"
    ERROR_LOG = OUTPUT_DIR / "errors.log"
    
    # Rate limiting
    OVERPASS_RATE_LIMIT = 2.0  # seconds between requests
    WIKIPEDIA_RATE_LIMIT = 0.5
    NOMINATIM_RATE_LIMIT = 1.0
    
    # Batch settings
    BATCH_SIZE = 100  # Save to DB every N POIs
    MAX_RETRIES = 3
    RETRY_DELAY = 5.0
    
    # Resume capability
    ENABLE_RESUME = True
    SAVE_PROGRESS_INTERVAL = 50  # Save progress every N regions

# ============================================================================
# Progress Tracking
# ============================================================================

class ProgressTracker:
    """Track crawling progress and enable resume"""
    
    def __init__(self, progress_file: Path):
        self.progress_file = progress_file
        self.progress = self._load_progress()
        
    def _load_progress(self) -> Dict[str, Any]:
        """Load progress from file"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            "completed_regions": [],
            "failed_regions": [],
            "total_pois_collected": 0,
            "last_updated": None,
            "start_time": datetime.utcnow().isoformat()
        }
    
    def save_progress(self):
        """Save progress to file"""
        self.progress["last_updated"] = datetime.utcnow().isoformat()
        self.progress_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(self.progress, f, indent=2, ensure_ascii=False)
    
    def is_region_completed(self, region_name: str) -> bool:
        """Check if region already crawled"""
        return region_name in self.progress["completed_regions"]
    
    def mark_region_completed(self, region_name: str, pois_count: int):
        """Mark region as completed"""
        if region_name not in self.progress["completed_regions"]:
            self.progress["completed_regions"].append(region_name)
        self.progress["total_pois_collected"] += pois_count
        self.save_progress()
    
    def mark_region_failed(self, region_name: str, error: str):
        """Mark region as failed"""
        self.progress["failed_regions"].append({
            "region": region_name,
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        })
        self.save_progress()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get progress statistics"""
        return {
            "completed": len(self.progress["completed_regions"]),
            "failed": len(self.progress["failed_regions"]),
            "total_pois": self.progress["total_pois_collected"],
            "start_time": self.progress["start_time"],
            "last_updated": self.progress["last_updated"]
        }

# ============================================================================
# MongoDB Manager
# ============================================================================

class MongoDBManager:
    """Manage MongoDB operations"""
    
    def __init__(self, uri: str, db_name: str):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.pois = self.db["pois"]
        self.logger = logging.getLogger("MongoDBManager")
        
        # Create indexes if not exist
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create necessary indexes"""
        try:
            # Geospatial index
            self.pois.create_index([("location", pymongo.GEOSPHERE)])
            
            # Compound index for efficient queries
            self.pois.create_index([
                ("address.province", pymongo.ASCENDING),
                ("categories", pymongo.ASCENDING)
            ])
            
            # Source tracking (avoid duplicates)
            self.pois.create_index([
                ("source_platform", pymongo.ASCENDING),
                ("source_id", pymongo.ASCENDING)
            ], unique=True, sparse=True)
            
            self.logger.info("✅ MongoDB indexes ready")
        except Exception as e:
            self.logger.warning(f"Index creation: {e}")
    
    def insert_poi(self, poi: Dict[str, Any]) -> Optional[str]:
        """Insert a single POI"""
        try:
            result = self.pois.insert_one(poi)
            return str(result.inserted_id)
        except pymongo.errors.DuplicateKeyError:
            # POI already exists (same source_platform + source_id)
            self.logger.debug(f"Duplicate POI: {poi.get('name')}")
            return None
        except Exception as e:
            self.logger.error(f"Error inserting POI: {e}")
            return None
    
    def insert_pois_batch(self, pois: List[Dict[str, Any]]) -> int:
        """Insert multiple POIs, return count of successful inserts"""
        if not pois:
            return 0
        
        inserted = 0
        for poi in pois:
            if self.insert_poi(poi):
                inserted += 1
        
        return inserted
    
    def count_pois(self, filter_dict: Optional[Dict] = None) -> int:
        """Count POIs matching filter"""
        return self.pois.count_documents(filter_dict or {})
    
    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        return {
            "total_pois": self.count_pois(),
            "vietnam_pois": self.count_pois({"address.country": "Vietnam"}),
            "by_country": self._count_by_country()
        }
    
    def _count_by_country(self) -> Dict[str, int]:
        """Count POIs by country"""
        pipeline = [
            {"$group": {"_id": "$address.country", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        results = {}
        for doc in self.pois.aggregate(pipeline):
            if doc["_id"]:
                results[doc["_id"]] = doc["count"]
        
        return results

# ============================================================================
# Enhanced OSM Crawler with MongoDB
# ============================================================================

class ProductionOSMCrawler:
    """Production-ready OSM crawler with database integration"""
    
    OVERPASS_ENDPOINTS = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.openstreetmap.ru/api/interpreter"
    ]
    
    def __init__(self, config: CrawlerConfig, db_manager: MongoDBManager, 
                 progress_tracker: ProgressTracker):
        self.config = config
        self.db = db_manager
        self.progress = progress_tracker
        self.logger = logging.getLogger("ProductionOSMCrawler")
        
        self.session: Optional[aiohttp.ClientSession] = None
        self.endpoint_index = 0
        self.stats = {
            "regions_processed": 0,
            "pois_collected": 0,
            "pois_saved": 0,
            "errors": 0
        }
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": "Wanderlust-AI/1.0"},
            timeout=aiohttp.ClientTimeout(total=120)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def _build_overpass_query(self, region: Region) -> str:
        """Build Overpass QL query for a region"""
        bbox = region.bbox  # (south, west, north, east)
        
        query = f"""
[out:json][timeout:120];
(
  node["tourism"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["historic"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["amenity"~"restaurant|cafe|place_of_worship"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["natural"~"peak|beach|waterfall|lake|bay"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["leisure"~"park|nature_reserve|water_park"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["shop"~"mall|supermarket"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
);
out body;
"""
        return query
    
    async def crawl_region(self, region: Region) -> List[Dict[str, Any]]:
        """Crawl POIs from a single region"""
        self.logger.info(f"🔍 Crawling: {region.name} ({region.country})")
        
        # Check if already completed
        if self.progress.is_region_completed(region.name):
            self.logger.info(f"⏭️  Skipping {region.name} (already completed)")
            return []
        
        query = self._build_overpass_query(region)
        
        # Try with retries
        for attempt in range(self.config.MAX_RETRIES):
            try:
                await asyncio.sleep(self.config.OVERPASS_RATE_LIMIT)
                
                endpoint = self.OVERPASS_ENDPOINTS[self.endpoint_index]
                async with self.session.post(endpoint, data={"data": query}) as response:
                    if response.status == 200:
                        data = await response.json()
                        pois = self._parse_overpass_response(data, region)
                        
                        self.logger.info(f"✅ {region.name}: {len(pois)} POIs")
                        return pois
                    
                    elif response.status == 429:
                        # Rate limited, try next endpoint
                        self.logger.warning(f"⚠️  Rate limited, switching endpoint...")
                        self.endpoint_index = (self.endpoint_index + 1) % len(self.OVERPASS_ENDPOINTS)
                        await asyncio.sleep(self.config.RETRY_DELAY)
                    
                    else:
                        self.logger.warning(f"⚠️  HTTP {response.status}, retrying...")
                        await asyncio.sleep(self.config.RETRY_DELAY)
                        
            except asyncio.TimeoutError:
                self.logger.warning(f"⚠️  Timeout, attempt {attempt + 1}/{self.config.MAX_RETRIES}")
                await asyncio.sleep(self.config.RETRY_DELAY)
                
            except Exception as e:
                self.logger.error(f"❌ Error crawling {region.name}: {e}")
                await asyncio.sleep(self.config.RETRY_DELAY)
        
        # All retries failed
        self.logger.error(f"❌ Failed to crawl {region.name} after {self.config.MAX_RETRIES} attempts")
        self.progress.mark_region_failed(region.name, "Max retries exceeded")
        self.stats["errors"] += 1
        return []
    
    def _parse_overpass_response(self, data: Dict, region: Region) -> List[Dict[str, Any]]:
        """Parse Overpass response to POI documents"""
        pois = []
        
        for element in data.get("elements", []):
            if element.get("type") != "node":
                continue
            
            tags = element.get("tags", {})
            if not tags.get("name"):
                continue
            
            # Build MongoDB document
            poi = {
                "name": tags.get("name", ""),
                "name_en": tags.get("name:en", ""),
                "location": {
                    "type": "Point",
                    "coordinates": [element.get("lon", 0.0), element.get("lat", 0.0)]
                },
                "address": {
                    "province": region.name,
                    "country": region.country,
                    "full_address": tags.get("addr:full", ""),
                    "street": tags.get("addr:street", ""),
                    "district": tags.get("addr:district", "")
                },
                "categories": self._extract_categories(tags),
                "description": {
                    "vi": tags.get("description", ""),
                    "en": tags.get("description:en", "")
                },
                "visiting_info": {
                    "avg_staying_time": 2.0,  # Default
                    "opening_hours": self._parse_opening_hours(tags.get("opening_hours", ""))
                },
                "cost": {
                    "entrance_fee": 0.0  # Default, will be enriched later
                },
                "amenities": {
                    "wheelchair_accessible": tags.get("wheelchair") == "yes",
                    "wifi": tags.get("internet_access") == "wlan",
                    "parking": "parking" in tags
                },
                "sources": [{
                    "platform": "openstreetmap",
                    "external_id": str(element.get("id", "")),
                    "url": f"https://www.openstreetmap.org/node/{element.get('id', '')}",
                    "last_updated": datetime.utcnow()
                }],
                "source_platform": "openstreetmap",
                "source_id": str(element.get("id", "")),
                "popularity_score": 50.0,  # Default, will be calculated
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            pois.append(poi)
        
        return pois
    
    def _extract_categories(self, tags: Dict[str, str]) -> List[str]:
        """Extract categories from OSM tags"""
        categories = set()
        
        # Map common tags
        tag_mapping = {
            "tourism": {
                "attraction": "tourist_attraction",
                "museum": "museum",
                "hotel": "accommodation",
                "hostel": "accommodation"
            },
            "historic": {
                "monument": "historical",
                "memorial": "historical",
                "castle": "historical"
            },
            "natural": {
                "peak": "mountain",
                "beach": "beach",
                "waterfall": "waterfall",
                "lake": "lake"
            },
            "amenity": {
                "restaurant": "restaurant",
                "cafe": "cafe",
                "place_of_worship": "temple"
            }
        }
        
        for key, value in tags.items():
            if key in tag_mapping and value in tag_mapping[key]:
                categories.add(tag_mapping[key][value])
        
        return list(categories) if categories else ["tourist_attraction"]
    
    def _parse_opening_hours(self, hours_str: str) -> Dict[str, str]:
        """Parse opening hours (simplified)"""
        if not hours_str or hours_str == "24/7":
            return {day: "00:00-23:59" for day in 
                   ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}
        
        # Simplified parser - just return the raw string for now
        return {"raw": hours_str}
    
    async def crawl_all_regions(self, regions: List[Region]):
        """Crawl all regions with progress tracking"""
        self.logger.info(f"🚀 Starting crawl for {len(regions)} regions")
        self.logger.info(f"📊 Estimated POIs: {sum(r.estimated_pois for r in regions):,}")
        
        for idx, region in enumerate(regions, 1):
            self.logger.info(f"\n{'='*70}")
            self.logger.info(f"Region {idx}/{len(regions)}: {region.name} ({region.country})")
            self.logger.info(f"{'='*70}")
            
            # Crawl region
            pois = await self.crawl_region(region)
            
            if pois:
                # Save to MongoDB
                saved_count = self.db.insert_pois_batch(pois)
                
                self.stats["pois_collected"] += len(pois)
                self.stats["pois_saved"] += saved_count
                
                self.logger.info(f"💾 Saved {saved_count}/{len(pois)} POIs to MongoDB")
                
                # Mark as completed
                self.progress.mark_region_completed(region.name, saved_count)
            
            self.stats["regions_processed"] += 1
            
            # Save progress periodically
            if idx % self.config.SAVE_PROGRESS_INTERVAL == 0:
                self.progress.save_progress()
                self._print_stats()
        
        # Final save
        self.progress.save_progress()
        self._print_stats()
        
        self.logger.info(f"\n{'='*70}")
        self.logger.info("🎉 CRAWLING COMPLETE!")
        self.logger.info(f"{'='*70}")
    
    def _print_stats(self):
        """Print current statistics"""
        self.logger.info(f"\n📊 Statistics:")
        self.logger.info(f"   Regions processed: {self.stats['regions_processed']}")
        self.logger.info(f"   POIs collected: {self.stats['pois_collected']:,}")
        self.logger.info(f"   POIs saved: {self.stats['pois_saved']:,}")
        self.logger.info(f"   Errors: {self.stats['errors']}")
        
        db_stats = self.db.get_stats()
        self.logger.info(f"\n💾 Database:")
        self.logger.info(f"   Total POIs: {db_stats['total_pois']:,}")

# ============================================================================
# Main Execution
# ============================================================================

async def main():
    """Main crawling pipeline"""
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(CrawlerConfig.OUTPUT_DIR / "crawler.log", encoding='utf-8')
        ]
    )
    
    logger = logging.getLogger("Main")
    logger.info("="*70)
    logger.info("WANDERLUST PRODUCTION CRAWLER")
    logger.info("="*70)
    
    # Initialize components
    config = CrawlerConfig()
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    progress = ProgressTracker(config.PROGRESS_FILE)
    db = MongoDBManager(config.MONGO_URI, config.DB_NAME)
    
    # Print initial stats
    logger.info(f"\n📊 Initial Database Stats:")
    stats = db.get_stats()
    logger.info(f"   Total POIs: {stats['total_pois']:,}")
    if stats['by_country']:
        logger.info(f"   By country:")
        for country, count in stats['by_country'].items():
            logger.info(f"     - {country}: {count:,}")
    
    logger.info(f"\n📈 Progress:")
    progress_stats = progress.get_stats()
    logger.info(f"   Completed regions: {progress_stats['completed']}")
    logger.info(f"   Failed regions: {progress_stats['failed']}")
    logger.info(f"   Total POIs collected: {progress_stats['total_pois']:,}")
    
    # Select regions to crawl
    logger.info(f"\n🎯 Crawling Strategy:")
    logger.info(f"   Phase 1: Vietnam (63 provinces) - Priority 1&2")
    logger.info(f"   Phase 2: Southeast Asia (30 cities) - Priority 1")
    logger.info(f"   Phase 3: East Asia (22 cities) - Priority 1")
    
    # Get regions (start with Vietnam Priority 1)
    vietnam_p1 = [r for r in get_vietnam_regions() if r.priority == 1]
    
    logger.info(f"\n🚀 Starting with Vietnam Priority 1: {len(vietnam_p1)} regions")
    input("Press Enter to continue or Ctrl+C to cancel...")
    
    # Crawl
    async with ProductionOSMCrawler(config, db, progress) as crawler:
        await crawler.crawl_all_regions(vietnam_p1)
    
    # Final stats
    logger.info(f"\n" + "="*70)
    logger.info("FINAL STATISTICS")
    logger.info("="*70)
    
    final_stats = db.get_stats()
    logger.info(f"Total POIs in database: {final_stats['total_pois']:,}")
    logger.info(f"\nBy country:")
    for country, count in final_stats['by_country'].items():
        logger.info(f"  {country}: {count:,}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Crawling interrupted by user")
        print("Progress has been saved. Run again to resume.")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
