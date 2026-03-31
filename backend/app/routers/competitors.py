from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.models.brand import Brand
from app.models.competitor import Competitor
from app.models.ad import Ad
from app.routers.deps import get_current_user
from app.models.user import User
from app.services.meta_sync import sync_competitor_ads

router = APIRouter(prefix="/api/brands", tags=["competitors"])

class CompetitorCreate(BaseModel):
    name: str
    website: Optional[str] = None
    facebook_page_id: Optional[str] = None
    instagram_handle: Optional[str] = None
    google_advertiser_id: Optional[str] = None

@router.get("/{brand_id}/competitors")
def list_competitors(brand_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return [{
        "id": c.id, "name": c.name, "website": c.website,
        "facebook_page_id": c.facebook_page_id, "instagram_handle": c.instagram_handle,
        "last_synced_at": c.last_synced_at, "created_at": c.created_at,
        "ad_count": db.query(Ad).filter(Ad.competitor_id == c.id).count()
    } for c in brand.competitors]

@router.post("/{brand_id}/competitors")
def add_competitor(brand_id: str, req: CompetitorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    competitor = Competitor(
        brand_id=brand_id, name=req.name, website=req.website,
        facebook_page_id=req.facebook_page_id, instagram_handle=req.instagram_handle,
        google_advertiser_id=req.google_advertiser_id
    )
    db.add(competitor)
    db.commit()
    db.refresh(competitor)
    return {"id": competitor.id, "name": competitor.name, "website": competitor.website}

@router.delete("/{brand_id}/competitors/{competitor_id}")
def remove_competitor(brand_id: str, competitor_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.user_id == current_user.id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    competitor = db.query(Competitor).filter(Competitor.id == competitor_id, Competitor.brand_id == brand_id).first()
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")
    db.delete(competitor)
    db.commit()
    return {"success": True}

@router.post("/{brand_id}/competitors/{competitor_id}/sync")
def trigger_sync(brand_id: str, competitor_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    competitor = db.query(Competitor).filter(Competitor.id == competitor_id).first()
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")
    background_tasks.add_task(sync_competitor_ads, competitor_id)
    return {"success": True, "message": "Sync started in background"}
