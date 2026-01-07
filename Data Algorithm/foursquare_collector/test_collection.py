"""
Test data collection with a single region
"""

from collector import FoursquareCollector
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def main():
    print("\n" + "="*60)
    print("🧪 TESTING DATA COLLECTION")
    print("Region: Hanoi, Vietnam")
    print("="*60 + "\n")
    
    collector = FoursquareCollector()
    
    # Setup indexes
    print("Setting up database indexes...")
    collector.collection.create_index([("location", "2dsphere")])
    collector.collection.create_index([("source_id", 1)], unique=True)
    
    # Test with Hanoi
    test_region = {
        "name": "Hà Nội",
        "lat": 21.0285,
        "lng": 105.8542
    }
    
    count = collector.collect_region("Vietnam", test_region)
    
    print("\n" + "="*60)
    print(f"✅ Collection complete!")
    print(f"Venues collected: {count}")
    print(f"Total requests: {collector.stats['total_requests']}")
    print(f"Verified: {collector.stats['verified_venues']}")
    print(f"Open: {collector.stats['open_venues']}")
    print(f"Closed: {collector.stats['closed_venues']}")
    print("="*60)
    
    # Show sample data
    print("\n📄 Sample venue:")
    sample = collector.collection.find_one()
    if sample:
        print(f"Name: {sample['name']}")
        print(f"Categories: {', '.join(sample['categories'])}")
        print(f"Location: {sample['location']['coordinates']}")
        print(f"Address: {sample['address']['full_address']}")
        print(f"Foursquare ID: {sample['metadata']['foursquare_id']}")

if __name__ == "__main__":
    main()
