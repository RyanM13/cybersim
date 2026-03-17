from fastapi import APIRouter, Depends
import random
from schemas import DefendRequest
from services.scenario import check_ip, generate_attacker_ip, generate_logs

router = APIRouter(prefix="/scenario")


@router.get("/start")
def start_scenario():
    ip = generate_attacker_ip()
    return {"attacker_ip": ip}


@router.get("/log")
def start_logs():
    return generate_logs()


@router.post("/defend")
def end_scenario(request: DefendRequest):
    if check_ip(request.ip):
        return {"result": "Correct"}
    else:
        return {"result": "Wrong"}
