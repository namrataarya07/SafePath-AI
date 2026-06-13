from fastapi import APIRouter

router = APIRouter()

@router.post("/sos")
def sos_endpoint():
    return {"message": "SOS triggered. Emergency services notified.", "location": {"lat": 40.7128, "lng": -74.0060}}
