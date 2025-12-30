import requests
import json

# Try to get the access token from the db or just try public access first
# Since it's IsAuthenticatedOrReadOnly, GET /api/knowledge-base/ should work publicly

url = "http://127.0.0.1:8000/api/knowledge-base/"
try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Content Type: {response.headers.get('Content-Type')}")
    try:
        print(f"Data: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Raw: {response.text[:500]}")
except Exception as e:
    print(f"Request failed: {e}")
