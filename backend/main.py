from fastapi import FastAPI
from routes import auth
from fastapi.middleware.cors import CORSMiddleware
from routes import commands
from routes import scenario


# Creating fastapi app for main driver
app = FastAPI()

# Routes to access from frontend
app.include_router(auth.router)
app.include_router(commands.router)
app.include_router(scenario.router)

# Enviroment varibles 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
