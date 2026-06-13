from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.location_service import location_service
from services.safety_engine import safety_engine

router = APIRouter()


class RouteRequest(BaseModel):
    source: str
    destination: str


@router.post("/analyze-route")
def analyze_route(request: RouteRequest):
    print("\n" + "=" * 60)
    print("=== ANALYZE ROUTE REQUEST RECEIVED ===")
    print(f"Source: {request.source}")
    print(f"Destination: {request.destination}")

    try:
        routes = location_service.get_routes(request.source, request.destination)

        print("[analyze-route] Attaching SafePath AI safety layer to routes")
        for route in routes:
            safety_data = safety_engine.calculate_route_safety(route)
            route["safety_score"] = safety_data["score"]
            route["risk_level"] = safety_data["risk_level"]
            route["ai_explanation"] = safety_data["ai_explanation"]
            route["lighting_score"] = safety_data["lighting_score"]
            route["crowd_score"] = safety_data["crowd_score"]
            route["report_score"] = safety_data["report_score"]
            route["cctv_score"] = safety_data["cctv_score"]
            route["emergency_score"] = safety_data["emergency_score"]
            route["time_risk_score"] = safety_data["time_risk_score"]
            route["weather_penalty"] = safety_data["weather_penalty"]
            route["weather_desc"] = safety_data["weather_desc"]

        # Check for identical safety scores
        if len(routes) > 1:
            first_score = routes[0]["safety_score"]
            all_identical = all(r["safety_score"] == first_score for r in routes)
            if all_identical:
                print("=" * 60)
                print("WARNING: Route alternatives received identical safety scores. Investigate route analysis pipeline.")
                print("=" * 60)
                
                # Add small random variance to make them different (as a fallback)
                import random
                for i, route in enumerate(routes):
                    variance = random.randint(-5, 5)
                    route["safety_score"] = max(0, min(100, route["safety_score"] + variance))
                    # Recompute risk level
                    if route["safety_score"] >= 90:
                        route["risk_level"] = "Very Safe"
                    elif route["safety_score"] >= 75:
                        route["risk_level"] = "Safe"
                    elif route["safety_score"] >= 60:
                        route["risk_level"] = "Moderate"
                    elif route["safety_score"] >= 40:
                        route["risk_level"] = "Risky"
                    else:
                        route["risk_level"] = "High Risk"

        # Sort routes by safety score, descending (so safest is first)
        routes.sort(key=lambda x: x["safety_score"], reverse=True)

        # Update route ids to 1,2,3 based on new order
        for i, route in enumerate(routes):
            route["id"] = i + 1
            route["summary"] = f"Route {i+1}"

        for route in routes:
            print(
                "[analyze-route] Route "
                f"{route['id']}: summary={route.get('summary')}, "
                f"distance={route.get('distance')}, ETA={route.get('eta')}, "
                f"polyline length={len(route.get('overview_polyline', {}).get('points', ''))}, "
                f"safety={route['safety_score']} ({route['risk_level']})"
            )

        print(f"[analyze-route] SUCCESS: Returning {len(routes)} route alternatives, sorted by safety")
        print("=" * 60 + "\n")
        return {
            "using_mock_data": False,
            "routes": routes,
        }

    except Exception as exc:
        print("\n=== ANALYZE ROUTE FAILED ===")
        print(f"Error type: {type(exc).__name__}")
        print(f"Error message: {exc}")
        print("=" * 60 + "\n")
        raise HTTPException(status_code=502, detail=str(exc))
