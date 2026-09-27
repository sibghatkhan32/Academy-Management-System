import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addFees } from "../services/studentService";

const FeesForm = () => {
  const navigate = useNavigate();
  const { std_id } = useParams(); // URL se student id automatic load ho jayegi

  const [studentData, setStudentData] = useState({
    PaidAmount: "",
    RemainingAmount: "",
    duemonth: "",
    admission_fee: "",
    exam_fee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addFees(std_id, studentData);
      alert("Fees paid successfully!");
      navigate("/fees"); // Wapas main table list par bejh dega
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-black text-2xl font-bold">Pay Student Fees</h1>
        <button onClick={() => navigate("/fees")} className="text-sm text-gray-500 hover:text-black">Back</button>
      </div>
      
      {/* Yeh dikhayega ke kis student ki fees submit ho rahi hai */}
      <div className="p-3 bg-gray-100 rounded text-black text-sm font-semibold">
        Paying Fees for Student ID: <span className="text-green-600">{std_id}</span>
      </div>

      {error && <div className="text-red-500 font-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {/* Form Inputs (PaidAmount, RemainingAmount, duemonth etc.) */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">Paid Amount</label>
          <input type="number" name="PaidAmount" value={studentData.PaidAmount} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">Remaining Amount</label>
          <input type="number" name="RemainingAmount" value={studentData.RemainingAmount} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">Due Month</label>
          <input type="date" name="duemonth" value={studentData.duemonth} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">Admission Fee</label>
          <input type="number" name="admission_fee" value={studentData.admission_fee} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">Exam Fee</label>
          <input type="number" name="exam_fee" value={studentData.exam_fee} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 font-bold">
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default FeesForm;
