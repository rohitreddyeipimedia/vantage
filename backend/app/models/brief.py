from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class WeeklyBrief(Base):
    __tablename__ = "weekly_briefs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_id = Column(String, ForeignKey("brands.id"), nullable=False)
    week_start = Column(DateTime(timezone=True), nullable=False)
    week_end = Column(DateTime(timezone=True), nullable=False)
    content = Column(Text, nullable=False)  # Full markdown brief
    key_insights = Column(JSON, default=list)  # Array of insight strings
    recommendations = Column(JSON, default=list)  # Array of recommendation strings
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    brand = relationship("Brand", back_populates="briefs")
