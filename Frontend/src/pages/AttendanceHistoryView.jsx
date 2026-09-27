import { useEffect, useState } from "react";
import { getAllAttendanceHistory } from "../services/studentService";

const AttendanceHistory = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    // Load all students when page opens
    useEffect(() => {
        fetchAttendanceHistory();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        fetchAttendanceHistory(search.trim());
    };

    const handleClear = () => {
        setSearch("");
        fetchAttendanceHistory();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-black">
                        Attendance History
                    </h1>

                    <p className="text-gray-600 text-sm mt-1">
                        View attendance summary for all students
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition active:scale-95"
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

            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>

                    <p className="ml-3 text-gray-600 font-medium">
                        Loading attendance history...
                    </p>
                </div>
            ) : students.length === 0 ? (

                /* No Students */
                <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                    <p className="text-lg font-semibold">
                        No attendance records found
                    </p>

                    <p className="text-sm mt-1">
                        Try another student name, ID, or program.
                    </p>
                </div>

            ) : (

                /* Table */
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

                                </tr>

                            </thead>

                            <tbody className="text-black divide-y divide-gray-200">

                                {students.map((student) => (

                                    <tr
                                        key={student.std_id}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        {/* ID */}
                                        <td className="px-5 py-4 font-medium text-gray-700">
                                            {student.std_id}
                                        </td>

                                        {/* Name */}
                                        <td className="px-5 py-4 font-semibold">
                                            {student.student_name}
                                        </td>

                                        {/* Program */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {student.program}
                                        </td>

                                        {/* Total */}
                                        <td className="px-5 py-4 text-center">
                                            {student.total_days}
                                        </td>

                                        {/* Present */}
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                                                {student.present}
                                            </span>
                                        </td>

                                        {/* Absent */}
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                                                {student.absent}
                                            </span>
                                        </td>

                                        {/* Leave */}
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                                                {student.leave}
                                            </span>
                                        </td>

                                        {/* Percentage */}
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

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {/* Result count */}
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