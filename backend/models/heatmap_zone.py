from sqlalchemy import Column, Integer, String, Float
from database.db import Base

class HeatmapZone(Base):
    __tablename__ = "heatmap_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    risk_level = Column(String)
    safety_score = Column(Integer)
