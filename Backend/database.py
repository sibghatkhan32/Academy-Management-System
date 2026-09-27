from pathlib import Path
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


# =========================
# DATABASE LOCATION
# =========================

if getattr(sys, "frozen", False):
    # When running the packaged .exe
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    # When running normally with Python
    BASE_DIR = Path(__file__).resolve().parent


DATABASE_PATH = BASE_DIR / "academy.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


# =========================
# DATABASE ENGINE
# =========================

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


# =========================
# SESSION
# =========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# =========================
# BASE
# =========================

class Base(DeclarativeBase):
    pass


# =========================
# DATABASE DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()