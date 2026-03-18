from services.scenario import Scenario
from fastapi import APIRouter, Depends
from schemas import DefendRequest 

# create one instance to share across routes
scenario = Scenario()  
router = APIRouter(prefix="/scenario")

# Setting router for start endpoint 
@router.get("/start")
# Generates random attacker ip and sends it to the frontend
def start_scenario():
      ip = scenario.generate_attacker_ip()
      return {"attacker_ip": ip}

# setting router for log endpoint
@router.get("/log")
# Stars the log generation and sends it to the frontend
def start_logs():
      return scenario.generate_logs()

# Setting router for defend endpoint
@router.post("/defend")
# Checks for correct answer from user and either ends scenario or continues
def end_scenario(request: DefendRequest):
      if scenario.check_ip(request.ip):
          return {"result": "Correct"}
      else:
          return {"result": "Wrong"}
