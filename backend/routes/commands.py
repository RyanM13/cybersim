from fastapi import APIRouter, Depends
from schemas import Command
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Commands


# Setting prefix for routes
router = APIRouter(prefix="/commands")


# Setting router for command endpoint
@router.post("/command")
# Recieves command and db, queries the database for commands and returns output
def CommandReception(command: Command, db: Session = Depends(get_db)):
    db_command = db.query(Commands).filter(Commands.command == command.command).first()
    if not db_command:
        return {"output": f"command not found: {command.command}"}
    return {"output": db_command.output}

