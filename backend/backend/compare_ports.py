import requests
import json

ports = [8000, 8001]
endpoints = ["/api/knowledge-base/", "/api/canned-responses/"]

for port in ports:
    print(f"\n--- Testing Port {port} ---")
    for ep in endpoints:
        url = f"http://127.0.0.1:{port}{ep}"
        try:
            r = requests.get(url, timeout=5)
            print(f"GET {ep}: {r.status_code}")
            if r.status_code == 500:
                print(f"   500 Error: Look at backend console or error_debug.html")
            elif r.status_code == 200:
                data = r.json()
                count = len(data) if isinstance(data, list) else data.get('count', 'N/A')
                print(f"   Success! Items: {count}")
            else:
                print(f"   Other Status: {r.status_code}")
        except Exception as e:
            print(f"   Failed to reach {url}: {e}")
