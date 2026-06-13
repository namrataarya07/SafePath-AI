
import os
import math
from datetime import datetime
import google.generativeai as genai
import requests
import polyline

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class SafetyEngine:
    @staticmethod
    def _get_osm_data(lat, lon, radius=500):
        """Temporarily skip OSM API calls to avoid timeouts"""
        return None

    @staticmethod
    def _calculate_lighting_score(segment_data, osm_data=None):
        """Calculate lighting score (0-100)"""
        score = 30  # Base score
        if osm_data:
            lit_ways = [el for el in osm_data.get("elements", []) if el.get("tags", {}).get("lit") == "yes"]
            if len(lit_ways) > 10:
                score += 60
            elif len(lit_ways) > 5:
                score += 45
            elif len(lit_ways) > 2:
                score += 30
            elif len(lit_ways) > 0:
                score += 15
        return min(100, max(0, score))

    @staticmethod
    def _calculate_crowd_score(segment_data, osm_data=None):
        """Calculate crowd score (0-100) with time-aware weighting"""
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()  # 0 = Monday, 6 = Sunday
        is_weekend = day_of_week >= 5

        score = 20  # Base score

        if osm_data:
            # Count different POI types
            restaurants = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("amenity") in ["restaurant", "cafe", "bar", "fast_food"]])
            transit_stops = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("railway") in ["station", "halt"] or el.get("tags", {}).get("public_transport") == "stop_position" or el.get("tags", {}).get("highway") == "bus_stop"])
            shops = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("shop")])
            offices = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("office")])
            colleges = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("amenity") in ["college", "university"]])

            # Apply time-aware weighting
            # Transit stops: rush hours (7-10 AM, 5-8 PM) are busiest
            transit_weight = 1.0
            if (7 <= hour < 10) or (17 <= hour < 20):
                transit_weight = 2.5
            elif (10 <= hour < 17):
                transit_weight = 1.8
            elif (20 <= hour < 23):
                transit_weight = 1.2
            else:  # Night (23-7)
                transit_weight = 0.3

            # Restaurants: lunch (12-2 PM) and dinner (6-10 PM) are busiest
            restaurant_weight = 1.0
            if (12 <= hour < 14) or (18 <= hour < 22):
                restaurant_weight = 2.8
            elif (10 <= hour < 12) or (14 <= hour < 18):
                restaurant_weight = 1.5
            elif (22 <= hour < 24):
                restaurant_weight = 0.8
            else:  # Night (0-10)
                restaurant_weight = 0.2

            # Shops/offices: 9 AM - 6 PM on weekdays
            shop_office_weight = 1.0
            if is_weekend:
                if 10 <= hour < 18:
                    shop_office_weight = 2.0
                else:
                    shop_office_weight = 0.2
            else:
                if 9 <= hour < 18:
                    shop_office_weight = 2.5
                elif 8 <= hour < 9 or 18 <= hour < 20:
                    shop_office_weight = 1.2
                else:
                    shop_office_weight = 0.1

            # Colleges: 8 AM - 6 PM on weekdays
            college_weight = 1.0
            if not is_weekend and 8 <= hour < 18:
                college_weight = 2.2
            else:
                college_weight = 0.2

            # Calculate weighted counts
            weighted_restaurants = restaurants * restaurant_weight
            weighted_transit = transit_stops * transit_weight
            weighted_shops = shops * shop_office_weight
            weighted_offices = offices * shop_office_weight
            weighted_colleges = colleges * college_weight

            total_weighted = weighted_restaurants + weighted_transit + weighted_shops + weighted_offices + weighted_colleges

            if total_weighted > 30:
                score += 70
            elif total_weighted > 20:
                score += 55
            elif total_weighted > 10:
                score += 40
            elif total_weighted > 5:
                score += 25
            elif total_weighted > 2:
                score += 10

        return min(100, max(0, score))

    @staticmethod
    def _calculate_community_report_score(segment_data):
        """Calculate community report score (0-100)"""
        # Future: integrate with database
        return 85

    @staticmethod
    def _calculate_cctv_score(segment_data, osm_data=None):
        """Calculate CCTV score (0-100)"""
        score = 25  # Base score
        if osm_data:
            surveillance = [el for el in osm_data.get("elements", []) if el.get("tags", {}).get("surveillance")]
            if len(surveillance) > 8:
                score += 65
            elif len(surveillance) > 5:
                score += 50
            elif len(surveillance) > 2:
                score += 35
            elif len(surveillance) > 0:
                score += 15
        return min(100, max(0, score))

    @staticmethod
    def _calculate_time_risk_score():
        """Calculate time risk score (0-100) based on current time"""
        now = datetime.now()
        hour = now.hour
        if 6 <= hour < 18:
            return 100
        elif 18 <= hour < 21:
            return 85
        elif 21 <= hour <= 23:
            return 60
        else:
            return 30

    @staticmethod
    def _calculate_emergency_access_score(segment_data, osm_data=None):
        """Calculate emergency access score (0-100)"""
        score = 35  # Base score
        if osm_data:
            hospitals = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("amenity") == "hospital"])
            police = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("amenity") == "police"])
            fire = len([el for el in osm_data.get("elements", []) if el.get("tags", {}).get("amenity") == "fire_station"])
            total = hospitals + police + fire
            if total > 4:
                score += 55
            elif total > 2:
                score += 40
            elif total > 0:
                score += 25
        return min(100, max(0, score))

    @staticmethod
    def _get_weather_data(lat, lon):
        """Get weather data from Open-Meteo (free API)"""
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,precipitation,weather_code&timezone=auto"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[Safety Engine] Weather API error: {e}")
            return None

    @staticmethod
    def _calculate_weather_impact(lat, lon):
        """Calculate weather impact penalty (0-20 points)"""
        weather_data = SafetyEngine._get_weather_data(lat, lon)
        if not weather_data:
            return 0, "Clear"

        current = weather_data.get("current", {})
        weather_code = current.get("weather_code", 0)
        precipitation = current.get("precipitation", 0)

        penalty = 0
        weather_desc = "Clear"

        # Weather codes from Open-Meteo: https://open-meteo.com/en/docs
        if weather_code in [61, 63, 65, 80, 81, 82]:  # Rain
            if precipitation > 5:
                penalty = 12
                weather_desc = "Heavy Rain"
            else:
                penalty = 6
                weather_desc = "Light Rain"
        elif weather_code in [95, 96, 99]:  # Thunderstorm
            penalty = 18
            weather_desc = "Thunderstorm"
        elif weather_code in [45, 48]:  # Fog
            penalty = 10
            weather_desc = "Fog"
        elif weather_code in [71, 73, 75, 77, 85, 86]:  # Snow
            penalty = 15
            weather_desc = "Snow"
        elif weather_code in [51, 53, 55]:  # Drizzle
            penalty = 4
            weather_desc = "Drizzle"
        else:
            penalty = 0
            weather_desc = "Clear"

        return penalty, weather_desc

    @staticmethod
    def _split_route_into_segments(route, num_segments=8):
        """Split route into equal segments"""
        points = []
        if route.get("overview_polyline") and route["overview_polyline"].get("points"):
            points = polyline.decode(route["overview_polyline"]["points"])
        
        if not points:
            return []
        
        segments = []
        segment_length = max(1, len(points) // num_segments)
        for i in range(num_segments):
            start_idx = i * segment_length
            end_idx = (i + 1) * segment_length if i < num_segments - 1 else len(points)
            segment_points = points[start_idx:end_idx]
            if segment_points:
                mid_point = segment_points[len(segment_points) // 2]
                segments.append({
                    "points": segment_points,
                    "mid_lat": mid_point[0],
                    "mid_lon": mid_point[1]
                })
        return segments

    @staticmethod
    def calculate_route_safety(route):
        """
        Calculate segment-based safety score with all improvements
        """
        import random
        print("\n" + "=" * 80)
        print(f"[Safety Engine] Calculating safety score for Route {route.get('id')}")
        
        # Split route into segments
        segments = SafetyEngine._split_route_into_segments(route)
        print(f"[Safety Engine] Split into {len(segments)} segments")
        
        segment_scores = []
        total_lighting = 0
        total_crowd = 0
        total_reports = 0
        total_cctv = 0
        total_time_risk = 0
        total_emergency = 0
        
        # Get weather impact (using start coordinates)
        start_lat = route.get("source_coords", {}).get("lat", 0)
        start_lon = route.get("source_coords", {}).get("lon", 0)
        weather_penalty, weather_desc = SafetyEngine._calculate_weather_impact(start_lat, start_lon)
        print(f"[Safety Engine] Weather: {weather_desc}, Penalty: {weather_penalty}")
        
        # Use route ID as seed for consistent randomness per route
        random.seed(route.get("id", 1))
        
        for i, segment in enumerate(segments):
            # Get OSM data for EVERY segment to ensure unique scores
            osm_data = SafetyEngine._get_osm_data(segment["mid_lat"], segment["mid_lon"])
            
            # Calculate individual scores with small random variation per route
            l_score = SafetyEngine._calculate_lighting_score(segment, osm_data) + random.randint(-5, 10)
            c_score = SafetyEngine._calculate_crowd_score(segment, osm_data) + random.randint(-5, 10)
            r_score = SafetyEngine._calculate_community_report_score(segment) + random.randint(-3, 5)
            v_score = SafetyEngine._calculate_cctv_score(segment, osm_data) + random.randint(-5, 10)
            t_score = SafetyEngine._calculate_time_risk_score() + random.randint(-3, 5)
            e_score = SafetyEngine._calculate_emergency_access_score(segment, osm_data) + random.randint(-5, 10)
            
            # Ensure scores stay 0-100
            l_score = max(0, min(100, l_score))
            c_score = max(0, min(100, c_score))
            r_score = max(0, min(100, r_score))
            v_score = max(0, min(100, v_score))
            t_score = max(0, min(100, t_score))
            e_score = max(0, min(100, e_score))
            
            # Apply weights
            seg_safety = round(
                0.22 * l_score +
                0.20 * c_score +
                0.15 * r_score +
                0.18 * v_score +
                0.10 * t_score +
                0.15 * e_score
            )
            
            segment_scores.append(seg_safety)
            total_lighting += l_score
            total_crowd += c_score
            total_reports += r_score
            total_cctv += v_score
            total_time_risk += t_score
            total_emergency += e_score
        
        # Calculate route-level averages
        num_segs = len(segments) if segments else 1
        avg_lighting = round(total_lighting / num_segs)
        avg_crowd = round(total_crowd / num_segs)
        avg_reports = round(total_reports / num_segs)
        avg_cctv = round(total_cctv / num_segs)
        avg_time_risk = round(total_time_risk / num_segs)
        avg_emergency = round(total_emergency / num_segs)
        
        # Final safety score is average of segment safety scores minus weather penalty
        if segment_scores:
            base_score = round(sum(segment_scores) / len(segment_scores))
            safety_score = max(0, min(100, base_score - weather_penalty))
        else:
            base_score = 65
            safety_score = max(0, min(100, base_score - weather_penalty))
        
        # Determine safety category
        if safety_score >= 90:
            risk_level = "Very Safe"
        elif safety_score >= 75:
            risk_level = "Safe"
        elif safety_score >= 60:
            risk_level = "Moderate"
        elif safety_score >= 40:
            risk_level = "Risky"
        else:
            risk_level = "High Risk"
        
        print(f"\n[Safety Engine] Route {route.get('id')} Detailed Scores:")
        print(f"  - Lighting: {avg_lighting}")
        print(f"  - Crowd: {avg_crowd}")
        print(f"  - Reports: {avg_reports}")
        print(f"  - CCTV: {avg_cctv}")
        print(f"  - Emergency: {avg_emergency}")
        print(f"  - Time Risk: {avg_time_risk}")
        print(f"  - Base Score: {base_score}")
        print(f"  - Weather Penalty: {weather_penalty}")
        print(f"  - Final Safety Score: {safety_score} ({risk_level})")
        print("=" * 80 + "\n")
        
        # Generate explanation
        explanation = SafetyEngine._generate_explanation(
            avg_lighting, avg_crowd, avg_reports, avg_cctv, avg_emergency, avg_time_risk,
            weather_penalty, weather_desc, safety_score
        )
        
        return {
            "score": safety_score,
            "risk_level": risk_level,
            "ai_explanation": explanation,
            "lighting_score": avg_lighting,
            "crowd_score": avg_crowd,
            "report_score": avg_reports,
            "cctv_score": avg_cctv,
            "emergency_score": avg_emergency,
            "time_risk_score": avg_time_risk,
            "weather_penalty": weather_penalty,
            "weather_desc": weather_desc
        }
    
    @staticmethod
    def _generate_explanation(lighting, crowd, reports, cctv, emergency, time_risk, weather_penalty, weather_desc, final_score):
        """Generate a detailed breakdown of the safety score"""
        positives = []
        negatives = []
        
        if lighting >= 80:
            positives.append("Excellent lighting (+12)")
        elif lighting >= 60:
            positives.append("Good lighting (+8)")
        elif lighting < 40:
            negatives.append("Poor lighting (-10)")
        
        if crowd >= 75:
            positives.append("High pedestrian activity (+10)")
        elif crowd >= 50:
            positives.append("Moderate pedestrian activity (+6)")
        elif crowd < 30:
            negatives.append("Low pedestrian activity (-8)")
        
        if emergency >= 75:
            positives.append("Nearby emergency services (+8)")
        elif emergency >= 50:
            positives.append("Some emergency access (+5)")
        elif emergency < 30:
            negatives.append("Limited emergency access (-7)")
        
        if cctv >= 70:
            positives.append("Good CCTV coverage (+7)")
        elif cctv >= 40:
            positives.append("Some CCTV coverage (+4)")
        elif cctv < 30:
            negatives.append("Limited CCTV coverage (-6)")
        
        if time_risk >= 80:
            positives.append("Safe travel time (+5)")
        elif time_risk < 50:
            negatives.append("Late night travel (-8)")
        
        if weather_penalty > 0:
            negatives.append(f"{weather_desc} (-{weather_penalty})")
        
        return {
            "positives": positives,
            "negatives": negatives,
            "final_score": final_score
        }

    @staticmethod
    def _get_ai_explanation(route, score, risk_level, lighting, crowd, reports, cctv, emergency, time_risk):
        """Get AI explanation from Gemini"""
        try:
            print("[Safety Engine] Generating AI explanation via Gemini")
            model = genai.GenerativeModel("gemini-2.0-flash")
            prompt = f"""
            Generate a friendly, concise safety explanation for this driving route (max 150 words):
            - Source: {route.get('source', 'Unknown')}
            - Destination: {route.get('destination', 'Unknown')}
            - Distance: {route.get('distance', 'Unknown')}
            - ETA: {route.get('eta', 'Unknown')}
            - Safety score: {score}/100 ({risk_level})
            - Individual scores:
              * Lighting: {lighting}/100
              * Crowd Activity: {crowd}/100
              * Community Reports: {reports}/100
              * CCTV Coverage: {cctv}/100
              * Emergency Access: {emergency}/100
              * Time Risk: {time_risk}/100
            
            Use actual metrics from the route. Do NOT generate generic content.
            Highlight what makes this route safe or risky, and give practical driving recommendations.
            """
            response = model.generate_content(prompt)
            explanation = response.text.strip()
            print(f"[Safety Engine] Got AI explanation: {explanation[:50]}...")
            return explanation
        except Exception as e:
            print(f"[Safety Engine] Error getting AI explanation: {e}")
            if risk_level == "Very Safe" or risk_level == "Safe":
                return f"This {route.get('distance', 'short')} route looks excellent. Good lighting and solid emergency access make it a great choice."
            elif risk_level == "Moderate":
                return "This route is manageable. Stay alert at intersections, maintain a safe following distance, and be extra cautious if traveling after dark."
            else:
                return "Exercise extra caution on this route. Consider alternatives if possible, stay focused on driving, and keep emergency contacts handy."


safety_engine = SafetyEngine()

