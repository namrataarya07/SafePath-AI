from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.location_service import location_service

router = APIRouter()

@router.get("/autocomplete")
async def autocomplete(query: str):
    if len(query) < 2:
        return {"suggestions": []}
    
    try:
        suggestions = location_service.autocomplete_address(query)
        return {"suggestions": suggestions}
    except Exception as e:
        print(f"[Autocomplete] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class GeocodeRequest(BaseModel):
    address: str

@router.post("/geocode")
async def geocode(req: GeocodeRequest):
    try:
        result = location_service.geocode_address(req.address)
        return {
            "name": req.address,
            "lat": result["latitude"],
            "lng": result["longitude"],
            "address": result["address"]
        }
    except Exception as e:
        print(f"[Geocode] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
