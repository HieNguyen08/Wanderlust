"""
OpenStreetMap (OSM) Data Crawler - COMPLETELY FREE!
Replaces Google Places API to save costs

Data Sources:
1. Overpass API - Query OSM data (location, name, category)
2. Nominatim - Geocoding & reverse geocoding
3. OSRM - Routing & travel time calculations

Advantages:
- ✅ 100% FREE, no API keys needed
- ✅ Complete Vietnam POI data
- ✅ Open data, no licensing issues
- ✅ Community-maintained, up-to-date
- ✅ Rich metadata (opening hours, contact, etc.)
"""

import aiohttp
import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
from datetime import datetime
import json

# ============================================================================
# OpenStreetMap Crawler
# ============================================================================

class OSMCrawler:
    """Crawler for OpenStreetMap data via Overpass API"""
    
    # Overpass API endpoints (public instances)
    OVERPASS_ENDPOINTS = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.openstreetmap.ru/api/interpreter"
    ]
    
    # Nominatim for geocoding (address lookup)
    NOMINATIM_URL = "https://nominatim.openstreetmap.org"
    
    # OSM tag mapping to Wanderlust categories
    CATEGORY_MAPPING = {
        # Nature
        "natural=peak": ["nature", "mountain"],
        "natural=beach": ["nature", "beach"],
        "natural=waterfall": ["nature", "waterfall"],
        "natural=lake": ["nature", "lake"],
        "natural=bay": ["nature", "beach"],
        "leisure=park": ["nature", "park"],
        "leisure=nature_reserve": ["nature"],
        
        # Culture & Historical
        "historic=monument": ["historical", "culture"],
        "historic=memorial": ["historical", "culture"],
        "historic=archaeological_site": ["historical", "culture"],
        "historic=castle": ["historical", "culture"],
        "historic=ruins": ["historical", "culture"],
        "amenity=place_of_worship": ["temple", "culture"],
        "building=temple": ["temple", "culture"],
        "building=pagoda": ["pagoda", "culture"],
        "building=church": ["church", "culture"],
        "tourism=museum": ["museum", "culture"],
        "tourism=gallery": ["museum", "culture"],
        
        # Food & Dining
        "amenity=restaurant": ["food", "restaurant"],
        "amenity=cafe": ["food", "cafe"],
        "amenity=fast_food": ["food"],
        "amenity=food_court": ["food"],
        "shop=bakery": ["food"],
        
        # Shopping
        "shop=mall": ["shopping", "mall"],
        "shop=supermarket": ["shopping"],
        "amenity=marketplace": ["shopping", "market"],
        "shop=convenience": ["shopping"],
        "shop=clothes": ["shopping"],
        "shop=gifts": ["shopping"],
        
        # Entertainment
        "tourism=attraction": ["entertainment"],
        "tourism=theme_park": ["entertainment"],
        "leisure=water_park": ["entertainment"],
        "amenity=theatre": ["entertainment"],
        "amenity=cinema": ["entertainment"],
        "amenity=nightclub": ["entertainment", "nightlife"],
        
        # Adventure
        "sport=diving": ["adventure", "diving"],
        "sport=climbing": ["adventure"],
        "tourism=camp_site": ["adventure"],
        
        # Accommodation
        "tourism=hotel": ["accommodation"],
        "tourism=hostel": ["accommodation"],
        "tourism=guest_house": ["accommodation"],
        "tourism=resort": ["accommodation"]
    }
    
    def __init__(self, rate_limit: float = 1.0):
        """
        Initialize OSM Crawler
        
        Args:
            rate_limit: Delay between requests (seconds). 
                       Overpass API recommends 1 req/second
        """
        self.rate_limit = rate_limit
        self.logger = logging.getLogger("OSMCrawler")
        self.session: Optional[aiohttp.ClientSession] = None
        self.endpoint_index = 0
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            headers={
                "User-Agent": "Wanderlust-AI-Assistant/1.0 (Travel Planning App)"
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def _build_overpass_query(self, province: str, category: Optional[str] = None) -> str:
        """
        Build Overpass QL query for POIs in a province
        
        Args:
            province: Vietnam province name (e.g., "Hà Nội", "Đà Nẵng")
            category: Optional category filter
        
        Returns:
            Overpass QL query string
        """
        # Define bounding box for Vietnam provinces
        # (This is simplified - you may need precise coordinates per province)
        bbox_map = {
            "Hà Nội": (20.9, 105.7, 21.1, 105.95),  # (south, west, north, east)
            "Hồ Chí Minh": (10.6, 106.5, 10.9, 106.9),
            "Đà Nẵng": (15.9, 107.9, 16.2, 108.3),
            "Quảng Ninh": (20.8, 106.8, 21.3, 107.8),
            "Lào Cai": (22.3, 103.7, 22.6, 104.2),
            "Khánh Hòa": (12.0, 109.0, 12.5, 109.4),
            "Kiên Giang": (9.8, 104.5, 10.5, 105.2),
            "Thừa Thiên Huế": (16.3, 107.4, 16.6, 107.8),
            "Lâm Đồng": (11.7, 108.2, 12.2, 108.8)
        }
        
        bbox = bbox_map.get(province, (10.0, 102.0, 23.0, 110.0))  # Default: all Vietnam
        
        # Build query based on category
        if category:
            # Get OSM tags for this category
            tags = [tag for tag, cats in self.CATEGORY_MAPPING.items() 
                   if category in cats]
            if tags:
                tag_filters = "\n  ".join([f'node["{tag.split("=")[0]}"="{tag.split("=")[1]}"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});'
                                          for tag in tags])
            else:
                # Fallback: all tourism POIs
                tag_filters = f'node["tourism"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});'
        else:
            # Query all tourism-related POIs
            tag_filters = f'''
  node["tourism"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["historic"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["amenity"~"restaurant|cafe|place_of_worship"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["natural"~"peak|beach|waterfall|lake"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
  node["leisure"~"park|nature_reserve"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
'''
        
        query = f"""
[out:json][timeout:60];
(
{tag_filters}
);
out body;
>;
out skel qt;
"""
        return query
    
    async def search_pois(self, province: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search POIs in a province using Overpass API
        
        Args:
            province: Province name
            category: Optional category filter
        
        Returns:
            List of POI data dictionaries
        """
        self.logger.info(f"Searching OSM: {province} - {category or 'all categories'}")
        
        query = self._build_overpass_query(province, category)
        
        # Try multiple Overpass endpoints (failover)
        for attempt in range(len(self.OVERPASS_ENDPOINTS)):
            endpoint = self.OVERPASS_ENDPOINTS[self.endpoint_index]
            
            try:
                await asyncio.sleep(self.rate_limit)  # Rate limiting
                
                async with self.session.post(endpoint, data={"data": query}) as response:
                    if response.status == 200:
                        data = await response.json()
                        pois = self._parse_overpass_response(data, province)
                        self.logger.info(f"Found {len(pois)} POIs from OSM")
                        return pois
                    elif response.status == 429:
                        # Rate limited, try next endpoint
                        self.logger.warning(f"Rate limited on {endpoint}, trying next...")
                        self.endpoint_index = (self.endpoint_index + 1) % len(self.OVERPASS_ENDPOINTS)
                    else:
                        self.logger.warning(f"Request failed: {response.status}")
                        
            except Exception as e:
                self.logger.error(f"Error querying {endpoint}: {e}")
                self.endpoint_index = (self.endpoint_index + 1) % len(self.OVERPASS_ENDPOINTS)
        
        self.logger.error("All Overpass endpoints failed")
        return []
    
    def _parse_overpass_response(self, data: Dict, province: str) -> List[Dict[str, Any]]:
        """Parse Overpass API JSON response to POI dictionaries"""
        pois = []
        
        for element in data.get("elements", []):
            if element.get("type") != "node":
                continue
            
            tags = element.get("tags", {})
            if not tags.get("name"):
                continue  # Skip unnamed POIs
            
            # Map OSM tags to categories
            categories = self._map_osm_tags_to_categories(tags)
            if not categories:
                categories = ["tourist_attraction"]
            
            # Build POI data
            poi = {
                "name": tags.get("name", ""),
                "name_en": tags.get("name:en", ""),
                "latitude": element.get("lat", 0.0),
                "longitude": element.get("lon", 0.0),
                "province": province,
                "categories": categories,
                "description_vi": tags.get("description", ""),
                "description_en": tags.get("description:en", ""),
                
                # Extract metadata from OSM tags
                "osm_tags": tags,
                "osm_id": element.get("id", ""),
                
                # Opening hours
                "opening_hours_raw": tags.get("opening_hours", ""),
                
                # Contact info
                "phone": tags.get("phone", ""),
                "website": tags.get("website", ""),
                "email": tags.get("email", ""),
                
                # Amenities from tags
                "wheelchair": tags.get("wheelchair") == "yes",
                "wifi": tags.get("internet_access") == "wlan",
                
                # Source
                "source_platform": "openstreetmap",
                "source_id": str(element.get("id", "")),
                "source_url": f"https://www.openstreetmap.org/node/{element.get('id', '')}",
                
                "crawled_at": datetime.utcnow().isoformat()
            }
            
            # Extract address details using Nominatim (optional, can be batched later)
            # For now, we just set province
            poi["full_address"] = tags.get("addr:full", "")
            poi["street"] = tags.get("addr:street", "")
            poi["district"] = tags.get("addr:district", "")
            
            pois.append(poi)
        
        return pois
    
    def _map_osm_tags_to_categories(self, tags: Dict[str, str]) -> List[str]:
        """Map OSM tags to Wanderlust categories"""
        categories = set()
        
        for osm_tag, wanderlust_cats in self.CATEGORY_MAPPING.items():
            key, value = osm_tag.split("=")
            if tags.get(key) == value:
                categories.update(wanderlust_cats)
        
        return list(categories)
    
    async def get_poi_details_from_nominatim(self, osm_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed POI information from Nominatim
        
        Args:
            osm_id: OpenStreetMap node ID
        
        Returns:
            Detailed POI data or None
        """
        url = f"{self.NOMINATIM_URL}/lookup"
        params = {
            "osm_ids": f"N{osm_id}",  # N = node
            "format": "json",
            "addressdetails": 1,
            "extratags": 1,
            "namedetails": 1
        }
        
        try:
            await asyncio.sleep(1)  # Nominatim requires 1 req/second
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    if data:
                        return data[0]
                        
        except Exception as e:
            self.logger.error(f"Error fetching from Nominatim: {e}")
        
        return None

# ============================================================================
# Wikipedia/Wikidata Crawler for Descriptions
# ============================================================================

class WikipediaCrawler:
    """Crawler for Wikipedia descriptions (NLP-ready content)"""
    
    WIKIPEDIA_API = "https://vi.wikipedia.org/w/api.php"
    WIKIDATA_API = "https://www.wikidata.org/w/api.php"
    
    def __init__(self):
        self.logger = logging.getLogger("WikipediaCrawler")
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": "Wanderlust-AI/1.0"}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def search_wikipedia_article(self, poi_name: str) -> Optional[str]:
        """
        Search for Wikipedia article about a POI
        
        Args:
            poi_name: Name of the POI
        
        Returns:
            Article extract (first 500 chars) or None
        """
        params = {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
            "titles": poi_name
        }
        
        try:
            async with self.session.get(self.WIKIPEDIA_API, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    pages = data.get("query", {}).get("pages", {})
                    
                    for page_id, page in pages.items():
                        if page_id != "-1":  # Found
                            extract = page.get("extract", "")
                            return extract[:500] if len(extract) > 500 else extract
                            
        except Exception as e:
            self.logger.error(f"Error fetching Wikipedia: {e}")
        
        return None
    
    async def get_wikidata_info(self, poi_name: str) -> Optional[Dict[str, Any]]:
        """
        Get structured data from Wikidata
        
        Args:
            poi_name: Name of the POI
        
        Returns:
            Wikidata properties (coordinates, descriptions, etc.)
        """
        # Search for entity
        search_params = {
            "action": "wbsearchentities",
            "format": "json",
            "language": "vi",
            "search": poi_name,
            "limit": 1
        }
        
        try:
            async with self.session.get(self.WIKIDATA_API, params=search_params) as response:
                if response.status == 200:
                    data = await response.json()
                    search_results = data.get("search", [])
                    
                    if search_results:
                        entity_id = search_results[0].get("id")
                        
                        # Get entity details
                        entity_params = {
                            "action": "wbgetentities",
                            "format": "json",
                            "ids": entity_id,
                            "languages": "vi|en"
                        }
                        
                        async with self.session.get(self.WIKIDATA_API, params=entity_params) as resp:
                            if resp.status == 200:
                                entity_data = await resp.json()
                                return entity_data.get("entities", {}).get(entity_id, {})
                                
        except Exception as e:
            self.logger.error(f"Error fetching Wikidata: {e}")
        
        return None

# ============================================================================
# OSRM Routing Integration
# ============================================================================

class OSRMRouter:
    """Calculate travel time and distance using OSRM (Open Source Routing Machine)"""
    
    # Public OSRM servers (FREE!)
    OSRM_SERVERS = [
        "https://router.project-osrm.org",
        "https://routing.openstreetmap.de/routed-car"
    ]
    
    def __init__(self):
        self.logger = logging.getLogger("OSRMRouter")
        self.session: Optional[aiohttp.ClientSession] = None
        self.server_index = 0
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def calculate_route(self, 
                             from_coords: tuple[float, float], 
                             to_coords: tuple[float, float],
                             profile: str = "driving") -> Optional[Dict[str, Any]]:
        """
        Calculate route between two coordinates
        
        Args:
            from_coords: (latitude, longitude) start point
            to_coords: (latitude, longitude) end point
            profile: "driving", "walking", or "cycling"
        
        Returns:
            Route data with distance (meters) and duration (seconds)
        """
        # OSRM expects (longitude, latitude) - note the order!
        from_lon, from_lat = from_coords[1], from_coords[0]
        to_lon, to_lat = to_coords[1], to_coords[0]
        
        server = self.OSRM_SERVERS[self.server_index]
        url = f"{server}/route/v1/{profile}/{from_lon},{from_lat};{to_lon},{to_lat}"
        params = {
            "overview": "false",
            "steps": "false"
        }
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("code") == "Ok" and data.get("routes"):
                        route = data["routes"][0]
                        return {
                            "distance_meters": route.get("distance", 0),
                            "duration_seconds": route.get("duration", 0),
                            "distance_km": round(route.get("distance", 0) / 1000, 2),
                            "duration_hours": round(route.get("duration", 0) / 3600, 2)
                        }
                        
        except Exception as e:
            self.logger.error(f"OSRM routing error: {e}")
        
        return None
    
    async def calculate_distance_matrix(self, 
                                       coordinates: List[tuple[float, float]]) -> Optional[Dict[str, Any]]:
        """
        Calculate distance matrix for multiple POIs (for tour optimization)
        
        Args:
            coordinates: List of (latitude, longitude) tuples
        
        Returns:
            Distance matrix (durations and distances)
        """
        # Format coordinates for OSRM (lon,lat pairs)
        coords_str = ";".join([f"{coord[1]},{coord[0]}" for coord in coordinates])
        
        server = self.OSRM_SERVERS[self.server_index]
        url = f"{server}/table/v1/driving/{coords_str}"
        params = {
            "annotations": "distance,duration"
        }
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("code") == "Ok":
                        return {
                            "durations": data.get("durations", []),
                            "distances": data.get("distances", [])
                        }
                        
        except Exception as e:
            self.logger.error(f"OSRM matrix error: {e}")
        
        return None

# ============================================================================
# Example Usage
# ============================================================================

async def example_osm_crawl():
    """Example: Crawl POIs from OpenStreetMap"""
    
    # Initialize OSM crawler
    async with OSMCrawler(rate_limit=1.0) as osm:
        # Search all POIs in Hà Nội
        hanoi_pois = await osm.search_pois("Hà Nội")
        print(f"\n✅ Found {len(hanoi_pois)} POIs in Hà Nội")
        
        # Search specific category
        temples = await osm.search_pois("Hà Nội", category="temple")
        print(f"✅ Found {len(temples)} temples in Hà Nội")
        
        # Sample POI
        if hanoi_pois:
            sample = hanoi_pois[0]
            print(f"\n📍 Sample POI:")
            print(f"   Name: {sample['name']}")
            print(f"   Location: {sample['latitude']}, {sample['longitude']}")
            print(f"   Categories: {sample['categories']}")
            print(f"   URL: {sample['source_url']}")
    
    # Enhance with Wikipedia descriptions
    async with WikipediaCrawler() as wiki:
        description = await wiki.search_wikipedia_article("Hồ Hoàn Kiếm")
        if description:
            print(f"\n📚 Wikipedia description:")
            print(f"   {description[:200]}...")
    
    # Calculate travel time
    async with OSRMRouter() as router:
        # Example: Hồ Hoàn Kiếm to Temple of Literature
        route = await router.calculate_route(
            from_coords=(21.0285, 105.8526),  # Hoan Kiem Lake
            to_coords=(21.0286, 105.8355)     # Van Mieu
        )
        if route:
            print(f"\n🚗 Route calculation:")
            print(f"   Distance: {route['distance_km']} km")
            print(f"   Duration: {route['duration_hours']} hours")

if __name__ == "__main__":
    asyncio.run(example_osm_crawl())
