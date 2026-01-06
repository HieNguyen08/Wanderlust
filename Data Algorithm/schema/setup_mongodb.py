"""
MongoDB Schema Setup & Validation Script
Wanderlust AI Assistant - Phase 1 Week 1
"""

import pymongo
from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT, GEOSPHERE
from datetime import datetime
import json

# ============================================================================
# Configuration
# ============================================================================

# Local development
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "wanderlust_ai"

# Production (MongoDB Atlas) - uncomment và thay bằng connection string thực
# MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"

# ============================================================================
# Database Connection
# ============================================================================

def connect_to_mongodb():
    """Connect to MongoDB instance"""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        client.server_info()
        print(f"✅ Connected to MongoDB successfully!")
        print(f"📊 Database: {DB_NAME}")
        return client[DB_NAME]
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("\n💡 Tips:")
        print("  - Make sure MongoDB is running: mongod --dbpath=<path>")
        print("  - Check connection string in MONGO_URI variable")
        print("  - For Atlas, whitelist your IP address")
        return None

# ============================================================================
# Collection Setup Functions
# ============================================================================

def setup_pois_collection(db):
    """Setup POIs collection with validation and indexes"""
    print("\n🏞️  Setting up POIs collection...")
    
    # Drop existing collection if needed (WARNING: deletes data!)
    # db.pois.drop()
    
    # Create collection with validator
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["name", "location", "categories", "cost", "visiting_info"],
            "properties": {
                "name": {"bsonType": "string"},
                "location": {
                    "bsonType": "object",
                    "required": ["type", "coordinates"],
                    "properties": {
                        "type": {"enum": ["Point"]},
                        "coordinates": {
                            "bsonType": "array",
                            "minItems": 2,
                            "maxItems": 2
                        }
                    }
                },
                "categories": {
                    "bsonType": "array",
                    "minItems": 1
                },
                "cost": {
                    "bsonType": "object",
                    "required": ["entrance_fee"]
                },
                "visiting_info": {
                    "bsonType": "object",
                    "required": ["avg_staying_time"]
                }
            }
        }
    }
    
    try:
        db.create_collection("pois", validator=validator)
        print("  ✅ POIs collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  POIs collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes
    indexes = [
        ("location", GEOSPHERE, "geo_location"),
        ("categories", ASCENDING, "categories"),
        ("address.province", ASCENDING, "province"),
        ("ratings.average", DESCENDING, "ratings"),
        ("popularity_score", DESCENDING, "popularity"),
        ("cost.entrance_fee", ASCENDING, "cost"),
        (("name", TEXT, "description.vi", TEXT, "description.en", TEXT), None, "text_search")
    ]
    
    for index_spec in indexes:
        try:
            if len(index_spec) == 3 and isinstance(index_spec[0], tuple):
                # Text index
                spec = [(field, index_type) for field, index_type in zip(index_spec[0][::2], index_spec[0][1::2])]
                db.pois.create_index(spec, name=index_spec[2])
            else:
                db.pois.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index {index_spec[2]}: {e}")
    
    print("  📊 POIs collection setup complete!")

def setup_users_collection(db):
    """Setup Users collection with validation and indexes"""
    print("\n👥 Setting up Users collection...")
    
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "created_at"],
            "properties": {
                "user_id": {"bsonType": "string"}
            }
        }
    }
    
    try:
        db.create_collection("users", validator=validator)
        print("  ✅ Users collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  Users collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes
    indexes = [
        ("user_id", ASCENDING, "user_id_unique", True),  # Unique index
        ("preferences.cluster_id", ASCENDING, "cluster"),
        ("last_active", DESCENDING, "last_active")
    ]
    
    for index_spec in indexes:
        try:
            if len(index_spec) == 4:
                db.users.create_index([(index_spec[0], index_spec[1])], name=index_spec[2], unique=index_spec[3])
            else:
                db.users.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index {index_spec[2]}: {e}")
    
    print("  📊 Users collection setup complete!")

def setup_itineraries_collection(db):
    """Setup Itineraries collection with validation and indexes"""
    print("\n🗺️  Setting up Itineraries collection...")
    
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "constraints", "days", "total_cost", "created_at"],
            "properties": {
                "user_id": {"bsonType": "string"},
                "total_cost": {"bsonType": "double", "minimum": 0}
            }
        }
    }
    
    try:
        db.create_collection("itineraries", validator=validator)
        print("  ✅ Itineraries collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  Itineraries collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes
    indexes = [
        ("user_id", ASCENDING, "user_id"),
        ("status", ASCENDING, "status"),
        ("created_at", DESCENDING, "created_at"),
        ("constraints.budget", ASCENDING, "budget"),
        ("constraints.provinces", ASCENDING, "provinces")
    ]
    
    for index_spec in indexes:
        try:
            db.itineraries.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index {index_spec[2]}: {e}")
    
    print("  📊 Itineraries collection setup complete!")

def setup_interactions_collection(db):
    """Setup User_POI_Interactions collection"""
    print("\n📊 Setting up User_POI_Interactions collection...")
    
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["user_id", "poi_id", "interaction_type", "timestamp"],
            "properties": {
                "user_id": {"bsonType": "string"},
                "poi_id": {"bsonType": "objectId"},
                "interaction_type": {
                    "enum": ["view", "click", "save", "share", "visit", "rate"]
                }
            }
        }
    }
    
    try:
        db.create_collection("user_poi_interactions", validator=validator)
        print("  ✅ Interactions collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  Interactions collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes
    indexes = [
        ([("user_id", ASCENDING), ("timestamp", DESCENDING)], "user_timestamp"),
        ([("poi_id", ASCENDING), ("timestamp", DESCENDING)], "poi_timestamp"),
        ("interaction_type", ASCENDING, "interaction_type")
    ]
    
    for index_spec in indexes:
        try:
            if isinstance(index_spec[0], list):
                db.user_poi_interactions.create_index(index_spec[0], name=index_spec[1])
            else:
                db.user_poi_interactions.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[1] if isinstance(index_spec[0], list) else index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index creation error: {e}")
    
    print("  📊 Interactions collection setup complete!")

def setup_models_collection(db):
    """Setup Algorithm_Models collection"""
    print("\n🤖 Setting up Algorithm_Models collection...")
    
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["model_type", "version", "trained_at"],
            "properties": {
                "model_type": {
                    "enum": [
                        "kmeans_user_clustering",
                        "nmf_staying_time",
                        "tfidf_poi_features",
                        "autoencoder_poi_features",
                        "genetic_algorithm_params"
                    ]
                }
            }
        }
    }
    
    try:
        db.create_collection("algorithm_models", validator=validator)
        print("  ✅ Models collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  Models collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes
    indexes = [
        ([("model_type", ASCENDING), ("version", DESCENDING)], "model_version"),
        ("is_active", ASCENDING, "is_active")
    ]
    
    for index_spec in indexes:
        try:
            if isinstance(index_spec[0], list):
                db.algorithm_models.create_index(index_spec[0], name=index_spec[1])
            else:
                db.algorithm_models.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[1] if isinstance(index_spec[0], list) else index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index creation error: {e}")
    
    print("  📊 Models collection setup complete!")

def setup_logs_collection(db):
    """Setup System_Logs collection"""
    print("\n📝 Setting up System_Logs collection...")
    
    validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["log_type", "timestamp"],
            "properties": {
                "log_type": {
                    "enum": ["recommendation", "optimization", "error", "performance"]
                }
            }
        }
    }
    
    try:
        db.create_collection("system_logs", validator=validator)
        print("  ✅ Logs collection created with validation")
    except Exception as e:
        if "already exists" in str(e):
            print("  ℹ️  Logs collection already exists")
        else:
            print(f"  ⚠️  Warning: {e}")
    
    # Create indexes with TTL (auto-delete old logs after 90 days)
    indexes = [
        ([("log_type", ASCENDING), ("timestamp", DESCENDING)], "log_type_timestamp"),
        ([("user_id", ASCENDING), ("timestamp", DESCENDING)], "user_timestamp"),
        ("timestamp", ASCENDING, "timestamp_ttl", 90*24*60*60)  # 90 days TTL
    ]
    
    for index_spec in indexes:
        try:
            if len(index_spec) == 4:
                # TTL index
                db.system_logs.create_index([(index_spec[0], index_spec[1])], 
                                           name=index_spec[2], 
                                           expireAfterSeconds=index_spec[3])
            elif isinstance(index_spec[0], list):
                db.system_logs.create_index(index_spec[0], name=index_spec[1])
            else:
                db.system_logs.create_index([(index_spec[0], index_spec[1])], name=index_spec[2])
            print(f"  ✅ Created index: {index_spec[1] if isinstance(index_spec[0], list) else index_spec[2]}")
        except Exception as e:
            print(f"  ⚠️  Index creation error: {e}")
    
    print("  📊 Logs collection setup complete!")

# ============================================================================
# Sample Data Insertion
# ============================================================================

def insert_sample_data(db):
    """Insert sample POI data for testing"""
    print("\n📥 Inserting sample data...")
    
    sample_poi = {
        "name": "Hồ Hoàn Kiếm",
        "name_en": "Hoan Kiem Lake",
        "location": {
            "type": "Point",
            "coordinates": [105.8526, 21.0285]
        },
        "address": {
            "province": "Hà Nội",
            "district": "Hoàn Kiếm",
            "ward": "Hàng Trống",
            "street": "Đường Lê Thái Tổ",
            "full_address": "Đường Lê Thái Tổ, Hàng Trống, Hoàn Kiếm, Hà Nội"
        },
        "categories": ["nature", "lake", "historical", "culture"],
        "description": {
            "vi": "Hồ Hoàn Kiếm là biểu tượng văn hóa của Hà Nội, nơi lưu giữ truyền thuyết thanh gươm báu của vua Lê Lợi. Hồ có diện tích khoảng 12 hecta, xung quanh là không gian đi bộ rộng rãi.",
            "en": "Hoan Kiem Lake is a cultural symbol of Hanoi, preserving the legend of King Le Loi's sacred sword."
        },
        "features": {
            "keywords": ["hồ", "hoàn kiếm", "văn hóa", "lịch sử", "hà nội"]
        },
        "ratings": {
            "average": 4.6,
            "count": 15234,
            "distribution": {"5": 9140, "4": 4572, "3": 1015, "2": 305, "1": 202}
        },
        "visiting_info": {
            "avg_staying_time": 1.5,
            "best_time_slots": [6, 7, 17, 18, 19, 20],
            "peak_season": ["spring", "autumn"],
            "crowd_level": "high"
        },
        "cost": {
            "entrance_fee": 0,
            "avg_meal_cost": 80000,
            "parking_fee": 15000
        },
        "amenities": {
            "parking": True,
            "wifi": False,
            "wheelchair_accessible": True,
            "kid_friendly": True,
            "food_available": True,
            "restroom": True
        },
        "popularity_score": 95.5,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    try:
        # Check if already exists
        existing = db.pois.find_one({"name": "Hồ Hoàn Kiếm"})
        if existing:
            print("  ℹ️  Sample POI already exists")
        else:
            result = db.pois.insert_one(sample_poi)
            print(f"  ✅ Inserted sample POI: {result.inserted_id}")
    except Exception as e:
        print(f"  ❌ Failed to insert sample data: {e}")

# ============================================================================
# Validation Functions
# ============================================================================

def validate_setup(db):
    """Validate database setup"""
    print("\n🔍 Validating database setup...")
    
    # Check collections
    collections = db.list_collection_names()
    expected_collections = ["pois", "users", "itineraries", "user_poi_interactions", 
                          "algorithm_models", "system_logs"]
    
    print("\n  Collections:")
    for col in expected_collections:
        if col in collections:
            count = db[col].count_documents({})
            print(f"    ✅ {col} (documents: {count})")
        else:
            print(f"    ❌ {col} - MISSING!")
    
    # Check indexes
    print("\n  Indexes:")
    for col in expected_collections:
        if col in collections:
            indexes = db[col].list_indexes()
            index_count = len(list(indexes))
            print(f"    {col}: {index_count} indexes")
    
    # Test geospatial query
    print("\n  Testing geospatial query...")
    try:
        result = db.pois.find({
            "location": {
                "$near": {
                    "$geometry": {"type": "Point", "coordinates": [105.8526, 21.0285]},
                    "$maxDistance": 5000
                }
            }
        }).limit(5)
        count = len(list(result))
        print(f"    ✅ Geospatial query works! Found {count} POIs within 5km")
    except Exception as e:
        print(f"    ⚠️  Geospatial query test: {e}")
    
    print("\n✅ Validation complete!")

# ============================================================================
# Main Setup Function
# ============================================================================

def main():
    """Main setup function"""
    print("="*70)
    print("🚀 WANDERLUST AI ASSISTANT - MONGODB SETUP")
    print("="*70)
    
    # Connect to MongoDB
    db = connect_to_mongodb()
    if not db:
        return
    
    # Setup collections
    setup_pois_collection(db)
    setup_users_collection(db)
    setup_itineraries_collection(db)
    setup_interactions_collection(db)
    setup_models_collection(db)
    setup_logs_collection(db)
    
    # Insert sample data
    insert_sample_data(db)
    
    # Validate setup
    validate_setup(db)
    
    print("\n" + "="*70)
    print("🎉 MongoDB setup complete!")
    print("="*70)
    print("\n📝 Next steps:")
    print("  1. Open MongoDB Compass: mongodb://localhost:27017")
    print("  2. Navigate to database: wanderlust_ai")
    print("  3. Verify collections and indexes")
    print("  4. Start data collection crawler")
    print("\n💡 Useful commands:")
    print("  - View collections: db.listCollections()")
    print("  - Check indexes: db.pois.getIndexes()")
    print("  - Test query: db.pois.find({}).limit(5)")

if __name__ == "__main__":
    main()
