import { useNavigate } from "react-router-dom";

function FeesTable({ students, onPrintClick }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <table className="w-full text-sm"> 
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">First Name</th>
            <th className="px-6 py-3 text-left font-semibold">Last Name</th>
            <th className="px-6 py-3 text-left font-semibold">Contact</th>
            <th className="px-6 py-3 text-left font-semibold">Program</th>
            <th className="px-6 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {students.map((student) => (
            <tr key={student.std_id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-3">{student.std_id}</td>
              <td className="px-6 py-3">{student.firstname}</td>
              <td className="px-6 py-3">{student.lastname}</td>
              <td className="px-6 py-3">{student.contact}</td>
              <td className="px-6 py-3">{student.program}</td>
              <td className="px-6 py-3 flex justify-center gap-2">
                <button 
                  onClick={() => navigate(`/fee-records/${student.std_id}`)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  View Fee Records
                </button>
                <button 
                  onClick={() => navigate(`/pay-fees/${student.std_id}`)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  Pay Fees
                </button>
                {/* Trigger Modal open event on click */}
                <button 
                  onClick={() => onPrintClick(student)} 
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeesTable;
