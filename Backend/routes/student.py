from fastapi import Depends, APIRouter, HTTPException
from datetime import date
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Fees, Attendance, attend
from fastapi.responses import FileResponse
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
import os
from schemas import  CreateStudent, StudentResponse, Addfees, feesResponse, MarkAttendance, attendanceResponse, StudentUpdate, SearchResponse
from auth import get_current_user
from models import Admin
from sqlalchemy import func, extract
from utils.excel import sync_students_to_excel
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth
from sqlalchemy.exc import IntegrityError


router = APIRouter()


def format_currency(value):
    """
    Converts Decimal into a proper Pakistani currency string.

    Example:
    Decimal('5000')      -> Rs. 5,000.00
    Decimal('0E-10')     -> None
    None                 -> None
    """

    if value is None:
        return None

    value = float(value)

    if value == 0:
        return None

    return f"Rs. {value:,.2f}"




def build_receipt(elements, fee, styles, copy_name):

    title = styles["Heading1"]
    title.alignment = TA_CENTER

    heading = styles["Heading2"]
    heading.alignment = TA_CENTER

    normal = styles["Normal"]

    elements.append(
        Paragraph("<b>Bismillah Institute of Technology Adilpur</b>", title)
    )

    elements.append(
        Paragraph("Near PPHI Hospital Adilpur Taluka and District Ghotki", normal)
    )

    elements.append(
        Paragraph("Phone: 0317-3273072 | 0301-8325248", normal)
    )

    elements.append(
        Paragraph("<b>FEE RECEIPT</b>", heading)
    )

    elements.append(
        Paragraph(f"<b>{copy_name}</b>", heading)
    )

    elements.append(
        Spacer(1, 15)
    )

    receipt_data = [

        ["Receipt No", str(fee.id)],

        ["Student ID", fee.student_id],

        ["Student Name", fee.student_name],

        ["Fee Month", fee.duemonth.strftime("%B %Y")],

        ["Payment Date", fee.payment_date.strftime("%d-%b-%Y")],

        ["Paid Amount", format_currency(fee.PaidAmount)],

        ["Remaining Amount", format_currency(fee.RemainingAmount)]

    ]

    admission = format_currency(fee.admission_fee)

    if admission:
        receipt_data.append(["Admission Fee", admission])

    exam = format_currency(fee.exam_fee)

    if exam:
        receipt_data.append(["Exam Fee", exam])

    table = Table(receipt_data,colWidths=[180,250])

    table.setStyle(

        TableStyle([

            ("GRID",(0,0),(-1,-1),1,colors.black),

            ("BACKGROUND",(0,0),(0,-1),colors.lightgrey),

            ("BOTTOMPADDING",(0,0),(-1,-1),3),

            ("TOPPADDING",(0,0),(-1,-1),3),

            ("FONTNAME",(0,0),(-1,-1),"Helvetica")

        ])

    )

    elements.append(table)

    elements.append(
        Spacer(1,10)
    )

    elements.append(
        Paragraph("Received By : Admin", normal)
    )

    elements.append(
        Spacer(1,25)
    )

    elements.append(
        Paragraph(
            "___________________________",
            normal
        )
    )

    elements.append(
        Paragraph(
            "Authorized Signature",
            normal
        )
    )


@router.post("/create", response_model=StudentResponse)
def create_student(student : CreateStudent, db: Session=Depends(get_db), current_user: Admin = Depends(get_current_user)):
    new_student = Student(
        firstname = student.firstname,
        lastname = student.lastname,
        email = student.email,
        BirthDate = student.BirthDate,
        adress = student.adress,
        contact = student.contact,
        parName = student.parName,
        RelationshipStud = student.RelationshipStud,
        parContact = student.parContact,
        parEmail = student.parEmail,
        program = student.program,
        gender = student.gender,
        std_id = student.std_id,
        std_cnic = student.std_cnic,
        par_cnic = student.par_cnic,

        caste = student.caste,
        religion = student.religion,
        whatsappNo = student.whatsappNo,
        IdMark = student.IdMark,
        guardianName = student.guardianName,
        occupation = student.occupation,
    
        qualDegree1 = student.qualDegree1,
        Board1 = student.Board1,
        grade1 = student.grade1,
        year1 = student.year1,
        subject1 = student.subject1,
        qualDegree2 = student.qualDegree2,
        Board2 = student.Board2,
        grade2 = student.grade2,
        year2 = student.year2,
        subject2 = student.subject2,
        qualDegree3 = student.qualDegree3,
        Board3 = student. Board3,
        grade3 = student.grade3,
        year3 = student.year3,
        subject3 = student.subject3,
    
        admission_date = student.admission_date,
        Session = student.Session,
        AdmissionFees = student.AdmissionFees,
        Balance = student.Balance
    
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    sync_students_to_excel(db)

    return new_student

@router.get("/", response_model=list[StudentResponse])
def get_students(db: Session=Depends(get_db)):
    return db.query(Student).all()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    # =====================================================
    # CURRENT MONTH
    # =====================================================

    today = date.today()

    current_month = today.month
    current_year = today.year

    # =====================================================
    # TOTAL STUDENTS
    # =====================================================

    total_students = (
        db.query(Student)
        .count()
    )

    # =====================================================
    # NEW STUDENTS THIS MONTH
    # =====================================================

    new_students = (
        db.query(Student)
        .filter(
            extract("month", Student.admission_date) == current_month,
            extract("year", Student.admission_date) == current_year
        )
        .count()
    )

    # =====================================================
    # FEES COLLECTED THIS MONTH
    #
    # payment_date = actual date money was received
    # =====================================================

    total_collected = (
        db.query(
            func.coalesce(
                func.sum(Fees.PaidAmount),
                0
            )
        )
        .filter(
            extract("month", Fees.payment_date) == current_month,
            extract("year", Fees.payment_date) == current_year
        )
        .scalar()
    )

    # =====================================================
    # CURRENT OUTSTANDING BALANCE
    #
    # This is NOT restricted to current month.
    # It represents the amount students currently owe.
    # =====================================================

    total_remaining = (
        db.query(
            func.coalesce(
                func.sum(Fees.RemainingAmount),
                0
            )
        )
        .scalar()
    )

    # =====================================================
    # RECENT STUDENTS
    # =====================================================

    recent_students = (
        db.query(Student)
        .order_by(
            Student.admission_date.desc()
        )
        .limit(5)
        .all()
    )

    recent_students_data = [
        {
            "std_id": student.std_id,
            "name": f"{student.firstname} {student.lastname}",
            "program": student.program,
            "admission_date": student.admission_date
        }
        for student in recent_students
    ]

    # =====================================================
    # STUDENTS BY PROGRAM
    # =====================================================

    program_data = (
        db.query(
            Student.program,
            func.count(Student.std_id)
        )
        .group_by(
            Student.program
        )
        .all()
    )

    students_by_program = [
        {
            "program": program,
            "count": count
        }
        for program, count in program_data
    ]

    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return {
        "total_students": total_students,

        "new_students": new_students,

        "total_fees_collected": float(total_collected),

        "total_remaining": float(total_remaining),

        "recent_students": recent_students_data,

        "students_by_program": students_by_program,

        "month": today.strftime("%B %Y")
    }

@router.get("/attendance/history")
def get_all_attendance_history(
    db: Session = Depends(get_db)
):
    students = db.query(Student).all()

    result = []

    for student in students:

        total_days = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student.std_id
            )
            .count()
        )

        present_count = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student.std_id,
                Attendance.status == attend.Present
            )
            .count()
        )

        absent_count = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student.std_id,
                Attendance.status == attend.Absent
            )
            .count()
        )

        leave_count = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student.std_id,
                Attendance.status == attend.Leave
            )
            .count()
        )

        attendance_percentage = (
            round((present_count / total_days) * 100, 1)
            if total_days > 0
            else 0
        )

        result.append({
            "std_id": student.std_id,
            "student_name": f"{student.firstname} {student.lastname}",
            "program": student.program,

            "total_days": total_days,
            "present": present_count,
            "absent": absent_count,
            "leave": leave_count,

            "attendance_percentage": attendance_percentage
        })

    return result


@router.post("/fees/{std_id}", response_model=feesResponse)
def add_fees(std_id : str, fees:Addfees, db:Session=Depends(get_db), current_user: Admin = Depends(get_current_user)):
    student_exist = db.query(Student).filter(Student.std_id == std_id).first()
    if not student_exist:
        raise HTTPException(
            status_code = 404,
            detail = "Student does not exists"
        )
    
    new_fees = Fees(
        student_id = std_id,
        PaidAmount = fees.PaidAmount,
        RemainingAmount = fees.RemainingAmount,
        duemonth = fees.duemonth,
        student_name = f"{student_exist.firstname} {student_exist.lastname}",
        admission_fee = fees.admission_fee,
        exam_fee = fees.exam_fee,
    )

    db.add(new_fees)
    db.commit()
    db.refresh(new_fees)

    return new_fees


@router.get("/viewfees/{std_id}", response_model=list[feesResponse])
def get_feesRecord(std_id : str, db: Session=Depends(get_db)):
    student_exists = db.query(Student).filter(Student.std_id==std_id).first()
    if not student_exists:
        raise HTTPException(
            status_code=404,
            detail="Student does not exists"
        )
    fees_records = db.query(Fees).filter(Fees.student_id==std_id).all()
    
    return fees_records

@router.post(
    "/attendance/{std_id}",
    response_model=attendanceResponse
)
def markattendance(
    std_id: str,
    attendance: MarkAttendance,
    db: Session = Depends(get_db)
):
    try:
        # 1. Check whether student exists
        student = (
            db.query(Student)
            .filter(Student.std_id == std_id)
            .first()
        )

        if student is None:
            raise HTTPException(
                status_code=404,
                detail="Student does not exist"
            )

        # 2. Get validated status from Pydantic
        status = attendance.status

        # Convert to the Python enum if necessary
        if not isinstance(status, attend):
            try:
                status = attend(status)
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=422,
                    detail="Invalid attendance status"
                )

        # 3. Find existing attendance for this student and date
        record = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == std_id,
                Attendance.attendance_date == attendance.attendance_date
            )
            .first()
        )

        student_name = (
            f"{student.firstname} {student.lastname}".strip()
        )

        if record is not None:
            # 4. Update existing attendance
            record.status = status
            record.student_name = student_name

        else:
            # 5. Create new attendance
            record = Attendance(
                student_id=std_id,
                student_name=student_name,
                attendance_date=attendance.attendance_date,
                status=status
            )
            db.add(record)

        # 6. Commit changes
        db.commit()
        db.refresh(record)

        return record

    except HTTPException:
        db.rollback()
        raise

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail=(
                "Attendance record conflict. "
                "Please retry the request."
            )
        )

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error while saving attendance."
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while saving attendance."
        )

@router.get("/attendance/history/{std_id}", response_model=list[attendanceResponse])
def get_attendance_history(std_id: str, db: Session = Depends(get_db)):
    # 1. Verify if the student exists
    student_exists = db.query(Student).filter(Student.std_id == std_id).first()
    if not student_exists:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )
    
    # 2. Fetch all matching attendance logs ordered by date descending
    records = db.query(Attendance).filter(
        Attendance.student_id == std_id
    ).order_by(Attendance.attendance_date.desc()).all()
    
    return records

# 2. PATCH ENDPOINT (Uses StudentUpdate)
@router.patch("/update/{student_id}")
def update_student(student_id: str, student_data: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.std_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    # exclude_unset=True un fields ko nikal deta hai jo frontend se nahi bheji gayeen
    update_data = student_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)

    sync_students_to_excel(db)

    return db_student

@router.delete("/delete/{std_id}")
def delete_student(std_id: str, db: Session = Depends(get_db), current_user: Admin = Depends(get_current_user)):
    student = db.query(Student).filter(Student.std_id == std_id).first()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(student)
    db.commit()

    sync_students_to_excel(db)

    return {
        "message": f"Student '{std_id}' deleted successfully."
    }

@router.get("/receipt/{std_id}")
def generate_receipt(
    std_id: str,
    duemonth: date,
    db: Session = Depends(get_db)
):

    fee = (
        db.query(Fees)
        .filter(
            Fees.student_id == std_id,
            Fees.duemonth == duemonth
        )
        .first()
    )

    if fee is None:
        raise HTTPException(
            status_code=404,
            detail="Receipt not found."
        )

    os.makedirs(
        "receipts",
        exist_ok=True
    )

    file_path = (
        f"receipts/"
        f"{std_id}_"
        f"{fee.duemonth.strftime('%Y_%m')}.pdf"
    )

    pdf = SimpleDocTemplate(
        file_path,
        rightMargin=15,
        leftMargin=15,
        topMargin=10,
        bottomMargin=10
    )

    styles = getSampleStyleSheet()

    elements = []

    build_receipt(
        elements,
        fee,
        styles,
        "STUDENT COPY"
    )

    elements.append(
        Spacer(1,15)
    )

    elements.append(
        HRFlowable(
            width="100%",
            thickness=1,
            color=colors.black
        )
    )

    cut_style = styles["Heading3"]
    cut_style.alignment = TA_CENTER

    # elements.append(
    #     Paragraph(
    #         "<b>----- CUT HERE -----</b>",
    #         cut_style
    #     )
    # )

    elements.append(
        HRFlowable(
            width="100%",
            thickness=1,
            color=colors.black
        )
    )

    elements.append(
        Spacer(1,20)
    )

    build_receipt(
        elements,
        fee,
        styles,
        "OFFICE COPY"
    )

    pdf.build(elements)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"{std_id}.pdf"
    )

@router.get("/search", response_model=list[SearchResponse])
def search_students(query: str, db: Session = Depends(get_db)):

    students = (
        db.query(Student)
        .filter(
            (Student.firstname.ilike(f"%{query}%")) |
            (Student.lastname.ilike(f"%{query}%")) |
            (Student.std_id.ilike(f"%{query}%")) |
            (Student.program.ilike(f"%{query}%"))
        )
        .all()
    )

    return students

@router.get("/{std_id}", response_model=StudentResponse)
def get_student(std_id : str, db: Session=Depends(get_db)):
    student = db.query(Student).filter(Student.std_id == std_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


@router.get("/print-form/{std_id}")
def print_admission_form(
    std_id: str,
    db: Session = Depends(get_db),
    current_user: Admin = Depends(get_current_user)
):

    # =========================================================
    # 1. FIND STUDENT
    # =========================================================

    student = (
        db.query(Student)
        .filter(Student.std_id == std_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # =========================================================
    # 2. CREATE DIRECTORY
    # =========================================================

    os.makedirs("admission_forms", exist_ok=True)

    file_path = (
        f"admission_forms/"
        f"{student.std_id}_admission_form.pdf"
    )

    # =========================================================
    # 3. CREATE PDF
    # =========================================================

    pdf = canvas.Canvas(
        file_path,
        pagesize=A4
    )

    page_width, page_height = A4

    # =========================================================
    # COLORS
    # =========================================================

    BLUE = colors.HexColor("#315A8A")
    LIGHT_BLUE = colors.HexColor("#EAF0F6")
    BROWN = colors.HexColor("#A9472C")
    GREY = colors.HexColor("#E5E5E5")
    BLACK = colors.black

    # =========================================================
    # HELPER FUNCTIONS
    # =========================================================

    def format_date(value):

        if value is None:
            return ""

        try:
            return value.strftime("%d-%m-%Y")
        except:
            return str(value)

    def safe_value(value):

        if value is None:
            return ""

        return str(value)

    def draw_field(
        label,
        value,
        x,
        y,
        label_width=70,
        line_width=130,
        font_size=8
    ):

        # Label
        pdf.setFont(
            "Helvetica-Bold",
            font_size
        )

        pdf.drawString(
            x,
            y,
            label
        )

        # Value
        pdf.setFont(
            "Helvetica",
            font_size
        )

        value_x = x + label_width

        value_text = safe_value(value)

        # Prevent very long text from destroying layout
        max_chars = max(
            10,
            int(line_width / 4)
        )

        value_text = value_text[:max_chars]

        pdf.drawString(
            value_x,
            y,
            value_text
        )

        # Underline
        pdf.setStrokeColor(BLACK)
        pdf.setLineWidth(0.5)

        pdf.line(
            value_x,
            y - 2,
            value_x + line_width,
            y - 2
        )

    def draw_section(title, y):

        # Small grey section tab
        pdf.setFillColor(GREY)
        pdf.setStrokeColor(BLACK)
        pdf.setLineWidth(0.6)

        pdf.roundRect(
            48,
            y - 8,
            155,
            21,
            3,
            fill=1,
            stroke=1
        )

        pdf.setFillColor(BLACK)

        pdf.setFont(
            "Helvetica-Bold",
            9
        )

        pdf.drawString(
            58,
            y - 1,
            title
        )

    # =========================================================
    # OUTER BORDER
    # =========================================================

    pdf.setStrokeColor(BLUE)

    # Outer border
    pdf.setLineWidth(2)

    pdf.rect(
        25,
        25,
        page_width - 50,
        page_height - 50
    )

    # Inner border
    pdf.setLineWidth(0.7)

    pdf.rect(
        32,
        32,
        page_width - 64,
        page_height - 64
    )

    # =========================================================
    # HEADER
    # =========================================================

    pdf.setFillColor(BLUE)

    pdf.setFont(
        "Helvetica-Bold",
        18
    )

    pdf.drawCentredString(
        page_width / 2,
        page_height - 65,
        "Bismillah Institute of Technology Adilpur"
    )

    pdf.setFillColor(BLACK)

    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    pdf.drawCentredString(
        page_width / 2,
        page_height - 82,
        "Contact No: 0317-3273072 | 0301-8325248 | 0313-2666028"
    )

    pdf.setFont(
        "Helvetica",
        7.5
    )

    pdf.drawCentredString(
        page_width / 2,
        page_height - 96,
        "Near PPHI Hospital Adilpur Taluka and District Ghotki"
    )

    # =========================================================
    # ADMISSION FORM TITLE
    # =========================================================

    title_x = 205
    title_y = page_height - 135

    pdf.setFillColor(BROWN)

    pdf.roundRect(
        title_x,
        title_y,
        185,
        27,
        5,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(colors.white)

    pdf.setFont(
        "Helvetica-Bold",
        15
    )

    pdf.drawCentredString(
        title_x + 92.5,
        title_y + 8,
        "Admission Form"
    )

    # =========================================================
    # PHOTO BOX
    # =========================================================

    photo_x = page_width - 135
    photo_y = page_height - 220

    pdf.setStrokeColor(BLACK)
    pdf.setLineWidth(0.8)

    pdf.rect(
        photo_x,
        photo_y,
        88,
        105,
        fill=0,
        stroke=1
    )

    pdf.setFont(
        "Helvetica",
        7
    )

    pdf.drawCentredString(
        photo_x + 44,
        photo_y + 50,
        "PASSPORT"
    )

    pdf.drawCentredString(
        photo_x + 44,
        photo_y + 39,
        "SIZE PHOTO"
    )

    pdf.drawCentredString(
        photo_x + 44,
        photo_y + 28,
        "ATTACH HERE"
    )

    # =========================================================
    # CANDIDATE DETAILS
    # =========================================================

    candidate_section_y = page_height - 190

    draw_section(
        "Candidate Details",
        candidate_section_y
    )

    candidate_top = page_height - 210

    # Full Name
    draw_field(
        "Full Name:",
        f"{student.firstname} {student.lastname}",
        55,
        candidate_top,
        label_width=65,
        line_width=155
    )

    # Caste
    draw_field(
        "Caste:",
        student.caste,
        305,
        candidate_top,
        label_width=38,
        line_width=70
    )

    # Father's Name
    draw_field(
        "Father's Name:",
        student.parName,
        55,
        candidate_top - 22,
        label_width=72,
        line_width=175
    )

    # Address
    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    pdf.drawString(
        55,
        candidate_top - 44,
        "Permanent Address:"
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    address = safe_value(student.adress)

    address = address[:95]

    pdf.drawString(
        145,
        candidate_top - 44,
        address
    )

    pdf.line(
        145,
        candidate_top - 46,
        430,
        candidate_top - 46
    )

    # DOB
    draw_field(
        "Date of Birth:",
        format_date(student.BirthDate),
        55,
        candidate_top - 67,
        label_width=70,
        line_width=100
    )

    # Religion
    draw_field(
        "Religion:",
        student.religion,
        300,
        candidate_top - 67,
        label_width=50,
        line_width=100
    )

    # CNIC
    draw_field(
        "CNIC No:",
        student.std_cnic,
        55,
        candidate_top - 90,
        label_width=55,
        line_width=135
    )

    # Gender
    gender = (
        student.gender.value
        if hasattr(student.gender, "value")
        else student.gender
    )

    draw_field(
        "Gender:",
        gender,
        300,
        candidate_top - 90,
        label_width=45,
        line_width=100
    )

    # Mobile
    draw_field(
        "Mobile No:",
        student.contact,
        55,
        candidate_top - 113,
        label_width=60,
        line_width=110
    )

    # WhatsApp
    draw_field(
        "WhatsApp No:",
        student.whatsappNo,
        300,
        candidate_top - 113,
        label_width=70,
        line_width=110
    )

    # Identification Mark
    draw_field(
        "Mark Of Identification:",
        student.IdMark,
        50,
        candidate_top - 136,
        label_width=105,
        line_width=120
    )

    # Candidate Signature
    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    pdf.drawString(
        300,
        candidate_top - 136,
        "Candidate Sign:"
    )

    pdf.line(
        370,
        candidate_top - 138,
        430,
        candidate_top - 138
    )

    # =========================================================
    # FATHER / GUARDIAN DETAILS
    # =========================================================

    guardian_section_y = candidate_top - 165

    draw_section(
        "Father's / Guardian Details",
        guardian_section_y
    )

    guardian_top = guardian_section_y - 28

    # Name
    draw_field(
        "Name:",
        student.guardianName,
        55,
        guardian_top,
        label_width=40,
        line_width=170
    )

    # Relation
    draw_field(
        "Relation:",
        student.RelationshipStud,
        350,
        guardian_top,
        label_width=45,
        line_width=100
    )

    # CNIC
    draw_field(
        "CNIC:",
        student.par_cnic,
        55,
        guardian_top - 23,
        label_width=35,
        line_width=175
    )

    # Occupation
    draw_field(
        "Occupation:",
        student.occupation,
        350,
        guardian_top - 23,
        label_width=60,
        line_width=90
    )

    # Contact
    draw_field(
        "Contact No:",
        student.parContact,
        55,
        guardian_top - 46,
        label_width=60,
        line_width=150
    )

    # Guardian Signature
    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    pdf.drawString(
        350,
        guardian_top - 46,
        "Signature:"
    )

    pdf.line(
        400,
        guardian_top - 48,
        520,
        guardian_top - 48
    )

    # =========================================================
    # QUALIFICATION
    # =========================================================

    qualification_section_y = guardian_top - 80

    draw_section(
        "Qualification",
        qualification_section_y
    )

    table_x = 55
    table_top = qualification_section_y - 23

    col_widths = [
        85,
        105,
        80,
        70,
        145
    ]

    row_height = 22

    table_width = sum(col_widths)

    # Header
    pdf.setFillColor(LIGHT_BLUE)

    pdf.rect(
        table_x,
        table_top - row_height,
        table_width,
        row_height,
        fill=1,
        stroke=1
    )

    pdf.setFillColor(BLACK)

    headers = [
        "Degree",
        "Board / Institute",
        "DIV / Grade",
        "Year",
        "Subject"
    ]

    current_x = table_x

    pdf.setFont(
        "Helvetica-Bold",
        7.5
    )

    for i, header in enumerate(headers):

        pdf.rect(
            current_x,
            table_top - row_height * 4,
            col_widths[i],
            row_height * 4,
            fill=0,
            stroke=1
        )

        pdf.drawCentredString(
            current_x + col_widths[i] / 2,
            table_top - 15,
            header
        )

        current_x += col_widths[i]

    # Qualification data
    qualifications = [
        [
            student.qualDegree1,
            student.Board1,
            student.grade1,
            format_date(student.year1),
            student.subject1
        ],
        [
            student.qualDegree2,
            student.Board2,
            student.grade2,
            format_date(student.year2),
            student.subject2
        ],
        [
            student.qualDegree3,
            student.Board3,
            student.grade3,
            format_date(student.year3),
            student.subject3
        ]
    ]

    pdf.setFont(
        "Helvetica",
        7.5
    )

    for row_index, row in enumerate(qualifications):

        y = (
            table_top
            - row_height * (row_index + 2)
        )

        current_x = table_x

        for col_index, value in enumerate(row):

            pdf.rect(
                current_x,
                y,
                col_widths[col_index],
                row_height,
                fill=0,
                stroke=1
            )

            text = safe_value(value)

            # Keep text inside cells
            text = text[:22]

            pdf.drawCentredString(
                current_x + col_widths[col_index] / 2,
                y + 7,
                text
            )

            current_x += col_widths[col_index]

    # =========================================================
    # OFFICE DETAILS
    # =========================================================

    office_section_y = table_top - row_height * 4 - 22

    draw_section(
        "Filled By The Office",
        office_section_y
    )

    office_top = office_section_y - 30

    # Roll Number
    draw_field(
        "Roll #:",
        student.std_id,
        55,
        office_top,
        label_width=45,
        line_width=100
    )

    # Course
    draw_field(
        "Course:",
        student.program,
        220,
        office_top,
        label_width=45,
        line_width=105
    )

    # Admission Date
    draw_field(
        "Admission Date:",
        format_date(student.admission_date),
        390,
        office_top,
        label_width=75,
        line_width=70
    )

    # Session
    draw_field(
        "Session:",
        student.Session,
        55,
        office_top - 25,
        label_width=45,
        line_width=100
    )

    # Admission Fee
    admission_fee = ""

    if student.AdmissionFees is not None:
        admission_fee = (
            f"Rs. {float(student.AdmissionFees):,.2f}" # type: ignore
        )

    draw_field(
        "Admission Fees:",
        admission_fee,
        220,
        office_top - 25,
        label_width=70,
        line_width=80
    )

    # Balance
    balance = ""

    if student.Balance is not None:
        balance = (
            f"Rs. {float(student.Balance):,.2f}"
        )

    draw_field(
        "Balance:",
        balance,
        390,
        office_top - 25,
        label_width=50,
        line_width=70
    )

    # =========================================================
    # SHIFT TIME
    # =========================================================

    # Your current Student model does NOT contain shift_time.
    # getattr prevents the PDF from crashing.
    shift_time = getattr(
        student,
        "shift_time",
        ""
    )

    draw_field(
        "Shift Time:",
        shift_time,
        55,
        office_top - 50,
        label_width=60,
        line_width=105
    )

    # =========================================================
    # SIGNATURE AREA
    # =========================================================

    signature_y = 70

    pdf.setStrokeColor(BLACK)
    pdf.setLineWidth(0.7)

    # Administrator
    pdf.line(
        65,
        signature_y,
        190,
        signature_y
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    pdf.drawCentredString(
        127,
        signature_y - 14,
        "Administrator Sign"
    )

    # Principal
    pdf.line(
        405,
        signature_y,
        530,
        signature_y
    )

    pdf.drawCentredString(
        467,
        signature_y - 14,
        "Principal Sign"
    )

    # =========================================================
    # FOOTER
    # =========================================================

    pdf.setFont(
        "Helvetica",
        6.5
    )

    pdf.drawCentredString(
        page_width / 2,
        42,
        "Bismillah Institute of Technology Adilpur"
    )

    # =========================================================
    # SAVE
    # =========================================================

    pdf.showPage()
    pdf.save()

    # =========================================================
    # RETURN PDF
    # =========================================================

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=f"{student.std_id}_admission_form.pdf"
    )