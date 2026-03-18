from services.scenario import Scenario
from fastapi import APIRouter, Depends
from schemas import DefendRequest 
scenario = Scenario()  # create one instance to share across routes
router = APIRouter(prefix="/scenario")

@router.get("/start")
def start_scenario():
      ip = scenario.generate_attacker_ip()
      return {"attacker_ip": ip}

@router.get("/log")
def start_logs():
      return scenario.generate_logs()

@router.post("/defend")
def end_scenario(request: DefendRequest):
      if scenario.check_ip(request.ip):
          return {"result": "Correct"}
      else:
          return {"result": "Wrong"}
