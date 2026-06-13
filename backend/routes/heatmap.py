from fastapi import APIRouter
from services.heatmap_service import get_heatmap_zones

router = APIRouter()

@router.get("/heatmap")
def heatmap_endpoint():
    zones = get_heatmap_zones()
    return {"zones": zones}
