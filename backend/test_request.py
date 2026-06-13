import requests

print("\n=== TESTING SAFEPATH API ===")

url = "http://localhost:8000/analyze-route"

payload = {
    "source": "Delhi University",
    "destination": "Connaught Place"
}

print(f"Sending POST request to {url}")
print(f"Payload: {payload}")

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"\nResponse status code: {response.status_code}")
    print(f"Response JSON:\n{response.json()}")
except Exception as e:
    print(f"\nERROR sending request: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
