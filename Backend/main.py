from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import Base, engine
from routes import admin, student, auth
from models import Admin, Student, Fees
from fastapi.middleware.cors import CORSMiddleware

import sys


# =========================
# PATHS
# =========================

if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys._MEIPASS)
    FRONTEND_DIR = BASE_DIR / "Frontend" / "dist"
else:
    BASE_DIR = Path(__file__).resolve().parent
    FRONTEND_DIR = BASE_DIR.parent / "Frontend" / "dist"


# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title="Academy Management System",
    description="API for managing students, fees and courses",
    version="1.0.0"
)


# =========================
# DATABASE
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# API ROUTES
# =========================

app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)

app.include_router(
    student.router,
    prefix="/student",
    tags=["Student"]
)

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REACT FRONTEND
# =========================

app.mount(
    "/assets",
    StaticFiles(
        directory=FRONTEND_DIR / "assets"
    ),
    name="assets"
)


@app.get("/")
def serve_frontend():
    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


# React Router fallback
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(
        FRONTEND_DIR / "index.html"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)