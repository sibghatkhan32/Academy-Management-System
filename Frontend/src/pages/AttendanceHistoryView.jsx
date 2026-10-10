import { useEffect, useState } from "react";

import {
    getAllAttendanceHistory,
    viewAttendanceHistory
} from "../services/studentService";

const AttendanceHistory = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [expandedStudent, setExpandedStudent] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [historyLoading, setHistoryLoading] = useState(null);
    const [historyErrors, setHistoryErrors] = useState({});

    const fetchAttendanceHistory = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllAttendanceHistory(searchValue);

            setStudents(data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to fetch attendance history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceHistory();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setExpandedStudent(null);
        fetchAttendanceHistory(search.trim());
    };

    const handleClear = () => {
        setSearch("");
        setExpandedStudent(null);
        fetchAttendanceHistory();
    };

    const toggleAttendanceHistory = async (std_id) => {
        if (expandedStudent === std_id) {
            setExpandedStudent(null);
            return;
        }

        setExpandedStudent(std_id);
        setHistoryErrors((prev) => ({
            ...prev,
            [std_id]: ""
        }));

        if (attendanceRecords[std_id]) {
            return;
        }

        try {
            setHistoryLoading(std_id);

            const data = await viewAttendanceHistory(std_id);

            setAttendanceRecords((prev) => ({
                ...prev,
                [std_id]: data
            }));
        } catch (error) {
            console.error(error);

            setHistoryErrors((prev) => ({
                ...prev,
                [std_id]:
                    error.response?.data?.detail ||
                    "Failed to fetch student attendance history."
            }));
        } finally {
            setHistoryLoading(null);
        }
    };

    const getStatusStyle = (status) => {
        const normalizedStatus = String(status).toLowerCase();

        if (normalizedStatus === "present") {
            return "bg-green-100 text-green-800";
        }

        if (normalizedStatus === "absent") {
            return "bg-red-100 text-red-800";
        }

        if (normalizedStatus === "leave") {
            return "bg-yellow-100 text-yellow-800";
        }

        return "bg-gray-100 text-gray-800";
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-black">
                        Attendance History
                    </h1>

                    <p className="text-gray-600 text-sm mt-1">
                        View attendance summaries and date-wise records for all students
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-2"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search student..."
                        className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                    >
                        Search
                    </button>

                    {search && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>

                    <p className="ml-3 text-gray-600 font-medium">
                        Loading attendance history...
                    </p>
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                    <p className="text-lg font-semibold">
                        No attendance records found
                    </p>

                    <p className="text-sm mt-1">
                        Try another student name, ID, or program.
                    </p>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-5 py-4 text-left font-semibold">
                                        Student ID
                                    </th>

                                    <th className="px-5 py-4 text-left font-semibold">
                                        Student Name
                                    </th>

                                    <th className="px-5 py-4 text-left font-semibold">
                                        Program
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        Total Days
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        Present
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        Absent
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        Leave
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        Attendance %
                                    </th>

                                    <th className="px-5 py-4 text-center font-semibold">
                                        History
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-black divide-y divide-gray-200">
                                {students.map((student) => (
                                    <>
                                        <tr
                                            key={student.std_id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-5 py-4 font-medium text-gray-700">
                                                {student.std_id}
                                            </td>

                                            <td className="px-5 py-4 font-semibold">
                                                {student.student_name}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {student.program}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                {student.total_days}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                                                    {student.present}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                                                    {student.absent}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                                                    {student.leave}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full font-bold ${
                                                        student.attendance_percentage >= 80
                                                            ? "bg-green-100 text-green-800"
                                                            : student.attendance_percentage >= 60
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {student.attendance_percentage}%
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleAttendanceHistory(student.std_id)
                                                    }
                                                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition"
                                                >
                                                    {expandedStudent === student.std_id
                                                        ? "Hide History"
                                                        : "View History"}
                                                </button>
                                            </td>
                                        </tr>

                                        {expandedStudent === student.std_id && (
                                            <tr key={`${student.std_id}-history`}>
                                                <td
                                                    colSpan={9}
                                                    className="px-5 py-5 bg-gray-50"
                                                >
                                                    <h3 className="text-base font-bold text-gray-800 mb-4">
                                                        Attendance Records — {student.student_name}
                                                    </h3>

                                                    {historyLoading === student.std_id ? (
                                                        <p className="text-gray-600 py-4">
                                                            Loading attendance records...
                                                        </p>
                                                    ) : historyErrors[student.std_id] ? (
                                                        <p className="text-red-600 py-3">
                                                            {historyErrors[student.std_id]}
                                                        </p>
                                                    ) : !attendanceRecords[student.std_id] ||
                                                      attendanceRecords[student.std_id].length === 0 ? (
                                                        <p className="text-gray-500 py-3">
                                                            No individual attendance records found.
                                                        </p>
                                                    ) : (
                                                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-gray-100 text-gray-700">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-left">
                                                                            Date
                                                                        </th>

                                                                        <th className="px-4 py-3 text-left">
                                                                            Student ID
                                                                        </th>

                                                                        <th className="px-4 py-3 text-left">
                                                                            Student Name
                                                                        </th>

                                                                        <th className="px-4 py-3 text-center">
                                                                            Status
                                                                        </th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody className="divide-y divide-gray-200">
                                                                    {attendanceRecords[student.std_id].map((record) => (
                                                                        <tr key={record.id}>
                                                                            <td className="px-4 py-3 text-gray-700">
                                                                                {record.attendance_date
                                                                                    ? new Date(
                                                                                        `${record.attendance_date}T00:00:00`
                                                                                    ).toLocaleDateString("en-GB", {
                                                                                        day: "2-digit",
                                                                                        month: "short",
                                                                                        year: "numeric"
                                                                                    })
                                                                                    : "N/A"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-gray-700">
                                                                                {record.student_id}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-gray-700">
                                                                                {record.student_name}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-center">
                                                                                <span
                                                                                    className={`inline-block px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                                                                                        record.status
                                                                                    )}`}
                                                                                >
                                                                                    {String(record.status).charAt(0).toUpperCase() +
                                                                                        String(record.status).slice(1).toLowerCase()}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}

                                                    {attendanceRecords[student.std_id]?.length > 0 && (
                                                        <p className="text-xs text-gray-500 mt-3">
                                                            Total records: {attendanceRecords[student.std_id].length}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && students.length > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                        {students.length}
                    </span>{" "}
                    student{students.length !== 1 ? "s" : ""}
                    {search && (
                        <>
                            {" "}matching{" "}
                            <span className="font-semibold text-gray-700">
                                "{search}"
                            </span>
                        </>
                    )}
                </p>
            )}
        </div>
    );
};

export default AttendanceHistory;