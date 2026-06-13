from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    location: str
    latitude: float
    longitude: float
    category: str
    description: str

class ReportResponse(ReportCreate):
    id: int
    timestamp: datetime
