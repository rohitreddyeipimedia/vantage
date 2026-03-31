from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    subscription_tier: str

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=req.email,
        name=req.name,
        password_hash=get_password_hash(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name, "subscription_tier": user.subscription_tier}}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name, "subscription_tier": user.subscription_tier}}

@router.get("/me")
def me(db: Session = Depends(get_db), token: str = Depends(lambda: None)):
    # Handled via middleware in main.py
    pass
