
from dotenv import load_dotenv
load_dotenv()
from services.location_service import location_service

print("Testing LocationService directly!")
routes = location_service.get_routes("Karkarduma", "Kashmere Gate")
print(f"\nGot {len(routes)} routes!")
for i, route in enumerate(routes):
    print(f"\nRoute {i+1}:")
    print(f"  - Distance: {route.get('distance')}")
    print(f"  - ETA: {route.get('eta')}")
    print(f"  - Distance meters: {route.get('distance_meters')}")
    print(f"  - Duration seconds: {route.get('eta_seconds')}")
    if 'overview_polyline' in route:
        print(f"  - Polyline length: {len(route['overview_polyline']['points'])}")
