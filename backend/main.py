# backend/main.py

from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from the frontend (adjust port if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request data model
class SimulationInput(BaseModel):
    angle: float  # in degrees
    velocity: float  # in m/s
    gravity: float = 9.81  # default m/s²

@app.post("/simulate")
def simulate_projectile(input: SimulationInput):
    angle_rad = np.radians(input.angle)
    vx = input.velocity * np.cos(angle_rad)
    vy = input.velocity * np.sin(angle_rad)

    t_flight = 2 * vy / input.gravity
    t_vals = np.linspace(0, t_flight, num=100)

    trajectory = [
        {"x": float(vx * t), "y": float(vy * t - 0.5 * input.gravity * t**2)}
        for t in t_vals
    ]

    return {"trajectory": trajectory}
