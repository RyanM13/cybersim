from sqlalchemy import Column, Integer, String
from database.db import Base


# Created user model to follow for inserting into the database 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


# Created commands model to follow for recieving from the database
class Commands(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    command = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    output = Column(String, nullable=False)
