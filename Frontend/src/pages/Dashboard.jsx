import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/studentService";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {

            const data = await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.error("Error loading dashboard:", error);
            setError("Failed to load dashboard.");

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-gray-500 text-lg">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">

            {/* ================= HEADER ================= */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome back, Admin
                </p>
            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Total Students */}

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">

                    <p className="text-sm font-medium text-gray-500">
                        Total Students
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {dashboard.total_students}
                    </h2>

                </div>


                {/* Fees Collected */}

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">

                    <p className="text-sm font-medium text-gray-500">
                        Fees Collected
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        Rs. {Number(
                            dashboard.total_fees_collected
                        ).toLocaleString()}
                    </h2>

                </div>


                {/* Remaining */}

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">

                    <p className="text-sm font-medium text-gray-500">
                        Remaining Fees
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        Rs. {Number(
                            dashboard.total_remaining
                        ).toLocaleString()}
                    </h2>

                </div>


                {/* New Students */}

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">

                    <p className="text-sm font-medium text-gray-500">
                        Recent Admissions
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {dashboard.recent_students.length}
                    </h2>

                </div>

            </div>


            {/* ================= QUICK ACTIONS ================= */}

            <div>

                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <Link
                        to="/admission-form"
                        className="bg-indigo-600 text-white rounded-xl p-5 hover:bg-indigo-700 transition"
                    >

                        <h3 className="font-semibold text-lg">
                            + Add Student
                        </h3>

                        <p className="text-sm text-indigo-100 mt-1">
                            Register a new student
                        </p>

                    </Link>


                    <Link
                        to="/students"
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                    >

                        <h3 className="font-semibold text-lg text-gray-800">
                            View Students
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Search and manage students
                        </p>

                    </Link>


                    <Link
                        to="/fees"
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                    >

                        <h3 className="font-semibold text-lg text-gray-800">
                            Manage Fees
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage student fee records
                        </p>

                    </Link>

                </div>

            </div>


            {/* ================= RECENT STUDENTS + FEE OVERVIEW ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                {/* Recent Students */}

                <div className="bg-white rounded-xl shadow-md p-6">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-bold text-gray-800">
                            Recent Students
                        </h2>

                        <Link
                            to="/students"
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            View All
                        </Link>

                    </div>


                    <div className="space-y-4">

                        {dashboard.recent_students.length === 0 ? (

                            <p className="text-gray-500">
                                No students found.
                            </p>

                        ) : (

                            dashboard.recent_students.map((student) => (

                                <div
                                    key={student.std_id}
                                    className="flex justify-between items-center border-b pb-3"
                                >

                                    <div>

                                        <Link
                                            to={`/students/${student.std_id}`}
                                            className="font-semibold text-gray-800 hover:text-indigo-600"
                                        >
                                            {student.name}
                                        </Link>

                                        <p className="text-sm text-gray-500">
                                            {student.std_id}
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-sm font-medium text-gray-700">
                                            {student.program}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {student.admission_date}
                                        </p>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* Fee Overview */}

                <div className="bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Fee Overview
                    </h2>


                    <div className="space-y-6">

                        <div>

                            <div className="flex justify-between mb-2">

                                <span className="text-gray-600">
                                    Collected
                                </span>

                                <span className="font-semibold text-green-600">
                                    Rs. {Number(
                                        dashboard.total_fees_collected
                                    ).toLocaleString()}
                                </span>

                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">

                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{ width: "75%" }}
                                />

                            </div>

                        </div>


                        <div>

                            <div className="flex justify-between mb-2">

                                <span className="text-gray-600">
                                    Remaining
                                </span>

                                <span className="font-semibold text-red-600">
                                    Rs. {Number(
                                        dashboard.total_remaining
                                    ).toLocaleString()}
                                </span>

                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">

                                <div
                                    className="bg-red-500 h-3 rounded-full"
                                    style={{ width: "25%" }}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= STUDENTS BY PROGRAM ================= */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Students by Program
                </h2>


                <div className="space-y-5">

                    {dashboard.students_by_program.length === 0 ? (

                        <p className="text-gray-500">
                            No program data available.
                        </p>

                    ) : (

                        dashboard.students_by_program.map((item) => {

                            const maxCount = Math.max(
                                ...dashboard.students_by_program.map(
                                    (program) => program.count
                                )
                            );

                            const percentage =
                                maxCount > 0
                                    ? (item.count / maxCount) * 100
                                    : 0;

                            return (

                                <div key={item.program}>

                                    <div className="flex justify-between mb-1">

                                        <span className="font-medium text-gray-700">
                                            {item.program}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {item.count} students
                                        </span>

                                    </div>


                                    <div className="w-full bg-gray-200 rounded-full h-3">

                                        <div
                                            className="bg-indigo-500 h-3 rounded-full transition-all"
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

            </div>

        </div>
    );
};

export default Dashboard;