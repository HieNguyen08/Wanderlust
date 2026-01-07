"""Test with OAuth2 flow (if string is client_secret)"""
import requests

# If the string is client_secret, we need client_id too
# But first, test if this is an old v2 API format

CLIENT_SECRET = "3TDGQPKEG1RBEPRA1ZLE1JZ4V25ALY32H4JLLDOICMMD3AX2"

# Try v2 API format (legacy)
print("Testing Foursquare API v2 format...")
print("-" * 60)

url = "https://api.foursquare.com/v2/venues/search"
params = {
    "ll": "21.0285,105.8542",  # Hanoi
    "client_secret": CLIENT_SECRET,
    "v": "20230101",  # Version date
    "limit": 10
}

response = requests.get(url, params=params)
print(f"V2 API Status: {response.status_code}")

if response.status_code == 200:
    print("✅ V2 API works! This is a client_secret for v2 API")
    data = response.json()
    venues = data.get("response", {}).get("venues", [])
    print(f"Found {len(venues)} venues\n")
    for v in venues[:3]:
        print(f"- {v['name']}")
elif response.status_code == 400:
    error = response.json()
    print(f"❌ V2 API Error: {error}")
    print("\nThis credential needs a CLIENT_ID to work.")
    print("Check your Foursquare app for both CLIENT_ID and CLIENT_SECRET")
else:
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
