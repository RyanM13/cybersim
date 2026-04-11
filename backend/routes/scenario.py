from services.scenario import Scenario
from fastapi import APIRouter, Depends, WebSocket
from schemas import DefendRequest
import asyncio

scenario = Scenario()  # create one instance to share across routes
router = APIRouter(prefix="/scenario")


@router.get("/start")
# Generates random attacker ip and sends it to the frontend
def start_scenario():
    subnet = scenario.generate_attacker_ip()
    return {"attacker_subnet": subnet}


# Setting router for defend endpoint
@router.post("/defend")
# Checks for correct answer from user and either ends scenario or continues
def end_scenario(request: DefendRequest):
    if scenario.check_ip(request.ip):
        return {"result": "win"}
    else:
        return {"result": "wrong"}


@router.websocket("/logs")
async def get_logs(websocket: WebSocket):
    await websocket.accept()
    while True:
        log = scenario.generate_logs()
        await websocket.send_text(log)
        await asyncio.sleep(2)
