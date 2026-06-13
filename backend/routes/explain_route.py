from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import gemini_service

router = APIRouter()

class ExplainRequest(BaseModel):
    route_data: dict

@router.post("/explain-route")
def explain_route(request: ExplainRequest):
    try:
        explanation = gemini_service.explain_route(request.route_data)
        return {
            "explanation": explanation,
            "using_mock": not gemini_service.active
        }
    except Exception as e:
        print(f"Error in explain-route: {e}")
        # Fallback explanation
        score = request.route_data.get('safety_score', 80)
        if score >= 80:
            explanation = "This route is recommended because it has excellent lighting, high foot traffic, more CCTV coverage and lower incident reports."
        elif score >=50:
            explanation = "This route is moderate in safety. It has decent lighting, but be cautious in some areas with slightly lower foot traffic."
        else:
            explanation = "We recommend choosing another route if possible. This route has low lighting in some sections and fewer people around."
        return {
            "explanation": explanation,
            "using_mock": True
        }
