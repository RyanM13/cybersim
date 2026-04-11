from pydantic import BaseModel


# This class tells python what it is getting from the database
class UserSignup(BaseModel):
    username: str
    password: str


# This tells python what to expect from the database
class UserLogin(BaseModel):
    username: str
    password: str


# This tells python what to expect from the database
class Command(BaseModel):
    command: str


# Claude: What am I missing
# This tells python what to expect from the database
class DefendRequest(BaseModel):
    ip: str



# This tells python what to expect from the database
class Logs(BaseModel):
    log: str
