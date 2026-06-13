
import requests

overpass_url = "https://overpass.kumi.systems/api/interpreter"
query = """
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:500,28.6483176,77.3055178);
);
out body;
"""

print("Testing Overpass API GET request...")
headers = {"Accept": "application/json"}
response = requests.get(overpass_url, params={"data": query}, headers=headers, timeout=30)
print("Status code:", response.status_code)
print("Response text:", response.text)
