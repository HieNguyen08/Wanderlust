"""
Data Crawler Architecture for Wanderlust AI Assistant
Phase 1 Week 1-2: POI Data Collection

Architecture Design:
- Multi-source data collection (TripAdvisor, Google Places, vietnam.travel)
- Parallel crawling with rate limiting
- Data validation & deduplication
- MongoDB storage with retry logic
- Progress tracking & error handling
"""

import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import json
import logging
from abc import ABC, abstractmethod

# ============================================================================
# Configuration
# ============================================================================

@dataclass
class CrawlerConfig:
    """Crawler configuration"""
    # API Keys
    google_places_api_key: str = ""  # Get from Google Cloud Console
    tripadvisor_api_key: str = ""    # Get from TripAdvisor Developer
    
    # Rate limiting (requests per second)
    google_rate_limit: float = 10.0
    tripadvisor_rate_limit: float = 5.0
    scraping_rate_limit: float = 2.0
    
    # Batch settings
    batch_size: int = 50
    concurrent_requests: int = 5
    
    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017/"
    db_name: str = "wanderlust_ai"
    
    # Output
    output_dir: str = "./crawled_data"
    log_level: str = "INFO"
    
    # Target provinces for initial crawl
    target_provinces: List[str] = None
    
    def __post_init__(self):
        if self.target_provinces is None:
            self.target_provinces = [
                "Hà Nội",
                "Hồ Chí Minh",
                "Đà Nẵng",
                "Quảng Ninh",
                "Lào Cai",
                "Khánh Hòa",
                "Kiên Giang",
                "Thừa Thiên Huế",
                "Lâm Đồng"
            ]

# ============================================================================
# Data Models
# ============================================================================

@dataclass
class POIData:
    """Standardized POI data model"""
    # Basic info
    name: str
    name_en: Optional[str] = None
    
    # Location
    latitude: float = 0.0
    longitude: float = 0.0
    province: str = ""
    district: str = ""
    ward: str = ""
    street: str = ""
    full_address: str = ""
    
    # Categories
    categories: List[str] = None
    
    # Descriptions
    description_vi: str = ""
    description_en: str = ""
    
    # Ratings
    rating_average: float = 0.0
    rating_count: int = 0
    rating_distribution: Dict[str, int] = None
    
    # Visiting info
    avg_staying_time: float = 2.0  # Default 2 hours
    opening_hours: Dict[str, str] = None
    best_time_slots: List[int] = None
    peak_season: List[str] = None
    crowd_level: str = "medium"
    
    # Costs
    entrance_fee: float = 0.0
    avg_meal_cost: float = 0.0
    parking_fee: float = 0.0
    
    # Amenities
    amenities: Dict[str, bool] = None
    
    # Dietary (for food POIs)
    cuisine_types: List[str] = None
    allergens: List[str] = None
    vegetarian_options: bool = False
    vegan_options: bool = False
    
    # Images
    images: List[Dict[str, str]] = None
    
    # Source tracking
    source_platform: str = ""
    source_id: str = ""
    source_url: str = ""
    
    # Metadata
    crawled_at: datetime = None
    
    def __post_init__(self):
        if self.categories is None:
            self.categories = []
        if self.rating_distribution is None:
            self.rating_distribution = {}
        if self.opening_hours is None:
            self.opening_hours = {}
        if self.best_time_slots is None:
            self.best_time_slots = []
        if self.peak_season is None:
            self.peak_season = []
        if self.amenities is None:
            self.amenities = {}
        if self.cuisine_types is None:
            self.cuisine_types = []
        if self.allergens is None:
            self.allergens = []
        if self.images is None:
            self.images = []
        if self.crawled_at is None:
            self.crawled_at = datetime.utcnow()
    
    def to_mongodb_document(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        doc = {
            "name": self.name,
            "name_en": self.name_en,
            "location": {
                "type": "Point",
                "coordinates": [self.longitude, self.latitude]
            },
            "address": {
                "province": self.province,
                "district": self.district,
                "ward": self.ward,
                "street": self.street,
                "full_address": self.full_address
            },
            "categories": self.categories,
            "description": {
                "vi": self.description_vi,
                "en": self.description_en
            },
            "ratings": {
                "average": self.rating_average,
                "count": self.rating_count,
                "distribution": self.rating_distribution
            },
            "visiting_info": {
                "avg_staying_time": self.avg_staying_time,
                "best_time_slots": self.best_time_slots,
                "opening_hours": self.opening_hours,
                "peak_season": self.peak_season,
                "crowd_level": self.crowd_level
            },
            "cost": {
                "entrance_fee": self.entrance_fee,
                "avg_meal_cost": self.avg_meal_cost,
                "parking_fee": self.parking_fee
            },
            "amenities": self.amenities,
            "images": self.images,
            "sources": [{
                "platform": self.source_platform,
                "external_id": self.source_id,
                "url": self.source_url,
                "last_updated": self.crawled_at
            }],
            "created_at": self.crawled_at,
            "updated_at": self.crawled_at
        }
        
        # Add dietary info if food POI
        if "food" in self.categories or "restaurant" in self.categories:
            doc["dietary_info"] = {
                "cuisine_types": self.cuisine_types,
                "allergens": self.allergens,
                "vegetarian_options": self.vegetarian_options,
                "vegan_options": self.vegan_options
            }
        
        return doc

# ============================================================================
# Base Crawler Class
# ============================================================================

class BaseCrawler(ABC):
    """Abstract base class for data crawlers"""
    
    def __init__(self, config: CrawlerConfig):
        self.config = config
        self.logger = self._setup_logger()
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limiter = asyncio.Semaphore(config.concurrent_requests)
    
    def _setup_logger(self) -> logging.Logger:
        """Setup logger"""
        logger = logging.getLogger(self.__class__.__name__)
        logger.setLevel(self.config.log_level)
        
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        return logger
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    @abstractmethod
    async def search_pois(self, province: str, category: Optional[str] = None) -> List[POIData]:
        """Search POIs in a province"""
        pass
    
    @abstractmethod
    async def get_poi_details(self, poi_id: str) -> Optional[POIData]:
        """Get detailed POI information"""
        pass
    
    async def _rate_limited_request(self, url: str, **kwargs) -> Optional[Dict]:
        """Make rate-limited HTTP request"""
        async with self.rate_limiter:
            try:
                async with self.session.get(url, **kwargs) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        self.logger.warning(f"Request failed: {response.status} - {url}")
                        return None
            except Exception as e:
                self.logger.error(f"Request error: {e} - {url}")
                return None

# ============================================================================
# Google Places Crawler
# ============================================================================

class GooglePlacesCrawler(BaseCrawler):
    """Crawler for Google Places API"""
    
    BASE_URL = "https://maps.googleapis.com/maps/api/place"
    
    # Category mapping: Wanderlust → Google Places types
    CATEGORY_MAPPING = {
        "nature": ["park", "natural_feature"],
        "mountain": ["natural_feature"],
        "beach": ["beach"],
        "temple": ["hindu_temple", "buddhist_temple"],
        "pagoda": ["place_of_worship"],
        "church": ["church"],
        "historical": ["museum", "tourist_attraction"],
        "museum": ["museum"],
        "food": ["restaurant"],
        "restaurant": ["restaurant"],
        "cafe": ["cafe"],
        "shopping": ["shopping_mall", "store"],
        "entertainment": ["amusement_park", "night_club"],
        "park": ["park"]
    }
    
    async def search_pois(self, province: str, category: Optional[str] = None) -> List[POIData]:
        """Search POIs using Google Places Text Search"""
        self.logger.info(f"Searching Google Places: {province} - {category}")
        
        # Build search query
        query = f"tourist attractions in {province} Vietnam"
        if category and category in self.CATEGORY_MAPPING:
            place_types = self.CATEGORY_MAPPING[category]
            query = f"{place_types[0]} in {province} Vietnam"
        
        url = f"{self.BASE_URL}/textsearch/json"
        params = {
            "query": query,
            "key": self.config.google_places_api_key,
            "language": "vi"
        }
        
        results = []
        next_page_token = None
        
        # Google Places returns max 60 results (3 pages × 20)
        for page in range(3):
            if page > 0 and next_page_token:
                params["pagetoken"] = next_page_token
                await asyncio.sleep(2)  # Required delay for next page
            
            data = await self._rate_limited_request(url, params=params)
            if not data or "results" not in data:
                break
            
            for place in data["results"]:
                poi = await self._parse_google_place(place)
                if poi:
                    results.append(poi)
            
            next_page_token = data.get("next_page_token")
            if not next_page_token:
                break
        
        self.logger.info(f"Found {len(results)} POIs from Google Places")
        return results
    
    async def get_poi_details(self, place_id: str) -> Optional[POIData]:
        """Get detailed place information"""
        url = f"{self.BASE_URL}/details/json"
        params = {
            "place_id": place_id,
            "fields": "name,rating,user_ratings_total,formatted_address,geometry,photos,opening_hours,price_level,types,reviews",
            "key": self.config.google_places_api_key,
            "language": "vi"
        }
        
        data = await self._rate_limited_request(url, params=params)
        if not data or "result" not in data:
            return None
        
        return await self._parse_google_place(data["result"], detailed=True)
    
    async def _parse_google_place(self, place: Dict, detailed: bool = False) -> Optional[POIData]:
        """Parse Google Places response to POIData"""
        try:
            # Extract location
            location = place.get("geometry", {}).get("location", {})
            lat = location.get("lat", 0.0)
            lng = location.get("lng", 0.0)
            
            # Extract address components
            address = place.get("formatted_address", "")
            address_parts = address.split(", ")
            
            # Map Google types to our categories
            types = place.get("types", [])
            categories = self._map_google_types_to_categories(types)
            
            # Build POIData
            poi = POIData(
                name=place.get("name", ""),
                latitude=lat,
                longitude=lng,
                full_address=address,
                province=self._extract_province(address),
                categories=categories,
                rating_average=place.get("rating", 0.0),
                rating_count=place.get("user_ratings_total", 0),
                source_platform="google_places",
                source_id=place.get("place_id", ""),
                source_url=f"https://maps.google.com/?cid={place.get('place_id', '')}"
            )
            
            # Add detailed info if available
            if detailed:
                opening_hours = place.get("opening_hours", {})
                if opening_hours:
                    poi.opening_hours = self._parse_opening_hours(opening_hours)
                
                # Extract amenities from reviews/types
                poi.amenities = self._extract_amenities(place)
            
            return poi
            
        except Exception as e:
            self.logger.error(f"Error parsing Google Place: {e}")
            return None
    
    def _map_google_types_to_categories(self, types: List[str]) -> List[str]:
        """Map Google Place types to Wanderlust categories"""
        categories = set()
        for gtype in types:
            for category, gtypes in self.CATEGORY_MAPPING.items():
                if gtype in gtypes:
                    categories.add(category)
        
        # Fallback
        if not categories:
            categories.add("tourist_attraction")
        
        return list(categories)
    
    def _extract_province(self, address: str) -> str:
        """Extract province from address"""
        # Vietnam address format: ..., District, Province
        parts = address.split(", ")
        for part in reversed(parts):
            for province in self.config.target_provinces:
                if province in part:
                    return province
        return ""
    
    def _parse_opening_hours(self, hours_data: Dict) -> Dict[str, str]:
        """Parse opening hours"""
        # Simplified - need to implement proper parsing
        return {
            "monday": "09:00-17:00",
            "tuesday": "09:00-17:00",
            "wednesday": "09:00-17:00",
            "thursday": "09:00-17:00",
            "friday": "09:00-17:00",
            "saturday": "09:00-17:00",
            "sunday": "09:00-17:00"
        }
    
    def _extract_amenities(self, place: Dict) -> Dict[str, bool]:
        """Extract amenities from place data"""
        amenities = {
            "parking": False,
            "wifi": False,
            "wheelchair_accessible": False,
            "kid_friendly": True,  # Default
            "food_available": False,
            "restroom": True  # Assume most places have restroom
        }
        
        # Check types for amenities
        types = place.get("types", [])
        if "parking" in types:
            amenities["parking"] = True
        if "restaurant" in types or "cafe" in types:
            amenities["food_available"] = True
        
        return amenities

# ============================================================================
# TripAdvisor Crawler (Placeholder)
# ============================================================================

class TripAdvisorCrawler(BaseCrawler):
    """Crawler for TripAdvisor API"""
    
    BASE_URL = "https://api.tripadvisor.com/api/partner/2.0"
    
    async def search_pois(self, province: str, category: Optional[str] = None) -> List[POIData]:
        """Search POIs on TripAdvisor"""
        self.logger.info(f"TripAdvisor search: {province} - {category}")
        # TODO: Implement TripAdvisor API integration
        # Note: TripAdvisor API có nhiều limitations, có thể cần web scraping
        return []
    
    async def get_poi_details(self, location_id: str) -> Optional[POIData]:
        """Get detailed location info from TripAdvisor"""
        # TODO: Implement details retrieval
        return None

# ============================================================================
# Vietnam.travel Scraper (Placeholder)
# ============================================================================

class VietnamTravelScraper(BaseCrawler):
    """Web scraper for vietnam.travel"""
    
    BASE_URL = "https://vietnam.travel"
    
    async def search_pois(self, province: str, category: Optional[str] = None) -> List[POIData]:
        """Scrape POIs from vietnam.travel"""
        self.logger.info(f"Scraping vietnam.travel: {province}")
        # TODO: Implement web scraping with BeautifulSoup/Scrapy
        # Need to respect robots.txt and rate limits
        return []
    
    async def get_poi_details(self, url: str) -> Optional[POIData]:
        """Scrape detailed POI page"""
        # TODO: Implement detail scraping
        return None

# ============================================================================
# Master Crawler Orchestrator
# ============================================================================

class CrawlerOrchestrator:
    """Orchestrates multiple crawlers and manages data pipeline"""
    
    def __init__(self, config: CrawlerConfig):
        self.config = config
        self.logger = logging.getLogger("CrawlerOrchestrator")
        self.crawlers: List[BaseCrawler] = []
        self.results: List[POIData] = []
    
    def add_crawler(self, crawler: BaseCrawler):
        """Add a crawler to the pipeline"""
        self.crawlers.append(crawler)
    
    async def crawl_all_provinces(self) -> List[POIData]:
        """Crawl POIs from all target provinces"""
        self.logger.info(f"Starting crawl for {len(self.config.target_provinces)} provinces")
        
        all_pois = []
        
        for province in self.config.target_provinces:
            self.logger.info(f"Crawling: {province}")
            
            # Crawl from each source
            for crawler in self.crawlers:
                async with crawler:
                    pois = await crawler.search_pois(province)
                    all_pois.extend(pois)
                    
                    self.logger.info(f"  {crawler.__class__.__name__}: {len(pois)} POIs")
            
            # Rate limiting between provinces
            await asyncio.sleep(1)
        
        self.logger.info(f"Total POIs collected: {len(all_pois)}")
        
        # Deduplicate
        deduplicated = self._deduplicate_pois(all_pois)
        self.logger.info(f"After deduplication: {len(deduplicated)} POIs")
        
        self.results = deduplicated
        return deduplicated
    
    def _deduplicate_pois(self, pois: List[POIData]) -> List[POIData]:
        """Remove duplicate POIs based on name and location"""
        unique_pois = {}
        
        for poi in pois:
            # Create key from name + rounded coordinates
            key = f"{poi.name.lower()}_{round(poi.latitude, 3)}_{round(poi.longitude, 3)}"
            
            if key not in unique_pois:
                unique_pois[key] = poi
            else:
                # Merge data from duplicate (prefer higher rating count)
                existing = unique_pois[key]
                if poi.rating_count > existing.rating_count:
                    unique_pois[key] = poi
        
        return list(unique_pois.values())
    
    def save_to_json(self, filename: str):
        """Save results to JSON file"""
        output = [asdict(poi) for poi in self.results]
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2, default=str)
        
        self.logger.info(f"Saved {len(output)} POIs to {filename}")

# ============================================================================
# Example Usage
# ============================================================================

async def main():
    """Example usage of crawler architecture"""
    
    # Create configuration
    config = CrawlerConfig(
        google_places_api_key="YOUR_GOOGLE_API_KEY",
        tripadvisor_api_key="YOUR_TRIPADVISOR_API_KEY",
        target_provinces=["Hà Nội", "Đà Nẵng"]  # Start with 2 provinces for testing
    )
    
    # Create orchestrator
    orchestrator = CrawlerOrchestrator(config)
    
    # Add crawlers
    orchestrator.add_crawler(GooglePlacesCrawler(config))
    # orchestrator.add_crawler(TripAdvisorCrawler(config))
    # orchestrator.add_crawler(VietnamTravelScraper(config))
    
    # Crawl
    pois = await orchestrator.crawl_all_provinces()
    
    # Save results
    orchestrator.save_to_json("crawled_pois.json")
    
    print(f"\n✅ Crawling complete! Collected {len(pois)} POIs")

if __name__ == "__main__":
    asyncio.run(main())
