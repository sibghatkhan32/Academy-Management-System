from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from enum import Enum
from datetime import date
from decimal import Decimal
from typing import Optional, List, Literal

class LoginRequest(BaseModel):
    username: str
    password: str

class CreateAdmin(BaseModel):
    email : EmailStr
    username : str = Field(min_length=3, max_length=30)
    password : str

    model_config = ConfigDict(from_attributes=True)

class AdminResponse(BaseModel):
    id : int
    email : EmailStr
    username : str

    model_config = ConfigDict(from_attributes=True)

class Gender(str,Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class CreateStudent(BaseModel):
    firstname : str = Field(min_length=3,max_length=30)
    lastname : str = Field(min_length=3, max_length=30)
    caste : str #new-------------------------
    parName : str = Field(min_length=3, max_length=30)
    adress : str
    BirthDate : date
    religion : str #new ------------------------
    std_cnic : str = Field(pattern=r"^\d{13}$") 
    gender : Gender 
    contact : str = Field(pattern=r"^\d{11}$")
    whatsappNo : str = Field(pattern=r"^\d{11}$" ) #new------------------- 
    IdMark : str #new -------------------------------------- 

    guardianName : str #new----------------------
    RelationshipStud : str
    par_cnic : str = Field(pattern=r"^\d{13}$")
    occupation : str #new--------------------------
    parContact : str = Field(pattern=r"^\d{11}$")

    qualDegree1 : Optional[str] = None #new------------------------------
    Board1 : Optional[str] = None #new------------------------------
    grade1 : Optional[str] = None #new------------------------------
    year1 : Optional[date] = None #new------------------------------
    subject1 : Optional[str] = None #new------------------------------
    qualDegree2 : Optional[str] = None #new------------------------------
    Board2 : Optional[str] = None #new------------------------------
    grade2 : Optional[str] = None #new------------------------------
    year2 : Optional[date] = None #new------------------------------
    subject2 : Optional[str] = None #new------------------------------
    qualDegree3 : Optional[str] = None #new------------------------------
    Board3 : Optional[str] = None #new------------------------------
    grade3 : Optional[str] = None #new------------------------------
    year3 : Optional[date] = None #new------------------------------
    subject3 : Optional[str] = None #new------------------------------


    std_id : str #this id will be given manually
    program : str
    admission_date : date #new------------------------------
    Session : str #new------------------------------
    AdmissionFees : Decimal #new------------------------------
    Balance : Decimal #new------------------------------

    email : Optional[EmailStr] = None
    parEmail : Optional[EmailStr] = None

class StudentResponse(BaseModel):
    firstname : str 
    lastname : str 
    caste : str
    parName : str 
    adress : str
    BirthDate : date
    religion : str 
    std_cnic : str 
    gender : Gender 
    contact : str 
    whatsappNo : str
    IdMark : str
    
    guardianName : str 
    RelationshipStud : str
    par_cnic : str 
    occupation : str 
    parContact : str
    
    qualDegree1 : Optional[str] = None
    Board1 : Optional[str] = None
    grade1 : Optional[str] = None 
    year1 : Optional[date] = None
    subject1 : Optional[str] = None 
    qualDegree2 : Optional[str] = None 
    Board2 : Optional[str] = None
    grade2 : Optional[str] = None 
    year2 : Optional[date] = None 
    subject2 : Optional[str] = None 
    qualDegree3 : Optional[str] = None 
    Board3 : Optional[str] = None 
    grade3 : Optional[str] = None
    year3 : Optional[date] = None 
    subject3 : Optional[str] = None
    
    
    std_id : str
    program : str
    admission_date : date 
    Session : str 
    AdmissionFees : Decimal
    Balance : Decimal
    
    email : Optional[EmailStr] = None
    parEmail : Optional[EmailStr] = None

    model_config = ConfigDict(from_attributes=True)

class Addfees(BaseModel):
    PaidAmount : Decimal
    RemainingAmount : Decimal
    duemonth : date
    admission_fee : Decimal
    exam_fee : Decimal

class feesResponse(BaseModel):
    id:int
    PaidAmount : Decimal
    RemainingAmount : Decimal
    duemonth : date
    student_name : str
    student_id : str
    admission_fee : Optional[Decimal] = None
    exam_fee : Optional[Decimal] = None
    payment_date : date

class attend(str,Enum):
    Present = "Present"
    Absent = "Absent"
    Leave = "Leave"

class MarkAttendance(BaseModel):
    status : attend
    attendance_date : date

class BulkMarkAttendance(BaseModel):
    attendance_date : date
    records : List[MarkAttendance]

class attendanceResponse(BaseModel):
    id : int
    status : attend
    student_name : str
    student_id : str
    attendance_date : date

    model_config = ConfigDict(from_attributes=True)    

# ---- 2. UPDATE MODEL (Sirf PATCH ke liye - Sab Optional hai) 
class StudentUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[EmailStr] = None
    BirthDate: Optional[date] = None
    adress: Optional[str] = None
    contact: Optional[str] = None
    parName: Optional[str] = None
    RelationshipStud: Optional[str] = None
    parContact: Optional[str] = None
    parEmail: Optional[EmailStr] = None
    program: Optional[str] = None
    gender: Optional[Gender] = None  # Or Optional[str] depending on your config
    std_cnic: Optional[str] = None
    par_cnic: Optional[str] = None

    # Remaining fields added from StudentResponse
    caste: Optional[str] = None
    religion: Optional[str] = None
    whatsappNo: Optional[str] = None
    IdMark: Optional[str] = None
    
    guardianName: Optional[str] = None
    occupation: Optional[str] = None
    
    qualDegree1: Optional[str] = None
    Board1: Optional[str] = None
    grade1: Optional[str] = None 
    year1: Optional[date] = None
    subject1: Optional[str] = None 
    
    qualDegree2: Optional[str] = None 
    Board2: Optional[str] = None
    grade2: Optional[str] = None
    year2: Optional[date] = None 
    subject2: Optional[str] = None 
    
    qualDegree3: Optional[str] = None 
    Board3: Optional[str] = None 
    grade3: Optional[str] = None
    year3: Optional[date] = None 
    subject3: Optional[str] = None
    
    Session: Optional[str] = None 
    admission_date: Optional[date] = None
    AdmissionFees: Optional[Decimal] = None
    Balance: Optional[Decimal] = None

    # Tip: PATCH mein std_id dene ki zaroorat nahi kyunki ID url se aayegi (/students/{id})

class Search(BaseModel):
    std_id : Optional[str] = None
    firstname: Optional[str] = None
    lastname : Optional[str] = None
    program : Optional[str] = None

class SearchResponse(BaseModel):
    std_id : str
    firstname : str
    lastname : str
    program : str
    contact: str
    email : EmailStr

    model_config = ConfigDict(from_attributes=True)

class dashboard(BaseModel):
    total_students : int
    fees_collected : Decimal
    remaining_fees : Decimal
    recent_students : int
    students_by_program : int

class dashboard_response(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)


@field_validator('year1', 'year2', 'year3', mode='before')
def empty_string_to_none(cls, value):
    if value == "":
        return None
    return value