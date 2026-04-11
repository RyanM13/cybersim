from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Claude: How do I began authentication
# Source: https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it

# Secret key and algorithm are used for the JWT. The algorithm takes
# the secret and the payload to create a unique signature
SECRET_KEY = os.getenv("SECRET_KEY", "FALLBACK")
ALGORITHM = "HS256"
TOKEN_EXPIRATION = 30



# Configures bcrypt for password hashing and verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Accepts the password and returns the newly hashed password
def hash_password(password):
    hashed = pwd_context.hash(password)
    return hashed

# Accepts the user password and compares it with the hashed to verify

def check_password(password, hashed):
    return pwd_context.verify(password, hashed)


# Claude: How do I handle the JWT token creation
#
# Accepts username, sets the token expiration, runs the encryption and returns the token
def create_token(username):
    expire = datetime.now() + timedelta(minutes=TOKEN_EXPIRATION)
    data = {"sub": username, "exp": expire}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


# Accepts token decodes the token and returns valid token for user
def get_username_from_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return username
    except JWTError:
        return None
