"""
Monitor crawling progress
Run this script to check current status
"""

import json
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime

PROGRESS_FILE = Path("crawled_data/progress.json")
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "wanderlust_ai"

def format_duration(seconds):
    """Format seconds to human-readable duration"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours}h {minutes}m {secs}s"

def main():
    print("="*70)
    print("📊 WANDERLUST CRAWL PROGRESS")
    print("="*70)
    
    # Read progress file
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            progress = json.load(f)
        
        print("\n🏃 Progress Status:")
        print(f"  Started: {progress.get('start_time', 'N/A')}")
        print(f"  Last Update: {progress.get('last_update', 'N/A')}")
        
        completed = len(progress.get('completed_regions', []))
        failed = len(progress.get('failed_regions', []))
        total_pois = progress.get('total_pois_collected', 0)
        
        print(f"\n📍 Regions:")
        print(f"  ✅ Completed: {completed}")
        print(f"  ❌ Failed: {failed}")
        print(f"  📦 Total POIs collected: {total_pois:,}")
        
        # Calculate progress percentage (estimate 114 total regions)
        progress_pct = (completed / 114) * 100
        print(f"  📈 Overall Progress: {progress_pct:.1f}% ({completed}/114 regions)")
        
        # Show last 5 completed regions
        if progress.get('completed_regions'):
            print("\n📝 Recently Completed:")
            for region in progress['completed_regions'][-5:]:
                print(f"    - {region}")
        
        # Show failed regions
        if progress.get('failed_regions'):
            print("\n⚠️  Failed Regions:")
            for region in progress['failed_regions']:
                print(f"    - {region}")
    else:
        print("\n⚠️  No progress file found. Crawl may not have started yet.")
    
    # Connect to MongoDB
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        db = client[DB_NAME]
        
        # Get database statistics
        stats = db.command("dbstats")
        pois_count = db.pois.count_documents({})
        
        print("\n💾 MongoDB Status:")
        print(f"  Database: {DB_NAME}")
        print(f"  Total POIs: {pois_count:,}")
        print(f"  Data Size: {stats['dataSize'] / (1024*1024):.2f} MB")
        print(f"  Storage Size: {stats['storageSize'] / (1024*1024):.2f} MB")
        
        # Count by country
        pipeline = [
            {"$group": {
                "_id": "$address.country",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}}
        ]
        
        country_stats = list(db.pois.aggregate(pipeline))
        if country_stats:
            print("\n🌍 POIs by Country:")
            for stat in country_stats[:10]:
                country = stat['_id'] or 'Unknown'
                count = stat['count']
                print(f"    - {country}: {count:,}")
        
        # Count by category
        pipeline = [
            {"$unwind": "$categories"},
            {"$group": {
                "_id": "$categories",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        category_stats = list(db.pois.aggregate(pipeline))
        if category_stats:
            print("\n📂 Top Categories:")
            for stat in category_stats:
                category = stat['_id']
                count = stat['count']
                print(f"    - {category}: {count:,}")
        
        client.close()
        
    except Exception as e:
        print(f"\n⚠️  Could not connect to MongoDB: {e}")
    
    print("\n" + "="*70)
    print("💡 Tips:")
    print("  - Run this script periodically to monitor progress")
    print("  - Full crawl takes ~13-17 hours")
    print("  - You can interrupt with Ctrl+C and resume later")
    print("  - Check crawled_data/crawler.log for detailed logs")
    print("="*70)

if __name__ == "__main__":
    main()
