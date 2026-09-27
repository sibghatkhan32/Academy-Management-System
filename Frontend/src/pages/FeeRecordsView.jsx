import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewStudentFees } from "../services/studentService";

// Format date like: 1st July 2026, 2nd July 2026, 3rd July 2026
const formatDueDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();

    let suffix = "th";

    if (day % 100 >= 11 && day % 100 <= 13) {
        suffix = "th";
    } else {
        switch (day % 10) {
            case 1:
                suffix = "st";
                break;
            case 2:
                suffix = "nd";
                break;
            case 3:
                suffix = "rd";
                break;
        }
    }

    const month = date.toLocaleDateString("en-US", {
        month: "long",
    });

    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
};

const FeeRecordsView = () => {
    const { std_id } = useParams();
    const navigate = useNavigate();

    const [feeRecords, setFeeRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStudent();
    }, [std_id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);

            const data = await viewStudentFees(std_id);

            // Backend array return kare toh direct use hoga.
            // Agar single object aaye toh array mein convert ho jayega.
            setFeeRecords(Array.isArray(data) ? data : [data]);

        } catch (error) {
            console.error(error);
            setError("Failed to fetch fee records.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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
        <div className="p-8 max-w-6xl mx-auto">

            {/* Header section */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-black text-2xl font-bold">
                        Fee History / Records
                    </h1>

                    {feeRecords.length > 0 && (
                        <p className="text-gray-600 mt-1">
                            Student Name:{" "}
                            <span className="font-semibold text-indigo-600">
                                {feeRecords[0].student_name}
                            </span>

                            {" | "}

                            ID:{" "}
                            <span className="font-semibold">
                                {std_id}
                            </span>
                        </p>
                    )}
                </div>

                <button
                    onClick={() => navigate("/fees")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-semibold shadow"
                >
                    Back to List
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* No records */}
            {feeRecords.length === 0 ? (

                <div className="text-center bg-white p-8 rounded-xl shadow text-gray-500">
                    No fee records found for this student.
                </div>

            ) : (

                /* Fee records table */
                <div className="overflow-x-auto bg-white rounded-xl shadow">

                    <table className="min-w-full table-auto">

                        <thead className="bg-gray-100 border-b">
                            <tr>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Payment Date
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Due Month
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Admission Fee
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Exam Fee
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Paid Amount
                                </th>

                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Remaining Amount
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 text-black">

                            {feeRecords.map((record) => (

                                <tr
                                    key={record.id}
                                    className="hover:bg-gray-50"
                                >

                                    {/* Payment Date */}
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(
                                            record.payment_date
                                        ).toLocaleDateString()}
                                    </td>

                                    {/* Due Date */}
                                    <td className="px-6 py-4 text-sm">
                                        {formatDueDate(record.duemonth)}
                                    </td>

                                    {/* Admission Fee */}
                                    <td className="px-6 py-4 text-sm">
                                        {record.admission_fee !== null &&
                                        record.admission_fee !== undefined
                                            ? `Rs. ${record.admission_fee}`
                                            : "-"}
                                    </td>

                                    {/* Exam Fee */}
                                    <td className="px-6 py-4 text-sm">
                                        {record.exam_fee !== null &&
                                        record.exam_fee !== undefined
                                            ? `Rs. ${record.exam_fee}`
                                            : "-"}
                                    </td>

                                    {/* Paid Amount */}
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                        Rs. {record.PaidAmount}
                                    </td>

                                    {/* Remaining Amount */}
                                    <td className="px-6 py-4 text-sm font-semibold text-red-500">
                                        Rs. {record.RemainingAmount}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default FeeRecordsView;