
import requests
import polyline
import os

print("=== LOCATION SERVICE INITIALIZATION ===")


class LocationService:
    def __init__(self):
        self.ors_api_key = os.getenv("OPENROUTESERVICE_API_KEY")
        self.nominatim_url = "https://nominatim.openstreetmap.org/search"
        # Changed from foot-walking to driving-car as per user request!
        self.ors_url = "https://api.openrouteservice.org/v2/directions/driving-car"
        print("[LocationService] Using OpenStreetMap Nominatim for geocoding")
        print(f"[LocationService] OpenRouteService API key loaded: {'Yes' if self.ors_api_key else 'No'}")
        # Caches
        self.geocode_cache = {}
        self.route_cache = {}

    def autocomplete_address(self, query):
        print(f"\n[LocationService] Autocomplete query: {query}")
        params = {
            "q": query,
            "format": "jsonv2",
            "limit": 5,
            "addressdetails": 1,
            "featuretype": "settlement,poi,highway"
        }
        headers = {
            "User-Agent": "SafePath AI/1.0 (https://github.com/safepath-ai)"
        }
        response = requests.get(self.nominatim_url, params=params, headers=headers, timeout=30)
        print(f"[LocationService] Autocomplete HTTP status: {response.status_code}")
        response.raise_for_status()
        data = response.json()
        suggestions = []
        for result in data:
            suggestions.append({
                "name": result.get("name", result.get("display_name", query)),
                "address": result.get("display_name", query),
                "lat": float(result["lat"]),
                "lng": float(result["lon"])
            })
        print(f"[LocationService] Found {len(suggestions)} suggestions")
        return suggestions

    def geocode_address(self, address):
        if address in self.geocode_cache:
            print(f"[LocationService] Using cached geocode for: {address}")
            return self.geocode_cache[address]
        
        print(f"\n[LocationService] Geocoding: {address}")
        
        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 1,
            "addressdetails": 1
        }
        
        headers = {
            "User-Agent": "SafePath AI/1.0 (https://github.com/safepath-ai)"
        }
        
        response = requests.get(self.nominatim_url, params=params, headers=headers, timeout=30)
        print(f"[LocationService] Geocoding HTTP status: {response.status_code}")
        response.raise_for_status()
        
        data = response.json()
        if not data:
            raise RuntimeError(f"No geocoding result for '{address}'")
        
        result = data[0]
        geocoded = {
            "address": result.get("display_name", address),
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
            "place_id": result.get("place_id")
        }
        
        self.geocode_cache[address] = geocoded
        print(
            "[LocationService] Geocoded coordinates: "
            f"{address} -> lat={geocoded['latitude']}, lng={geocoded['longitude']}, "
            f"address={geocoded['address']}"
        )
        return geocoded

    def get_routes(self, source, destination):
        print("\n=== LOCATION SERVICE: get_routes STARTED ===")
        print(f"[LocationService] Source input: {source}")
        print(f"[LocationService] Destination input: {destination}")

        source_geocode = self.geocode_address(source)
        dest_geocode = self.geocode_address(destination)

        if self.ors_api_key:
            routes = self._get_ors_routes(source_geocode, dest_geocode)
        else:
            print("[LocationService] No OpenRouteService API key, but let's try the public ORS endpoint without a key? Wait, no, ORS requires a key. So fallback.")
            routes = self._get_fallback_routes(source_geocode, dest_geocode)

        print("=== LOCATION SERVICE: get_routes FINISHED ===\n")
        return routes

    def _get_ors_routes(self, source_geocode, dest_geocode):
        print("[LocationService] Using OpenRouteService for routing (driving-car)")
        
        # Check cache
        cache_key = f"{source_geocode['latitude']},{source_geocode['longitude']}|{dest_geocode['latitude']},{dest_geocode['longitude']}"
        if cache_key in self.route_cache:
            print("[LocationService] Using cached routes")
            return self.route_cache[cache_key]
        
        url = f"{self.ors_url}?api_key={self.ors_api_key}"
        headers = {
            "Accept": "application/geo+json;charset=UTF-8",
            "Content-Type": "application/json"
        }
        body = {
            "coordinates": [
                [source_geocode["longitude"], source_geocode["latitude"]],
                [dest_geocode["longitude"], dest_geocode["latitude"]]
            ],
            "alternative_routes": {
                "target_count": 3,
                "weight_factor": 1.4,
                "share_factor": 0.6
            }
        }
        
        try:
            response = requests.post(url, json=body, headers=headers, timeout=30)
            print(f"[LocationService] ORS HTTP status: {response.status_code}")
            response.raise_for_status()
            
            data = response.json()
            print("[LocationService] ORS Response keys:", list(data.keys()))
            if "routes" not in data or not data["routes"]:
                print("[LocationService] No routes in ORS response, falling back")
                raise RuntimeError("No routes returned from OpenRouteService")
        except Exception as e:
            print(f"[LocationService] Error getting ORS routes: {e}")
            return self._get_fallback_routes(source_geocode, dest_geocode)

        routes = []
        for idx, route_data in enumerate(data["routes"]):
            summary = route_data["segments"][0]
            # ORS provides geometry as a polyline string directly!
            polyline_str = route_data["geometry"]
            # Decode ORS polyline to get coordinates for bounds
            coordinates_decoded = polyline.decode(polyline_str)
            # ORS decode gives (lat, lon), so convert to [lon, lat] for bounds calculations
            coordinates_converted = [[lon, lat] for lat, lon in coordinates_decoded]
            
            # Validate route thoroughly
            ors_distance_meters = summary["distance"]
            ors_duration_seconds = summary["duration"]
            coordinates_decoded = polyline.decode(polyline_str)
            has_segments = len(summary.get("steps", [])) > 0
            
            is_valid = (
                ors_distance_meters > 0 and
                ors_duration_seconds > 0 and
                polyline_str and
                len(coordinates_decoded) > 1 and
                has_segments
            )
            
            if not is_valid:
                print(f"[LocationService] Invalid route {idx + 1}: distance={ors_distance_meters}m, duration={ors_duration_seconds}s, polyline={len(polyline_str) > 0}, coords={len(coordinates_decoded)}, steps={has_segments}")
                continue
            
            # Get major roads from steps
            major_roads = list({step.get("name", "") for step in summary.get("steps", []) if step.get("name", "")})
            
            # Convert to Google-like format for compatibility
            route = {
                "id": idx + 1,
                "summary": f"Route {idx + 1}",
                "copyrights": "© OpenStreetMap contributors, © OpenRouteService",
                "warnings": [],
                "waypoint_order": [],
                "bounds": {
                    "northeast": {
                        "lat": max(coord[1] for coord in coordinates_converted),
                        "lng": max(coord[0] for coord in coordinates_converted)
                    },
                    "southwest": {
                        "lat": min(coord[1] for coord in coordinates_converted),
                        "lng": min(coord[0] for coord in coordinates_converted)
                    }
                },
                "overview_polyline": {"points": polyline_str},
                "legs": [{
                    "distance": ors_distance_meters,
                    "duration": ors_duration_seconds,
                    "start_address": source_geocode["address"],
                    "end_address": dest_geocode["address"]
                }],
                "steps": self._convert_ors_steps(summary.get("steps", []), coordinates_converted),
                "distance": self._format_distance(ors_distance_meters),
                "distance_meters": ors_distance_meters,
                "duration": ors_duration_seconds,
                "eta": self._format_duration(ors_duration_seconds),
                "eta_seconds": ors_duration_seconds,
                "start_address": source_geocode["address"],
                "end_address": dest_geocode["address"],
                "source": source_geocode["address"],
                "destination": dest_geocode["address"],
                "source_coords": {
                    "lat": source_geocode["latitude"],
                    "lng": source_geocode["longitude"]
                },
                "destination_coords": {
                    "lat": dest_geocode["latitude"],
                    "lng": dest_geocode["longitude"]
                },
                "major_roads": major_roads
            }
            routes.append(route)
            
            # Debug logging
            print(f"\n[DEBUG] Route {idx + 1} Details:")
            print(f"[DEBUG]   Route Start: {source_geocode['address']}")
            print(f"[DEBUG]   Route End: {dest_geocode['address']}")
            print(f"[DEBUG]   ORS Distance: {ors_distance_meters} meters")
            print(f"[DEBUG]   ORS Duration: {ors_duration_seconds} seconds")
            print(f"[DEBUG]   Displayed Distance: {route['distance']}")
            print(f"[DEBUG]   Displayed Duration: {route['eta']}")
            print(f"[DEBUG]   Number of Segments: {len(summary.get('steps', []))}")
            print(f"[DEBUG]   Major Roads: {major_roads}")

        # Cache routes
        self.route_cache[cache_key] = routes
        return routes

    def _get_fallback_routes(self, source_geocode, dest_geocode):
        print("[LocationService] Creating fallback route (no external routing API, but let's at least get approximate distance)")
        
        # Calculate approximate distance (Haversine)
        distance_m = self._haversine_distance(
            source_geocode["latitude"], source_geocode["longitude"],
            dest_geocode["latitude"], dest_geocode["longitude"]
        )
        approx_duration = distance_m / 13.4  # Average driving speed ~13.4 m/s (48 km/h)
        
        # Create a simple polyline between source and destination (only as a last resort)
        coords = [
            (source_geocode["latitude"], source_geocode["longitude"]),
            (dest_geocode["latitude"], dest_geocode["longitude"])
        ]
        encoded_polyline = polyline.encode(coords)

        return [
            {
                "id": 1,
                "summary": "Direct Route",
                "copyrights": "© OpenStreetMap contributors",
                "warnings": [],
                "waypoint_order": [],
                "bounds": {
                    "northeast": {
                        "lat": max(source_geocode["latitude"], dest_geocode["latitude"]),
                        "lng": max(source_geocode["longitude"], dest_geocode["longitude"])
                    },
                    "southwest": {
                        "lat": min(source_geocode["latitude"], dest_geocode["latitude"]),
                        "lng": min(source_geocode["longitude"], dest_geocode["longitude"])
                    }
                },
                "overview_polyline": {"points": encoded_polyline},
                "legs": [{
                    "distance": distance_m,
                    "duration": approx_duration,
                    "start_address": source_geocode["address"],
                    "end_address": dest_geocode["address"]
                }],
                "steps": [
                    {
                        "instruction": "Head towards your destination",
                        "html_instruction": "Head towards your destination",
                        "distance": {"text": self._format_distance(distance_m), "value": distance_m},
                        "duration": {"text": self._format_duration(approx_duration), "value": approx_duration},
                        "maneuver": "straight",
                        "start_location": {"lat": source_geocode["latitude"], "lng": source_geocode["longitude"]},
                        "end_location": {"lat": dest_geocode["latitude"], "lng": dest_geocode["longitude"]}
                    }
                ],
                "distance": self._format_distance(distance_m),
                "distance_meters": distance_m,
                "duration": approx_duration,
                "eta": self._format_duration(approx_duration),
                "eta_seconds": approx_duration,
                "start_address": source_geocode["address"],
                "end_address": dest_geocode["address"],
                "source": source_geocode["address"],
                "destination": dest_geocode["address"],
                "source_coords": {
                    "lat": source_geocode["latitude"],
                    "lng": source_geocode["longitude"]
                },
                "destination_coords": {
                    "lat": dest_geocode["latitude"],
                    "lng": dest_geocode["longitude"]
                }
            }
        ]

    def _convert_ors_steps(self, ors_steps, coordinates):
        steps = []
        for ors_step in ors_steps:
            # Get the start and end coordinates for this step
            start_idx = ors_step.get("way_points", [0, 0])[0]
            end_idx = ors_step.get("way_points", [0, len(coordinates) - 1])[1]
            
            start_coord = coordinates[start_idx] if start_idx < len(coordinates) else coordinates[0]
            end_coord = coordinates[end_idx] if end_idx < len(coordinates) else coordinates[-1]

            steps.append({
                "instruction": ors_step.get("instruction", ""),
                "html_instruction": ors_step.get("instruction", ""),
                "distance": {
                    "text": self._format_distance(ors_step.get("distance", 0)),
                    "value": ors_step.get("distance", 0)
                },
                "duration": {
                    "text": self._format_duration(ors_step.get("duration", 0)),
                    "value": ors_step.get("duration", 0)
                },
                "maneuver": ors_step.get("type", "straight"),
                "start_location": {
                    "lat": start_coord[1],
                    "lng": start_coord[0]
                },
                "end_location": {
                    "lat": end_coord[1],
                    "lng": end_coord[0]
                }
            })
        return steps

    @staticmethod
    def _format_distance(meters):
        if meters < 1000:
            return f"{int(meters)} m"
        return f"{meters / 1000:.1f} km"

    @staticmethod
    def _format_duration(seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        
        if hours > 0:
            return f"{hours} hr {minutes} min"
        return f"{minutes} min"

    @staticmethod
    def _haversine_distance(lat1, lon1, lat2, lon2):
        import math
        R = 6371000  # Earth radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c


location_service = LocationService()
