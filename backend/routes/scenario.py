from services.scenario import Scenario
from fastapi import APIRouter, Depends, WebSocket
from schemas import DefendRequest, CommandRequest
import asyncio

scenario = Scenario()  # create one instance to share across routes
router = APIRouter(prefix="/scenario")


@router.get("/start")
# Generates random attacker ip and sends it to the frontend
def start_scenario():
    subnet = scenario.generate_attacker_ip()
    return {"attacker_subnet": subnet}


@router.websocket("/logs")
async def get_logs(websocket: WebSocket):
    await websocket.accept()
    while True:
        log = scenario.generate_logs()
        await websocket.send_text(log)
        await asyncio.sleep(2)


@router.post("/command")
def handle_command(request: CommandRequest):
    cmd = request.command.lower()

    if cmd == "netstat":
        return {"output": scenario.netstat(), "result": "continue"}

    elif cmd == "ufw limit ssh":
        return {"output": scenario.ufw_limit_ssh(), "result": "continue"}

    elif cmd.startswith("ufw deny from"):
        ip = cmd.replace("ufw deny from", "").strip()

        output = scenario.ufw_deny(ip)

        if scenario.check_ip(ip):
            return {"output": output, "result": "win"}
        else:
            return {"output": output, "result": "continue"}

    else:
        return {"output": f"command not found: {cmd}", "result": "continue"}
