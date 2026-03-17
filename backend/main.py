from fastapi import FastAPI
from routes import auth
from fastapi.middleware.cors import CORSMiddleware
from routes import commands
from routes import scenario


app = FastAPI()

app.include_router(auth.router)
app.include_router(commands.router)
app.include_router(scenario.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
