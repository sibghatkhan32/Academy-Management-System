from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum, Numeric, Boolean, UniqueConstraint
from datetime import date
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PyEnum

class GenderEnum(PyEnum):
    Male = "Male"
    Female = "Female"
    Others = "Others"

class attend(PyEnum):
    Present = "Present"
    Absent = "Absent"
    Leave = "Leave"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="admin")

class Student(Base):
    __tablename__ = "students"

    std_id = Column(String,  primary_key=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname= Column(String, nullable=False)
    email = Column(String, unique=False, nullable=True)
    BirthDate = Column(Date, nullable=False)
    adress = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    parName = Column(String, nullable=False)
    RelationshipStud = Column(String, nullable=False)
    parContact = Column(String, nullable=False)
    parEmail = Column(String, nullable=True)
    program = Column(String, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    std_cnic = Column(String, unique=False, nullable=False)
    par_cnic = Column(String, unique=False, nullable=False)

    caste = Column(String, nullable=False)
    religion = Column(String, nullable=False)
    whatsappNo = Column(String, nullable=True)
    IdMark = Column(String, nullable=False)
    guardianName = Column(String, nullable=False)
    occupation = Column(String, nullable=False)

    qualDegree1 = Column(String, nullable=True)
    Board1 = Column(String, nullable=True)
    grade1 = Column(String, nullable=True)
    year1 = Column(Date, nullable=True) 
    subject1 = Column(String, nullable=False)

    qualDegree2 = Column(String, nullable=True)
    Board2 = Column(String, nullable=True)
    grade2 = Column(String, nullable=True)
    year2 = Column(Date, nullable=True) 
    subject2 = Column(String, nullable=True)
    
    qualDegree3 = Column(String, nullable=True)
    Board3 = Column(String, nullable=True)
    grade3 = Column(String, nullable=True)
    year3 = Column(Date, nullable=True) 
    subject3 = Column(String, nullable=True)

    admission_date = Column(Date,nullable=False)
    Session = Column(String,nullable=True) 
    AdmissionFees = Column(Numeric,nullable=False)
    Balance = Column(Numeric,nullable=True) 

    fees = relationship("Fees", back_populates="owner")
    attendance = relationship("Attendance", back_populates="student")

class Fees(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)

    PaidAmount = Column(Numeric(10,2), nullable=False)
    RemainingAmount = Column(Numeric(10,2), nullable = False)
    duemonth = Column(Date)
    student_name = Column(String, nullable=False)
    admission_fee = Column(Numeric, nullable=True)
    exam_fee = Column(Numeric, nullable=True)
    payment_date = Column(Date,default=date.today)

    student_id = Column(String, ForeignKey("students.std_id"))
    owner = relationship("Student", back_populates="fees")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(attend), nullable=False)
    student_name = Column(String, nullable=False)
    attendance_date = Column(Date, nullable=False)
    student_id = Column(String, ForeignKey("students.std_id"), nullable=False)

    student = relationship("Student", back_populates="attendance")

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "attendance_date",
            name="unique_student_attendance_date"
        ),
    )