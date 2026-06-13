
import requests

print("Testing Karkarduma → Kashmere Gate route...")

response = requests.post(
    "http://localhost:8000/analyze-route",
    json={
        "source": "Karkarduma",
        "destination": "Kashmere Gate"
    }
)

print(f"Response status code: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Got {len(data.get('routes', []))} routes!")
    for i, route in enumerate(data.get('routes', [])):
        print(f"\nRoute {i+1}:")
        print(f"  - Distance: {route.get('distance')}")
        print(f"  - ETA: {route.get('eta')}")
        print(f"  - Safety Score: {route.get('safety_score')}")
        print(f"  - Risk Level: {route.get('risk_level')}")
        print(f"  - AI Explanation: {route.get('ai_explanation')[:100]}...")
        if 'overview_polyline' in route:
            print(f"  - Polyline length: {len(route['overview_polyline']['points'])}")
else:
    print("Error:", response.text)
