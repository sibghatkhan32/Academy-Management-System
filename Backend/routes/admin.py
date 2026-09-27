from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Admin
from schemas import CreateAdmin, AdminResponse

router = APIRouter()

# @router.post("/admin", response_model=AdminResponse)
# def create_admin(admin : CreateAdmin, db:Session=Depends(get_db)):
#     existing_admin = db.query(Admin).filter(Admin.username == admin.username).first()

#     if existing_admin:
#         raise HTTPException(status_code=400, detail="Username already exists")
    
#     new_admin = Admin(username = admin.username, email = admin.email)

#     db.add(new_admin)
#     db.commit()
#     db.refresh(new_admin)

#     return new_admin

@router.get("/admin", response_model=list[AdminResponse])
def get_admin(db: Session=Depends(get_db)):
    return db.query(Admin).all()



