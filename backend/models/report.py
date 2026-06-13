from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database.db import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    category = Column(String)
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
