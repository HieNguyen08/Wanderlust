"""Test Foursquare API connection and quota"""
import requests
from config import CLIENT_ID, CLIENT_SECRET, API_VERSION, API_BASE_URL

# Test search in Hanoi with v2 API
params = {
    "ll": "21.0285,105.8542",  # Hanoi
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "v": API_VERSION,
    "radius": 5000,
    "limit": 10
}

print("Testing Foursquare API v2...")
print(f"Endpoint: {API_BASE_URL}/venues/search")
print(f"Location: Hanoi (21.0285, 105.8542)")
print(f"Client ID: {CLIENT_ID[:10]}...{CLIENT_ID[-10:]}")
print("-" * 60)

response = requests.get(
    f"{API_BASE_URL}/venues/search",
    params=params,
    timeout=30
)

print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    meta = data.get("meta", {})
    venues = data.get("response", {}).get("venues", [])
    
    print(f"✅ API working! Found {len(venues)} venues")
    print(f"Request ID: {meta.get('requestId')}")
    
    print("\nSample venues:")
    for i, venue in enumerate(venues[:5], 1):
        categories = [c['name'] for c in venue.get('categories', [])]
        location = venue.get('location', {})
        print(f"\n{i}. {venue.get('name')}")
        print(f"   Categories: {', '.join(categories)}")
        print(f"   Address: {location.get('address', 'N/A')}")
        print(f"   Distance: {location.get('distance', 0)}m")
        print(f"   FSQ ID: {venue.get('id')}")
    
    print("\n" + "="*60)
    print("✅ API test successful! Ready to collect data.")
    print("="*60)

elif response.status_code == 401:
    print("❌ Authentication failed! Check credentials.")
    print(response.text)
elif response.status_code == 429:
    print("❌ Rate limit exceeded!")
elif response.status_code == 403:
    print("❌ Access forbidden! Check API permissions.")
    print(response.text)
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text[:500])
