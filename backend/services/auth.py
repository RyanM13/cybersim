from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Claude: How do I began authentication
SECRET_KEY = os.getenv("SECRET_KEY", "FALLBACK")
ALGORITHM = "HS256"
TOKEN_EXPIRATION = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password):
    hashed = pwd_context.hash(password)
    return hashed


def check_password(password, hashed):
    return pwd_context.verify(password, hashed)


# Claude: How do I handle the JWT token creation
def create_token(username):
    expire = datetime.now() + timedelta(minutes=TOKEN_EXPIRATION)
    data = {"sub": username, "exp": expire}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


def get_username_from_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return username
    except JWTError:
        return None
