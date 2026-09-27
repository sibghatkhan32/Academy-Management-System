import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getStudentForUpdate,
    updateStudent
} from "../services/studentService";

const UpdateStudent = () => {
    const { std_id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    // Fetch student when page loads
    useEffect(() => {
        fetchStudent();
    }, [std_id]);

    // Get student from backend
    const fetchStudent = async () => {
        try {
            const data = await getStudentForUpdate(std_id);
            setStudent(data);
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setStudent((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit updated student
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedStudent = await updateStudent(std_id, student);

            console.log("Student updated:", updatedStudent);

            alert("Student updated successfully!");

            navigate(`/students/${std_id}`);
        } catch (error) {
            console.error("Error updating student:", error);

            alert("Failed to update student");
        }
    };

    // Loading state
    if (student === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>

                <p className="ml-3 text-gray-600 font-medium">
                    Loading student data...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Update Student
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Student ID: {student.std_id}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-lg p-8 space-y-10"
                >

                    {/* ================= PERSONAL INFORMATION ================= */}

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstname"
                                    value={student.firstname || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastname"
                                    value={student.lastname || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={student.email || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Birth Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Birth Date
                                </label>

                                <input
                                    type="date"
                                    name="BirthDate"
                                    value={student.BirthDate || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="adress"
                                    value={student.adress || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact
                                </label>

                                <input
                                    type="text"
                                    name="contact"
                                    value={student.contact || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    WhatsApp Number
                                </label>

                                <input
                                    type="text"
                                    name="whatsappNo"
                                    value={student.whatsappNo || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={student.gender || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* Caste */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caste
                                </label>

                                <input
                                    type="text"
                                    name="caste"
                                    value={student.caste || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Religion */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Religion
                                </label>

                                <input
                                    type="text"
                                    name="religion"
                                    value={student.religion || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Student CNIC */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student CNIC
                                </label>

                                <input
                                    type="text"
                                    name="std_cnic"
                                    value={student.std_cnic || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Identification Mark */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Identification Mark
                                </label>

                                <input
                                    type="text"
                                    name="IdMark"
                                    value={student.IdMark || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                        </div>
                    </div>


                    {/* ================= PARENT / GUARDIAN ================= */}

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Parent / Guardian Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Parent Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Name
                                </label>

                                <input
                                    type="text"
                                    name="parName"
                                    value={student.parName || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Guardian Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Guardian Name
                                </label>

                                <input
                                    type="text"
                                    name="guardianName"
                                    value={student.guardianName || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Relationship */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Relationship with Student
                                </label>

                                <input
                                    type="text"
                                    name="RelationshipStud"
                                    value={student.RelationshipStud || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Parent Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Contact
                                </label>

                                <input
                                    type="text"
                                    name="parContact"
                                    value={student.parContact || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Parent Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Email
                                </label>

                                <input
                                    type="email"
                                    name="parEmail"
                                    value={student.parEmail || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Parent CNIC */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent CNIC
                                </label>

                                <input
                                    type="text"
                                    name="par_cnic"
                                    value={student.par_cnic || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Occupation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Occupation
                                </label>

                                <input
                                    type="text"
                                    name="occupation"
                                    value={student.occupation || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                        </div>
                    </div>


                    {/* ================= ACADEMIC QUALIFICATIONS ================= */}

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Academic Qualifications
                        </h2>

                        {/* Qualification 1 */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Qualification 1
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <input
                                    type="text"
                                    name="qualDegree1"
                                    placeholder="Degree"
                                    value={student.qualDegree1 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="Board1"
                                    placeholder="Board"
                                    value={student.Board1 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="grade1"
                                    placeholder="Grade / CGPA"
                                    value={student.grade1 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="date"
                                    name="year1"
                                    value={student.year1 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="subject1"
                                    placeholder="Subjects"
                                    value={student.subject1 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                            </div>
                        </div>


                        {/* Qualification 2 */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Qualification 2
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <input
                                    type="text"
                                    name="qualDegree2"
                                    placeholder="Degree"
                                    value={student.qualDegree2 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="Board2"
                                    placeholder="Board"
                                    value={student.Board2 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="grade2"
                                    placeholder="Grade / CGPA"
                                    value={student.grade2 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="date"
                                    name="year2"
                                    value={student.year2 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="subject2"
                                    placeholder="Subjects"
                                    value={student.subject2 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                            </div>
                        </div>


                        {/* Qualification 3 */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Qualification 3
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                <input
                                    type="text"
                                    name="qualDegree3"
                                    placeholder="Degree"
                                    value={student.qualDegree3 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="Board3"
                                    placeholder="Board"
                                    value={student.Board3 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="grade3"
                                    placeholder="Grade / CGPA"
                                    value={student.grade3 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="date"
                                    name="year3"
                                    value={student.year3 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                                <input
                                    type="text"
                                    name="subject3"
                                    placeholder="Subjects"
                                    value={student.subject3 || ""}
                                    onChange={handleChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full"
                                />

                            </div>
                        </div>

                    </div>


                    {/* ================= ENROLLMENT & FEES ================= */}

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            Enrollment & Fee Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Program */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program
                                </label>

                                <input
                                    type="text"
                                    name="program"
                                    value={student.program || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Session */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Session
                                </label>

                                <input
                                    type="text"
                                    name="Session"
                                    value={student.Session || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Admission Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admission Date
                                </label>

                                <input
                                    type="date"
                                    name="admission_date"
                                    value={student.admission_date || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Admission Fees */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admission Fees
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="AdmissionFees"
                                    value={student.AdmissionFees ?? ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Balance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Balance Amount
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="Balance"
                                    value={student.Balance ?? ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                        </div>
                    </div>


                    {/* ================= ACTION BUTTONS ================= */}

                    <div className="flex justify-end gap-4 pt-6 border-t">

                        <button
                            type="button"
                            onClick={() => navigate(`/students/${std_id}`)}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Save Updates
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default UpdateStudent;