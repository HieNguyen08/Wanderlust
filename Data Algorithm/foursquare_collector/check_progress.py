from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["wanderlust_ai"]
collection = db["pois"]

# Get statistics
total = collection.count_documents({})
by_country = collection.aggregate([
    {"$group": {"_id": "$address.country", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
])

print("\n" + "="*60)
print("📊 CURRENT COLLECTION STATUS")
print("="*60)
print(f"\nTotal POIs: {total:,}")
print("\n🌍 By Country:")
for item in by_country:
    print(f"  {item['_id']:<20} {item['count']:>8,} venues")

# Sample data
print("\n📄 Sample POI:")
sample = collection.find_one()
if sample:
    print(f"Name: {sample['name']}")
    print(f"Categories: {', '.join(sample['categories'])}")
    print(f"Location: {sample['location']['coordinates']}")
    print(f"Country: {sample['address']['country']}")
    print(f"Foursquare ID: {sample['metadata']['foursquare_id']}")

print("="*60)
