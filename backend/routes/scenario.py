from services.scenario import Scenario
from fastapi import APIRouter, Depends, WebSocket
from schemas import DefendRequest
import asyncio

scenario = Scenario()  # create one instance to share across routes
router = APIRouter(prefix="/scenario")


@router.get("/start")
def start_scenario():
    ip = scenario.generate_attacker_ip()
    return {"attacker_ip": ip}


@router.websocket("/logs")
async def get_logs(websocket: WebSocket):
    await websocket.accept()
    while True:
        log = scenario.generate_logs()
        await websocket.send_text(log)
        await asyncio.sleep(2)


@router.post("/defend")
def end_scenario(request: DefendRequest):
    if scenario.check_ip(request.ip):
        return {"result": "Correct"}
    else:
        return {"result": "Wrong"}
