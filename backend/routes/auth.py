from fastapi import APIRouter, Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User
from schemas import UserSignup, UserLogin
from services.auth import hash_password, check_password, create_token


router = APIRouter(prefix="/auth")


# Claude: How do I began writing the routes for this auth system
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Username not found")

    if not check_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_token(db_user.username)
    return {"access_token": token}


@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=402, detail="Username already exists")

    hashed = hash_password(user.password)

    new_user = User(username=user.username, password=hashed)
    db.add(new_user)
    db.commit()

    return {"message": "Account created succesfully"}
