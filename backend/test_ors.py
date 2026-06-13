
import requests
import os
from dotenv import load_dotenv

load_dotenv()
ORS_API_KEY = os.getenv("OPENROUTESERVICE_API_KEY")
ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car"

url = f"{ORS_URL}?api_key={ORS_API_KEY}"
headers = {
    "Accept": "application/geo+json;charset=UTF-8",
    "Content-Type": "application/json"
}
body = {
    "coordinates": [
        [77.3055178, 28.6483176],
        [77.2290549, 28.6668141]
    ],
    "alternative_routes": {
        "target_count": 3,
        "weight_factor": 1.4,
        "share_factor": 0.6
    }
}

print("Testing ORS API with body:", body)
response = requests.post(url, json=body, headers=headers, timeout=30)
print("Response Status Code:", response.status_code)
print("Response Headers:", dict(response.headers))
print("Response Text:", response.text)
