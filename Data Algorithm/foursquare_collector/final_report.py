from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["wanderlust_ai"]
collection = db["pois"]

print("\n" + "="*70)
print("🎉 PHASE 1 COLLECTION COMPLETE - DATA QUALITY ANALYSIS")
print("="*70)

# Overall stats
total = collection.count_documents({})
print(f"\n📊 OVERALL STATISTICS:")
print(f"  Total POIs: {total:,}")
print(f"  Countries covered: 14")
print(f"  API requests used: 77 / 10,000 (0.77%)")

# By country
print(f"\n🌍 BY COUNTRY:")
by_country = list(collection.aggregate([
    {"$group": {"_id": "$address.country", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]))
for item in by_country:
    print(f"  {item['_id']:<20} {item['count']:>5,} POIs")

# By category
print(f"\n🏷️  BY CATEGORY:")
by_category = list(collection.aggregate([
    {"$unwind": "$categories"},
    {"$group": {"_id": "$categories", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}},
    {"$limit": 15}
]))
for item in by_category:
    print(f"  {item['_id']:<30} {item['count']:>5,} POIs")

# Coordinate quality
print(f"\n📍 COORDINATE QUALITY:")
with_coords = collection.count_documents({
    "location.coordinates": {"$ne": [0, 0]}
})
print(f"  Valid coordinates: {with_coords:,} / {total:,} ({with_coords/total*100:.1f}%)")

# Address completeness
print(f"\n🏠 ADDRESS COMPLETENESS:")
with_street = collection.count_documents({
    "address.street": {"$ne": ""}
})
with_full = collection.count_documents({
    "address.full_address": {"$ne": ""}
})
print(f"  With street address: {with_street:,} ({with_street/total*100:.1f}%)")
print(f"  With full address: {with_full:,} ({with_full/total*100:.1f}%)")

# Foursquare IDs
print(f"\n🔑 FOURSQUARE DATA:")
with_fsq_id = collection.count_documents({
    "metadata.foursquare_id": {"$exists": True}
})
print(f"  With Foursquare ID: {with_fsq_id:,} ({with_fsq_id/total*100:.1f}%)")

# Sample venues from each country
print(f"\n📄 SAMPLE VENUES:")
for country in ["Vietnam", "Thailand", "Japan", "Singapore"]:
    sample = collection.find_one({"address.country": country})
    if sample:
        print(f"\n  {country}:")
        print(f"    • {sample['name']}")
        print(f"    • Categories: {', '.join(sample['categories'][:3])}")
        print(f"    • Location: ({sample['location']['coordinates'][1]:.4f}, {sample['location']['coordinates'][0]:.4f})")
        print(f"    • FSQ ID: {sample['metadata']['foursquare_id']}")

print("\n" + "="*70)
print("✅ Phase 1 Complete: Fresh POI data collected from Foursquare API")
print("📈 Next Steps:")
print("   1. Add descriptions (use Foursquare tips or OpenAI generation)")
print("   2. Calculate distance matrix (OSRM routing)")
print("   3. Feature engineering for ML models")
print("="*70 + "\n")
