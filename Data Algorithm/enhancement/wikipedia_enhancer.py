"""
Wikipedia Enhancement Script
Add rich descriptions to POIs from Wikipedia/Wikidata
"""

import asyncio
import aiohttp
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from pymongo import MongoClient, UpdateOne
from urllib.parse import quote
import json
from datetime import datetime

# ============================================================================
# Configuration
# ============================================================================

class WikiConfig:
    """Configuration for Wikipedia enhancement"""
    MONGO_URI = "mongodb://localhost:27017"
    DB_NAME = "wanderlust_ai"
    
    # Wikipedia API endpoints
    WIKIPEDIA_API = "https://{lang}.wikipedia.org/w/api.php"
    WIKIDATA_API = "https://www.wikidata.org/w/api.php"
    
    # Rate limiting
    REQUESTS_PER_SECOND = 10  # Wikipedia allows up to 200/s for bots
    BATCH_SIZE = 50  # Process in batches
    
    # Enhancement settings
    DESCRIPTION_LENGTH = 500  # Characters
    ENABLE_WIKIDATA = True
    ENABLE_IMAGES = True
    
    # Output
    OUTPUT_DIR = Path("enhanced_data")
    LOG_FILE = OUTPUT_DIR / "wikipedia_enhancement.log"

# ============================================================================
# Wikipedia API Client
# ============================================================================

class WikipediaEnhancer:
    """Enhance POIs with Wikipedia data"""
    
    def __init__(self, config: WikiConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        self.logger = logging.getLogger("WikiEnhancer")
        
        # Statistics
        self.stats = {
            "total_processed": 0,
            "enhanced": 0,
            "no_match": 0,
            "errors": 0,
            "images_added": 0
        }
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def search_wikipedia(self, 
                              title: str, 
                              lang: str = "en") -> Optional[Dict]:
        """
        Search Wikipedia for an article
        
        Args:
            title: POI name to search
            lang: Language code (en, vi, etc.)
        
        Returns:
            Article data or None
        """
        try:
            url = self.config.WIKIPEDIA_API.format(lang=lang)
            params = {
                "action": "query",
                "format": "json",
                "titles": title,
                "prop": "extracts|pageimages|coordinates",
                "exintro": True,
                "explaintext": True,
                "exsentences": 3,
                "pithumbsize": 500,
                "redirects": 1
            }
            
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return None
                
                data = await response.json()
                pages = data.get("query", {}).get("pages", {})
                
                # Get first page
                for page_id, page in pages.items():
                    if page_id == "-1":  # Page not found
                        continue
                    
                    return {
                        "title": page.get("title"),
                        "extract": page.get("extract", "")[:self.config.DESCRIPTION_LENGTH],
                        "url": f"https://{lang}.wikipedia.org/wiki/{quote(page.get('title', ''))}",
                        "image": page.get("thumbnail", {}).get("source"),
                        "coordinates": page.get("coordinates", [{}])[0] if page.get("coordinates") else None
                    }
                
                return None
                
        except Exception as e:
            self.logger.error(f"Wikipedia search error for '{title}': {e}")
            return None
    
    async def get_wikidata_info(self, title: str) -> Optional[Dict]:
        """
        Get structured data from Wikidata
        
        Args:
            title: POI name
        
        Returns:
            Wikidata information
        """
        if not self.config.ENABLE_WIKIDATA:
            return None
        
        try:
            # Search Wikidata
            params = {
                "action": "wbsearchentities",
                "format": "json",
                "language": "en",
                "search": title,
                "limit": 1
            }
            
            async with self.session.get(self.config.WIKIDATA_API, params=params) as response:
                if response.status != 200:
                    return None
                
                data = await response.json()
                results = data.get("search", [])
                
                if not results:
                    return None
                
                entity = results[0]
                return {
                    "wikidata_id": entity.get("id"),
                    "description": entity.get("description"),
                    "url": entity.get("concepturi")
                }
                
        except Exception as e:
            self.logger.error(f"Wikidata error for '{title}': {e}")
            return None
    
    async def enhance_poi(self, poi: Dict) -> Optional[Dict]:
        """
        Enhance a single POI with Wikipedia data
        
        Args:
            poi: POI document from MongoDB
        
        Returns:
            Enhancement data or None
        """
        poi_name = poi.get("name")
        if not poi_name:
            return None
        
        self.stats["total_processed"] += 1
        
        # Try English first
        wiki_data = await self.search_wikipedia(poi_name, "en")
        
        # Try Vietnamese for Vietnam POIs
        if not wiki_data and poi.get("address", {}).get("country") == "Vietnam":
            wiki_data = await self.search_wikipedia(poi_name, "vi")
        
        # Get Wikidata info
        wikidata_info = await self.get_wikidata_info(poi_name)
        
        if not wiki_data and not wikidata_info:
            self.stats["no_match"] += 1
            return None
        
        # Build enhancement
        enhancement = {
            "wikipedia": wiki_data if wiki_data else {},
            "wikidata": wikidata_info if wikidata_info else {},
            "enhanced_at": datetime.utcnow()
        }
        
        self.stats["enhanced"] += 1
        if wiki_data and wiki_data.get("image"):
            self.stats["images_added"] += 1
        
        # Rate limiting
        await asyncio.sleep(1.0 / self.config.REQUESTS_PER_SECOND)
        
        return enhancement
    
    def get_stats(self) -> Dict:
        """Get enhancement statistics"""
        return {
            **self.stats,
            "success_rate": (self.stats["enhanced"] / self.stats["total_processed"] * 100) 
                           if self.stats["total_processed"] > 0 else 0
        }

# ============================================================================
# MongoDB Manager
# ============================================================================

class MongoEnhancer:
    """Manage MongoDB updates for enhanced POIs"""
    
    def __init__(self, mongo_uri: str, db_name: str):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.pois = self.db.pois
        self.logger = logging.getLogger("MongoEnhancer")
    
    def get_pois_to_enhance(self, 
                           limit: Optional[int] = None,
                           priority: bool = True) -> List[Dict]:
        """
        Get POIs that need Wikipedia enhancement
        
        Args:
            limit: Maximum number to fetch
            priority: Prioritize tourist attractions
        
        Returns:
            List of POI documents
        """
        query = {
            "wikipedia": {"$exists": False}  # Not yet enhanced
        }
        
        if priority:
            # Prioritize tourist attractions, historical sites, temples
            query["categories"] = {
                "$in": ["tourist_attraction", "historical", "temple", "museum"]
            }
        
        cursor = self.pois.find(query)
        
        if limit:
            cursor = cursor.limit(limit)
        
        return list(cursor)
    
    def bulk_update_enhancements(self, updates: List[Tuple[str, Dict]]) -> int:
        """
        Bulk update POIs with Wikipedia data
        
        Args:
            updates: List of (poi_id, enhancement_data) tuples
        
        Returns:
            Number of successfully updated POIs
        """
        if not updates:
            return 0
        
        operations = [
            UpdateOne(
                {"_id": poi_id},
                {"$set": enhancement}
            )
            for poi_id, enhancement in updates
        ]
        
        result = self.db.pois.bulk_write(operations, ordered=False)
        return result.modified_count
    
    def get_enhancement_stats(self) -> Dict:
        """Get database enhancement statistics"""
        total = self.pois.count_documents({})
        enhanced = self.pois.count_documents({"wikipedia": {"$exists": True}})
        with_images = self.pois.count_documents({"wikipedia.image": {"$exists": True}})
        
        return {
            "total_pois": total,
            "enhanced": enhanced,
            "not_enhanced": total - enhanced,
            "with_images": with_images,
            "enhancement_rate": (enhanced / total * 100) if total > 0 else 0
        }

# ============================================================================
# Main Enhancement Process
# ============================================================================

async def enhance_batch(wiki: WikipediaEnhancer, 
                       pois: List[Dict]) -> List[Tuple[str, Dict]]:
    """
    Enhance a batch of POIs
    
    Args:
        wiki: Wikipedia enhancer
        pois: List of POIs to enhance
    
    Returns:
        List of (poi_id, enhancement) tuples
    """
    tasks = [wiki.enhance_poi(poi) for poi in pois]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    updates = []
    for poi, result in zip(pois, results):
        if isinstance(result, Exception):
            wiki.logger.error(f"Error enhancing {poi.get('name')}: {result}")
            continue
        
        if result:
            updates.append((poi["_id"], result))
    
    return updates

async def main():
    """Main enhancement process"""
    # Setup logging
    config = WikiConfig()
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(config.LOG_FILE, encoding='utf-8')
        ]
    )
    
    logger = logging.getLogger("WikiEnhancement")
    
    logger.info("="*70)
    logger.info("WIKIPEDIA ENHANCEMENT PROCESS")
    logger.info("="*70)
    
    # Connect to MongoDB
    mongo = MongoEnhancer(config.MONGO_URI, config.DB_NAME)
    
    # Get initial stats
    initial_stats = mongo.get_enhancement_stats()
    logger.info(f"\n📊 Initial Database State:")
    logger.info(f"  Total POIs: {initial_stats['total_pois']:,}")
    logger.info(f"  Already enhanced: {initial_stats['enhanced']:,} ({initial_stats['enhancement_rate']:.1f}%)")
    logger.info(f"  Needs enhancement: {initial_stats['not_enhanced']:,}")
    
    # Ask for confirmation
    print(f"\n🎯 Will enhance {initial_stats['not_enhanced']:,} POIs")
    print(f"⏱️  Estimated time: {initial_stats['not_enhanced'] / (config.REQUESTS_PER_SECOND * 60):.0f} minutes")
    response = input("\n🚀 Start enhancement? (yes/no): ").strip().lower()
    
    if response != "yes":
        logger.info("❌ Enhancement cancelled")
        return
    
    # Start enhancement
    async with WikipediaEnhancer(config) as wiki:
        # Get POIs to enhance (start with high-priority)
        logger.info("\n📥 Fetching POIs to enhance...")
        pois = mongo.get_pois_to_enhance(priority=True)
        logger.info(f"  Found {len(pois):,} priority POIs")
        
        # Process in batches
        total_batches = (len(pois) + config.BATCH_SIZE - 1) // config.BATCH_SIZE
        
        for i in range(0, len(pois), config.BATCH_SIZE):
            batch = pois[i:i + config.BATCH_SIZE]
            batch_num = i // config.BATCH_SIZE + 1
            
            logger.info(f"\n📦 Processing batch {batch_num}/{total_batches}")
            logger.info(f"   POIs: {i+1} to {min(i+config.BATCH_SIZE, len(pois))}")
            
            # Enhance batch
            updates = await enhance_batch(wiki, batch)
            
            # Save to MongoDB
            if updates:
                updated_count = mongo.bulk_update_enhancements(updates)
                logger.info(f"   ✅ Updated {updated_count} POIs")
            
            # Progress update
            stats = wiki.get_stats()
            logger.info(f"   📊 Total: {stats['total_processed']}, "
                       f"Enhanced: {stats['enhanced']} ({stats['success_rate']:.1f}%), "
                       f"No match: {stats['no_match']}")
    
    # Final statistics
    logger.info("\n" + "="*70)
    logger.info("🎉 ENHANCEMENT COMPLETE!")
    logger.info("="*70)
    
    final_stats = mongo.get_enhancement_stats()
    logger.info(f"\n📊 Final Database Statistics:")
    logger.info(f"  Total POIs: {final_stats['total_pois']:,}")
    logger.info(f"  Enhanced: {final_stats['enhanced']:,} ({final_stats['enhancement_rate']:.1f}%)")
    logger.info(f"  With images: {final_stats['with_images']:,}")
    
    improvement = final_stats['enhanced'] - initial_stats['enhanced']
    logger.info(f"\n📈 Improvement: +{improvement:,} POIs enhanced")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
