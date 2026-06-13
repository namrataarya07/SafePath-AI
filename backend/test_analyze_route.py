
import requests
import json

print("=" * 80)
print("=== TEST: Backend /analyze-route ===")
print("=" * 80)

url = "http://localhost:8000/analyze-route"
headers = {"Content-Type": "application/json"}
payload = {
    "source": "Connaught Place, New Delhi",
    "destination": "India Gate, New Delhi"
}

print(f"\n1. Request Body:")
print(json.dumps(payload, indent=2))

try:
    response = requests.post(url, json=payload, headers=headers, timeout=60)
    print(f"\n2. Response Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n3. Final JSON Response:")
        print(json.dumps(data, indent=2))
        print(f"\n4. Number of routes returned: {len(data.get('routes', []))}")
        for i, route in enumerate(data.get('routes', [])):
            print(f"\n   --- Route {i+1} ---")
            print(f"   safety_score: {route.get('safety_score')}")
            print(f"   distance: {route.get('distance')}")
            print(f"   eta: {route.get('eta')}")
    else:
        print(f"\nError response: {response.text}")
except Exception as e:
    print(f"\nTest failed: {e}")
