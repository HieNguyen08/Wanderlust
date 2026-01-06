// ============================================================================
// WANDERLUST AI ASSISTANT - MONGODB SCHEMA DESIGN
// Phase 1 Week 1 - Database Schema for Travel Recommendation System
// Based on: MDPI Hybrid Algorithm + Budget Optimization + Vietnam Focus
// ============================================================================

// ============================================================================
// COLLECTION 1: POIs (Points of Interest)
// Lưu trữ tất cả địa điểm du lịch ở Vietnam
// ============================================================================
db.createCollection("pois", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "location", "categories", "cost", "visiting_info"],
      properties: {
        name: {
          bsonType: "string",
          description: "Tên địa điểm (tiếng Việt) - bắt buộc"
        },
        name_en: {
          bsonType: "string",
          description: "Tên địa điểm (English)"
        },
        location: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: {
              enum: ["Point"],
              description: "GeoJSON type"
            },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: {
                bsonType: "double"
              },
              description: "[longitude, latitude]"
            }
          }
        },
        address: {
          bsonType: "object",
          properties: {
            province: { bsonType: "string" },
            district: { bsonType: "string" },
            ward: { bsonType: "string" },
            street: { bsonType: "string" },
            full_address: { bsonType: "string" }
          }
        },
        categories: {
          bsonType: "array",
          minItems: 1,
          items: {
            enum: [
              "nature", "mountain", "beach", "waterfall", "lake",
              "temple", "pagoda", "church", "historical", "museum",
              "food", "restaurant", "cafe", "street_food",
              "shopping", "market", "mall",
              "entertainment", "park", "nightlife",
              "adventure", "trekking", "diving", "rafting",
              "culture", "village", "festival"
            ]
          },
          description: "Danh mục địa điểm - bắt buộc"
        },
        description: {
          bsonType: "object",
          properties: {
            vi: { 
              bsonType: "string",
              minLength: 50,
              description: "Mô tả chi tiết tiếng Việt (min 50 chars)"
            },
            en: { bsonType: "string" }
          }
        },
        features: {
          bsonType: "object",
          description: "Implicit features for MDPI algorithm",
          properties: {
            vector: {
              bsonType: "array",
              items: { bsonType: "double" },
              description: "128-dim vector from TF-IDF + Autoencoder"
            },
            keywords: {
              bsonType: "array",
              items: { bsonType: "string" },
              description: "Extracted keywords from description"
            },
            tfidf_scores: {
              bsonType: "object",
              description: "Top TF-IDF terms with scores"
            }
          }
        },
        ratings: {
          bsonType: "object",
          properties: {
            average: { 
              bsonType: "double",
              minimum: 0,
              maximum: 5
            },
            count: { bsonType: "int" },
            distribution: {
              bsonType: "object",
              properties: {
                "5": { bsonType: "int" },
                "4": { bsonType: "int" },
                "3": { bsonType: "int" },
                "2": { bsonType: "int" },
                "1": { bsonType: "int" }
              }
            }
          }
        },
        visiting_info: {
          bsonType: "object",
          required: ["avg_staying_time"],
          properties: {
            avg_staying_time: {
              bsonType: "double",
              minimum: 0.5,
              maximum: 24,
              description: "Average staying time in hours - bắt buộc"
            },
            best_time_slots: {
              bsonType: "array",
              items: {
                bsonType: "int",
                minimum: 0,
                maximum: 23
              },
              description: "Best hours to visit [6, 7, 8, 9]"
            },
            opening_hours: {
              bsonType: "object",
              properties: {
                monday: { bsonType: "string" },
                tuesday: { bsonType: "string" },
                wednesday: { bsonType: "string" },
                thursday: { bsonType: "string" },
                friday: { bsonType: "string" },
                saturday: { bsonType: "string" },
                sunday: { bsonType: "string" }
              },
              description: "e.g., '08:00-17:00' or 'closed'"
            },
            peak_season: {
              bsonType: "array",
              items: {
                enum: ["spring", "summer", "autumn", "winter"]
              }
            },
            crowd_level: {
              enum: ["low", "medium", "high"],
              description: "Typical crowd density"
            }
          }
        },
        cost: {
          bsonType: "object",
          required: ["entrance_fee"],
          properties: {
            entrance_fee: {
              bsonType: "double",
              minimum: 0,
              description: "VND - bắt buộc (0 nếu free)"
            },
            avg_meal_cost: {
              bsonType: "double",
              minimum: 0,
              description: "VND (if food POI)"
            },
            avg_shopping: {
              bsonType: "double",
              description: "VND (if shopping POI)"
            },
            parking_fee: {
              bsonType: "double",
              description: "VND"
            },
            guide_fee: {
              bsonType: "double",
              description: "VND (optional tour guide)"
            }
          }
        },
        amenities: {
          bsonType: "object",
          properties: {
            parking: { bsonType: "bool" },
            wifi: { bsonType: "bool" },
            wheelchair_accessible: { bsonType: "bool" },
            kid_friendly: { bsonType: "bool" },
            food_available: { bsonType: "bool" },
            restroom: { bsonType: "bool" },
            english_speaking_staff: { bsonType: "bool" }
          }
        },
        dietary_info: {
          bsonType: "object",
          description: "For food POIs only",
          properties: {
            cuisine_types: {
              bsonType: "array",
              items: {
                enum: [
                  "vietnamese", "northern", "central", "southern",
                  "seafood", "vegetarian", "vegan",
                  "western", "asian", "fusion",
                  "street_food", "fine_dining"
                ]
              }
            },
            allergens: {
              bsonType: "array",
              items: {
                enum: [
                  "peanuts", "tree_nuts", "seafood", "shellfish",
                  "dairy", "eggs", "gluten", "soy",
                  "fish_sauce", "msg"
                ]
              }
            },
            vegetarian_options: { bsonType: "bool" },
            vegan_options: { bsonType: "bool" },
            halal: { bsonType: "bool" },
            kosher: { bsonType: "bool" }
          }
        },
        images: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              url: { bsonType: "string" },
              caption: { bsonType: "string" },
              source: { bsonType: "string" }
            }
          }
        },
        sources: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              platform: {
                enum: ["tripadvisor", "google_places", "vietnam_travel", "manual"]
              },
              external_id: { bsonType: "string" },
              url: { bsonType: "string" },
              last_updated: { bsonType: "date" }
            }
          }
        },
        popularity_score: {
          bsonType: "double",
          minimum: 0,
          maximum: 100,
          description: "Calculated popularity (for cold start)"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for POIs
db.pois.createIndex({ location: "2dsphere" }); // Geospatial queries
db.pois.createIndex({ categories: 1 }); // Filter by category
db.pois.createIndex({ "address.province": 1 }); // Filter by province
db.pois.createIndex({ "ratings.average": -1 }); // Sort by rating
db.pois.createIndex({ popularity_score: -1 }); // Cold start
db.pois.createIndex({ "cost.entrance_fee": 1 }); // Budget filter
db.pois.createIndex({ name: "text", "description.vi": "text", "description.en": "text" }); // Text search

// ============================================================================
// COLLECTION 2: USERS
// Lưu trữ thông tin user và preference profiles
// ============================================================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "created_at"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "External user ID from main system - bắt buộc"
        },
        profile: {
          bsonType: "object",
          properties: {
            age_group: {
              enum: ["18-25", "26-35", "36-45", "46-55", "56+"]
            },
            travel_style: {
              bsonType: "array",
              items: {
                enum: ["adventure", "relaxation", "culture", "food", "shopping", "nature", "photography"]
              }
            },
            budget_level: {
              enum: ["budget", "moderate", "luxury"]
            },
            group_type: {
              enum: ["solo", "couple", "family", "friends", "business"]
            },
            has_children: { bsonType: "bool" },
            dietary_restrictions: {
              bsonType: "array",
              items: {
                enum: [
                  "vegetarian", "vegan", "halal", "kosher",
                  "no_peanuts", "no_seafood", "no_dairy", "no_gluten",
                  "no_msg", "no_fish_sauce"
                ]
              }
            },
            mobility_restrictions: { bsonType: "bool" }
          }
        },
        visit_history: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              poi_id: { bsonType: "objectId" },
              visited_at: { bsonType: "date" },
              staying_time: { bsonType: "double" }, // hours (for NMF)
              rating: { bsonType: "int", minimum: 1, maximum: 5 },
              review: { bsonType: "string" },
              cost_spent: { bsonType: "double" } // VND
            }
          },
          description: "Lịch sử đã ghé thăm POIs (for collaborative filtering)"
        },
        search_history: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              query: { bsonType: "string" },
              filters: { bsonType: "object" },
              clicked_pois: {
                bsonType: "array",
                items: { bsonType: "objectId" }
              },
              searched_at: { bsonType: "date" }
            }
          },
          description: "Lịch sử tìm kiếm (for implicit feedback)"
        },
        preferences: {
          bsonType: "object",
          description: "Learned preferences from MDPI algorithm",
          properties: {
            category_weights: {
              bsonType: "object",
              description: "{ 'nature': 0.8, 'temple': 0.3, ... }"
            },
            time_based_interest: {
              bsonType: "object",
              description: "Time-decayed interest scores from MDPI"
            },
            cluster_id: {
              bsonType: "int",
              description: "User cluster from K-Means (MDPI Stage 1)"
            },
            feature_vector: {
              bsonType: "array",
              items: { bsonType: "double" },
              description: "128-dim implicit feature vector"
            }
          }
        },
        nmf_factors: {
          bsonType: "object",
          description: "NMF decomposition for staying time prediction",
          properties: {
            user_factor: {
              bsonType: "array",
              items: { bsonType: "double" }
            },
            last_trained: { bsonType: "date" }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        last_active: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for users
db.users.createIndex({ user_id: 1 }, { unique: true });
db.users.createIndex({ "preferences.cluster_id": 1 });
db.users.createIndex({ last_active: -1 });

// ============================================================================
// COLLECTION 3: ITINERARIES
// Lưu trữ các tour plans được tạo
// ============================================================================
db.createCollection("itineraries", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "constraints", "days", "total_cost", "created_at"],
      properties: {
        user_id: {
          bsonType: "string",
          description: "Owner của itinerary - bắt buộc"
        },
        title: {
          bsonType: "string",
          description: "e.g., 'Sapa 3 Days Adventure'"
        },
        constraints: {
          bsonType: "object",
          required: ["budget", "num_days"],
          properties: {
            budget: {
              bsonType: "double",
              minimum: 0,
              description: "Total budget in VND - bắt buộc"
            },
            num_days: {
              bsonType: "int",
              minimum: 1,
              description: "Number of days - bắt buộc"
            },
            start_date: { bsonType: "date" },
            provinces: {
              bsonType: "array",
              items: { bsonType: "string" },
              description: "Target provinces ['Lào Cai', 'Hà Nội']"
            },
            must_visit_pois: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              description: "POIs user đặc biệt muốn ghé"
            },
            preferred_categories: {
              bsonType: "array",
              items: { bsonType: "string" }
            },
            avoid_categories: {
              bsonType: "array",
              items: { bsonType: "string" }
            },
            dietary_restrictions: {
              bsonType: "array",
              items: { bsonType: "string" }
            },
            max_daily_travel_time: {
              bsonType: "double",
              description: "Max hours traveling per day"
            }
          }
        },
        days: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["day_number", "pois", "daily_cost"],
            properties: {
              day_number: { bsonType: "int", minimum: 1 },
              date: { bsonType: "date" },
              accommodation: {
                bsonType: "object",
                properties: {
                  poi_id: { bsonType: "objectId" },
                  name: { bsonType: "string" },
                  cost: { bsonType: "double" },
                  address: { bsonType: "string" }
                }
              },
              pois: {
                bsonType: "array",
                minItems: 1,
                items: {
                  bsonType: "object",
                  required: ["poi_id", "order", "arrival_time"],
                  properties: {
                    poi_id: { bsonType: "objectId" },
                    order: { bsonType: "int", minimum: 1 },
                    poi_name: { bsonType: "string" },
                    categories: {
                      bsonType: "array",
                      items: { bsonType: "string" }
                    },
                    arrival_time: {
                      bsonType: "string",
                      description: "HH:MM format, e.g., '09:00'"
                    },
                    departure_time: { bsonType: "string" },
                    staying_time: {
                      bsonType: "double",
                      description: "Predicted staying time (hours) from NMF"
                    },
                    travel_time_to_next: {
                      bsonType: "double",
                      description: "Travel time to next POI (hours)"
                    },
                    travel_mode: {
                      enum: ["walk", "bike", "taxi", "bus", "car", "motorbike"]
                    },
                    costs: {
                      bsonType: "object",
                      properties: {
                        entrance: { bsonType: "double" },
                        meal: { bsonType: "double" },
                        shopping: { bsonType: "double" },
                        transport_to_next: { bsonType: "double" },
                        other: { bsonType: "double" }
                      }
                    },
                    preference_score: {
                      bsonType: "double",
                      description: "User preference score for this POI"
                    },
                    notes: { bsonType: "string" }
                  }
                }
              },
              daily_cost: {
                bsonType: "double",
                minimum: 0,
                description: "Total cost for this day"
              },
              daily_summary: {
                bsonType: "object",
                properties: {
                  total_pois: { bsonType: "int" },
                  total_travel_time: { bsonType: "double" },
                  total_staying_time: { bsonType: "double" },
                  categories_covered: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                  }
                }
              }
            }
          }
        },
        total_cost: {
          bsonType: "double",
          minimum: 0,
          description: "Sum of all daily costs - bắt buộc"
        },
        cost_breakdown: {
          bsonType: "object",
          properties: {
            accommodation: { bsonType: "double" },
            entrance_fees: { bsonType: "double" },
            meals: { bsonType: "double" },
            transport: { bsonType: "double" },
            shopping: { bsonType: "double" },
            other: { bsonType: "double" }
          }
        },
        optimization_metrics: {
          bsonType: "object",
          description: "Metrics from multi-objective optimization",
          properties: {
            preference_score: {
              bsonType: "double",
              description: "Total preference satisfaction score"
            },
            diversity_score: {
              bsonType: "double",
              description: "Category diversity score"
            },
            budget_efficiency: {
              bsonType: "double",
              description: "Value/cost ratio"
            },
            algorithm_used: {
              enum: ["genetic_algorithm", "greedy_weighted", "hybrid"]
            },
            computation_time: {
              bsonType: "double",
              description: "Seconds to generate"
            }
          }
        },
        status: {
          enum: ["draft", "confirmed", "completed", "cancelled"],
          description: "Itinerary status"
        },
        user_feedback: {
          bsonType: "object",
          properties: {
            rating: { bsonType: "int", minimum: 1, maximum: 5 },
            helpful: { bsonType: "bool" },
            comments: { bsonType: "string" },
            followed: { bsonType: "bool" },
            modified: { bsonType: "bool" }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for itineraries
db.itineraries.createIndex({ user_id: 1 });
db.itineraries.createIndex({ status: 1 });
db.itineraries.createIndex({ created_at: -1 });
db.itineraries.createIndex({ "constraints.budget": 1 });
db.itineraries.createIndex({ "constraints.provinces": 1 });

// ============================================================================
// COLLECTION 4: USER_POI_INTERACTIONS
// Tracking implicit feedback for collaborative filtering
// ============================================================================
db.createCollection("user_poi_interactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "poi_id", "interaction_type", "timestamp"],
      properties: {
        user_id: { bsonType: "string" },
        poi_id: { bsonType: "objectId" },
        interaction_type: {
          enum: ["view", "click", "save", "share", "visit", "rate"]
        },
        interaction_value: {
          bsonType: "double",
          description: "Weight for implicit feedback (view=1, click=2, save=3, etc.)"
        },
        context: {
          bsonType: "object",
          properties: {
            session_id: { bsonType: "string" },
            device: { bsonType: "string" },
            duration_seconds: { bsonType: "int" }
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

// Create indexes
db.user_poi_interactions.createIndex({ user_id: 1, timestamp: -1 });
db.user_poi_interactions.createIndex({ poi_id: 1, timestamp: -1 });
db.user_poi_interactions.createIndex({ interaction_type: 1 });

// ============================================================================
// COLLECTION 5: ALGORITHM_MODELS
// Store trained ML models metadata and parameters
// ============================================================================
db.createCollection("algorithm_models", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["model_type", "version", "trained_at"],
      properties: {
        model_type: {
          enum: [
            "kmeans_user_clustering",
            "nmf_staying_time",
            "tfidf_poi_features",
            "autoencoder_poi_features",
            "genetic_algorithm_params"
          ]
        },
        version: { bsonType: "string" },
        parameters: {
          bsonType: "object",
          description: "Model hyperparameters"
        },
        performance_metrics: {
          bsonType: "object",
          description: "Evaluation metrics (accuracy, precision, recall, etc.)"
        },
        training_data_stats: {
          bsonType: "object",
          properties: {
            num_users: { bsonType: "int" },
            num_pois: { bsonType: "int" },
            num_interactions: { bsonType: "int" }
          }
        },
        model_file_path: {
          bsonType: "string",
          description: "Path to serialized model file"
        },
        trained_at: { bsonType: "date" },
        is_active: { bsonType: "bool" }
      }
    }
  }
});

db.algorithm_models.createIndex({ model_type: 1, version: -1 });
db.algorithm_models.createIndex({ is_active: 1 });

// ============================================================================
// COLLECTION 6: SYSTEM_LOGS
// Track algorithm performance and errors
// ============================================================================
db.createCollection("system_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["log_type", "timestamp"],
      properties: {
        log_type: {
          enum: ["recommendation", "optimization", "error", "performance"]
        },
        user_id: { bsonType: "string" },
        action: { bsonType: "string" },
        details: { bsonType: "object" },
        error_message: { bsonType: "string" },
        execution_time_ms: { bsonType: "double" },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

db.system_logs.createIndex({ log_type: 1, timestamp: -1 });
db.system_logs.createIndex({ user_id: 1, timestamp: -1 });

// ============================================================================
// INITIAL DATA SEEDING EXAMPLES
// ============================================================================

// Example POI: Hồ Hoàn Kiếm
db.pois.insertOne({
  name: "Hồ Hoàn Kiếm",
  name_en: "Hoan Kiem Lake",
  location: {
    type: "Point",
    coordinates: [105.8526, 21.0285] // [longitude, latitude]
  },
  address: {
    province: "Hà Nội",
    district: "Hoàn Kiếm",
    ward: "Hàng Trống",
    street: "Đường Lê Thái Tổ",
    full_address: "Đường Lê Thái Tổ, Hàng Trống, Hoàn Kiếm, Hà Nội"
  },
  categories: ["nature", "lake", "historical", "culture"],
  description: {
    vi: "Hồ Hoàn Kiếm là biểu tượng văn hóa của Hà Nội, nơi lưu giữ truyền thuyết thanh gươm báu của vua Lê Lợi. Hồ có diện tích khoảng 12 hecta, xung quanh là không gian đi bộ rộng rãi, cây xanh mát mẻ, là điểm dừng chân lý tưởng cho du khách trong lòng Thủ đô. Từ sáng sớm đến tối muộn, nơi đây luôn tấp nập người dân tập thể dục, giới trẻ vui chơi và du khách tham quan.",
    en: "Hoan Kiem Lake is a cultural symbol of Hanoi, preserving the legend of King Le Loi's sacred sword. The lake covers about 12 hectares, surrounded by spacious walking areas and cool green trees, making it an ideal stop for tourists in the heart of the capital."
  },
  features: {
    keywords: ["hồ", "hoàn kiếm", "văn hóa", "lịch sử", "hà nội", "đi bộ", "cây xanh", "vua lê lợi"]
    // vector and tfidf_scores will be computed during data processing
  },
  ratings: {
    average: 4.6,
    count: 15234,
    distribution: {
      "5": 9140,
      "4": 4572,
      "3": 1015,
      "2": 305,
      "1": 202
    }
  },
  visiting_info: {
    avg_staying_time: 1.5,
    best_time_slots: [6, 7, 17, 18, 19, 20],
    opening_hours: {
      monday: "00:00-23:59",
      tuesday: "00:00-23:59",
      wednesday: "00:00-23:59",
      thursday: "00:00-23:59",
      friday: "00:00-23:59",
      saturday: "00:00-23:59",
      sunday: "00:00-23:59"
    },
    peak_season: ["spring", "autumn"],
    crowd_level: "high"
  },
  cost: {
    entrance_fee: 0,
    avg_meal_cost: 80000,
    parking_fee: 15000
  },
  amenities: {
    parking: true,
    wifi: false,
    wheelchair_accessible: true,
    kid_friendly: true,
    food_available: true,
    restroom: true,
    english_speaking_staff: false
  },
  images: [
    {
      url: "https://example.com/hoan-kiem-1.jpg",
      caption: "Hồ Hoàn Kiếm và Tháp Rùa",
      source: "vietnam_travel"
    }
  ],
  sources: [
    {
      platform: "google_places",
      external_id: "ChIJ...",
      url: "https://maps.google.com/...",
      last_updated: new Date()
    }
  ],
  popularity_score: 95.5,
  created_at: new Date(),
  updated_at: new Date()
});

print("✅ MongoDB Schema Created Successfully!");
print("📊 Collections: pois, users, itineraries, user_poi_interactions, algorithm_models, system_logs");
print("🔍 Indexes: Geospatial, text search, category filters ready");
print("🎯 Next: Setup data crawler to populate POIs collection");
