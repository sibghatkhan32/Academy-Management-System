import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getStudent } from '../services/studentService';
import { printStudentForm } from "../services/studentService";

function StudentDetails() {
    const { std_id } = useParams();
    const [student, setStudent] = useState(null);

    useEffect(() => { 
        fetchStudent(); 
    }, [std_id]); 

    const fetchStudent = async () => {
        try {
            const data = await getStudent(std_id);
            setStudent(data);
        }
        catch(error){
            console.error(error);
        }
    };

    const handlePrintForm = async () => {
    try {
        const pdfBlob = await printStudentForm(std_id);

        const pdfUrl = window.URL.createObjectURL(
            new Blob([pdfBlob], { type: "application/pdf" })
        );

        window.open(pdfUrl, "_blank");

    } catch (error) {
        console.error("Error printing admission form:", error);
        alert("Failed to generate admission form.");
    }
};

    if (student === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-600 font-medium">Loading student data...</p>
            </div>
        );
    }

    return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

        <div className="max-w-5xl mx-auto space-y-8">

            {/* ================= HEADER ================= */}
            <div className="bg-white shadow rounded-xl p-6">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Student Profile
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            View and manage full enrollment details
                        </p>
                    </div>

                    <button
                        onClick={handlePrintForm}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
                    >
                        🖨️ Print Admission Form
                    </button>

                </div>

            </div>


            {/* ================= PORTION 1 ================= */}
            <div className="bg-white shadow rounded-xl p-6 border-t-4 border-indigo-600">

                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-5">
                    1. Candidate Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">

                    <p>
                        <span className="font-semibold text-gray-500">
                            Full Name:
                        </span>{" "}
                        {student.firstname} {student.lastname}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Caste:
                        </span>{" "}
                        {student.caste}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Gender:
                        </span>{" "}
                        {student.gender}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Religion:
                        </span>{" "}
                        {student.religion}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            CNIC / B-Form:
                        </span>{" "}
                        {student.std_cnic}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Birth Date:
                        </span>{" "}
                        {student.BirthDate}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Contact:
                        </span>{" "}
                        {student.contact}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            WhatsApp:
                        </span>{" "}
                        {student.whatsappNo}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Email:
                        </span>{" "}
                        {student.email || "N/A"}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Identity Mark:
                        </span>{" "}
                        {student.IdMark}
                    </p>

                    <p className="md:col-span-2">
                        <span className="font-semibold text-gray-500">
                            Address:
                        </span>{" "}
                        {student.adress}
                    </p>

                </div>

            </div>


            {/* ================= PORTION 2 ================= */}
            <div className="bg-white shadow rounded-xl p-6 border-t-4 border-green-600">

                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-5">
                    2. Father's / Guardian's Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">

                    <p>
                        <span className="font-semibold text-gray-500">
                            Father's Name:
                        </span>{" "}
                        {student.parName}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Guardian Name:
                        </span>{" "}
                        {student.guardianName}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Relationship:
                        </span>{" "}
                        {student.RelationshipStud}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Father/Guardian CNIC:
                        </span>{" "}
                        {student.par_cnic}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Occupation:
                        </span>{" "}
                        {student.occupation}
                    </p>

                    <p>
                        <span className="font-semibold text-gray-500">
                            Contact No:
                        </span>{" "}
                        {student.parContact}
                    </p>

                    <p className="md:col-span-2">
                        <span className="font-semibold text-gray-500">
                            Parent Email:
                        </span>{" "}
                        {student.parEmail || "N/A"}
                    </p>

                </div>

            </div>


            {/* ================= PORTION 3 ================= */}
            <div className="bg-white shadow rounded-xl p-6 border-t-4 border-amber-500">

                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-5">
                    3. Qualification Details
                </h2>

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200 text-sm text-left">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider">
                                    Degree / Certificate
                                </th>

                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider">
                                    Board / University
                                </th>

                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider">
                                    Subject
                                </th>

                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider">
                                    Year
                                </th>

                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase tracking-wider">
                                    Grade / Div
                                </th>

                            </tr>

                        </thead>


                        <tbody className="bg-white divide-y divide-gray-200 text-gray-700">

                            {student.qualDegree1 && (
                                <tr>

                                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                                        {student.qualDegree1}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.Board1}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.subject1}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.year1}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.grade1}
                                    </td>

                                </tr>
                            )}


                            {student.qualDegree2 && (
                                <tr>

                                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                                        {student.qualDegree2}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.Board2}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.subject2}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.year2}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.grade2}
                                    </td>

                                </tr>
                            )}


                            {student.qualDegree3 && (
                                <tr>

                                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                                        {student.qualDegree3}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.Board3}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.subject3}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.year3}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {student.grade3}
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================= PORTION 4 ================= */}
            <div className="bg-blue-50 shadow rounded-xl p-6 border-l-8 border-blue-600">

                <h2 className="text-xl font-bold text-blue-900 mb-5">
                    4. Filled by the Office Only
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-blue-950">

                    <p>
                        <span className="font-semibold text-blue-800">
                            Student ID:
                        </span>{" "}

                        <span className="bg-blue-200 px-2 py-1 rounded font-mono font-bold text-blue-900">
                            {student.std_id}
                        </span>
                    </p>

                    <p>
                        <span className="font-semibold text-blue-800">
                            Program Enrolled:
                        </span>{" "}
                        {student.program}
                    </p>

                    <p>
                        <span className="font-semibold text-blue-800">
                            Session:
                        </span>{" "}
                        {student.Session}
                    </p>

                    <p>
                        <span className="font-semibold text-blue-800">
                            Admission Date:
                        </span>{" "}
                        {student.admission_date}
                    </p>

                    <p>
                        <span className="font-semibold text-blue-800">
                            Admission Fees:
                        </span>{" "}
                        Rs. {student.AdmissionFees}
                    </p>

                    <p>
                        <span className="font-semibold text-blue-800">
                            Remaining Balance:
                        </span>{" "}

                        <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                            Rs. {student.Balance}
                        </span>
                    </p>

                </div>

            </div>


            {/* ================= PRINT BUTTON ================= */}
            <div className="flex justify-end pb-6">

                <button
                    onClick={handlePrintForm}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow"
                >
                    🖨️ Print Admission Form
                </button>

            </div>

        </div>

    </div>
);
}

export default StudentDetails;
