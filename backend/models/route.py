from sqlalchemy import Column, Integer, String, Float
from database.db import Base

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    destination = Column(String)
    distance = Column(Float)
    eta = Column(Integer)
    safety_score = Column(Integer)
