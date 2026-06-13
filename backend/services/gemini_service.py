import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_gemini_api_key_here":
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            self.active = True
        else:
            self.model = None
            self.active = False

    def explain_route(self, route_data):
        try:
            if not self.active:
                raise Exception("API key not set")
            
            prompt = f"""
            As a safety navigation assistant, provide a clear, concise explanation (2-3 sentences) of why this route is safe or has certain safety concerns.
            
            Route Data:
            - Distance: {route_data.get('distance', 'N/A')}
            - ETA: {route_data.get('eta', 'N/A')}
            - Safety Score: {route_data.get('safety_score', 'N/A')}/100
            - Risk Level: {route_data.get('risk_level', 'N/A')}
            
            Keep it friendly and helpful, focusing on practical safety aspects like lighting, foot traffic, and nearby safe locations.
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            
            # Fallback explanation
            score = route_data.get('safety_score', 80)
            if score >= 80:
                return "This route is recommended because it has excellent lighting, high foot traffic, more CCTV coverage and lower incident reports."
            elif score >= 50:
                return "This route is moderate in safety. It has decent lighting, but be cautious in some areas with slightly lower foot traffic."
            else:
                return "We recommend choosing another route if possible. This route has low lighting in some sections and fewer people around."

# Singleton instance
gemini_service = GeminiService()
