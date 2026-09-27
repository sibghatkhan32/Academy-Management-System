from openpyxl import Workbook
from openpyxl.styles import Font, Alignment
from pathlib import Path


EXCEL_FILE = Path("students.xlsx")


def sync_students_to_excel(db):
    """
    Synchronizes all students from the database
    into students.xlsx.
    """

    # Import here to avoid circular imports
    from models import Student

    # Get all students from database
    students = (
        db.query(Student)
        .order_by(Student.std_id)
        .all()
    )

    # Create a new workbook
    workbook = Workbook()

    # Get active worksheet
    worksheet = workbook.active
    worksheet.title = "Students"

    # Excel headers
    headers = [
        "std_id",
        "Full Name",
        "Fathers Name",
        "Date of Birth",
        "Date of Admission",
        "Course/Program",
        "Student CNIC",
        "Address",
        "Contact Number"
    ]

    # Add headers
    worksheet.append(headers)

    # Style headers
    for cell in worksheet[1]:
        cell.font = Font(bold=True)
        cell.alignment = Alignment(horizontal="center")

    # Add student data
    for student in students:

        full_name = f"{student.firstname} {student.lastname}"

        worksheet.append([
            student.std_id,
            full_name,
            student.parName,
            student.BirthDate,
            student.admission_date,
            student.program,
            student.std_cnic,
            student.adress,
            student.contact
        ])

    # Adjust column widths
    column_widths = {
        "A": 18,
        "B": 25,
        "C": 18,
        "D": 20,
        "E": 25,
        "F": 20,
        "G": 40,
        "H": 18,
        "I": 25
    }

    for column, width in column_widths.items():
        worksheet.column_dimensions[column].width = width

    # Align data
    for row in worksheet.iter_rows():
        for cell in row:
            cell.alignment = Alignment(
                vertical="center"
            )

    # Save Excel file
    workbook.save(EXCEL_FILE)