from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.report import Report
from schemas.report_schema import ReportCreate
from datetime import datetime

router = APIRouter()

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    sample_reports = [
        {
            "id": 1,
            "location": "Downtown",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "category": "Poor Lighting",
            "description": "The street lights on Main St are out.",
            "timestamp": datetime.utcnow().isoformat()
        },
        {
            "id": 2,
            "location": "Times Square",
            "latitude": 40.7580,
            "longitude": -73.9855,
            "category": "Suspicious Activity",
            "description": "Saw someone loitering near the subway entrance.",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]
    return {"reports": sample_reports}

@router.post("/report")
def create_report(request: ReportCreate, db: Session = Depends(get_db)):
    new_report = Report(
        location=request.location,
        latitude=request.latitude,
        longitude=request.longitude,
        category=request.category,
        description=request.description
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"message": "Report submitted successfully", "report": new_report}
