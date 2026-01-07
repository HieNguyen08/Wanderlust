# Foursquare Data Collection - Phase 1

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure MongoDB (localhost:27017)

3. API Key already configured in `config.py`

## Run Collection

```bash
python collector.py
```

## API Quota

- **Free tier:** 10,000 requests/month
- **Per request:** ~50 venues
- **Total capacity:** ~500,000 venues
- **Coverage:** 114 regions across 14 countries

## Data Quality

Foursquare provides:
- ✅ Real-time validation (closed_bucket field)
- ✅ Verified venues (business owner confirmed)
- ✅ Rich metadata (ratings, photos, hours)
- ✅ High accuracy for Asia-Pacific region

## Output

- Database: `wanderlust_ai.pois`
- Log: `foursquare_collection.log`
- Stats: `collection_stats.json`

## Schema

Each POI includes:
- Name, coordinates, address
- Categories (auto-mapped)
- Ratings, popularity
- Opening hours, price level
- Photos, website, contact info
- **Verification status** (verified by owner)
- **Business status** (open/closed/likely closed)
- Source: Foursquare FSQ ID + URL
