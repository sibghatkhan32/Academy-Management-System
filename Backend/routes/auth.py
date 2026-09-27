from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Admin
from schemas import CreateAdmin, AdminResponse, LoginRequest

from security import hash_password, verify_password
from auth import create_access_token

from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


# -------------------------
# Register Admin
# -------------------------

@router.post("/register", response_model=AdminResponse)
def register_admin(
    admin: CreateAdmin,
    db: Session = Depends(get_db)
):

    existing_admin = (
        db.query(Admin)
        .filter(Admin.username == admin.username)
        .first()
    )


    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )


    hashed_password = hash_password(
        admin.password
    )

    new_admin = Admin(

        username=admin.username,

        email=admin.email,

        password_hash=hashed_password,

        role="admin"

    )


    db.add(new_admin)

    db.commit()

    db.refresh(new_admin)


    return new_admin



# -------------------------
# Login Admin
# -------------------------

@router.post("/login")
def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    admin = (
        db.query(Admin)
        .filter(Admin.username == form_data.username)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        form_data.password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        {
            "sub": admin.username,
            "role": admin.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }