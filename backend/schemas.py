from pydantic import BaseModel


# This class tells python what it is getting from the database
class UserSignup(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Command(BaseModel):
    command: str


# Claude: What am I missing
class DefendRequest(BaseModel):
    ip: str


class Logs(BaseModel):
    log: str
