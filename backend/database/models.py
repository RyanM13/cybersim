from sqlalchemy import Column, Integer, String
from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


class Commands(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    command = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    output = Column(String, nullable=False)
