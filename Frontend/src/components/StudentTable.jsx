import { useNavigate } from "react-router-dom";

function StudentTable({ students, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Poori table ka text chota karne ke liye 'text-sm' add kiya hai */}
      <table className="w-full text-sm"> 
        <thead className="bg-indigo-600 text-white">
          <tr>
            {/* Padding ko py-4 se kam karke py-3 kiya taake table compact lage */}
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">First Name</th>
            <th className="px-6 py-3 text-left font-semibold">Last Name</th>
            <th className="px-6 py-3 text-left font-semibold">Contact</th>
            <th className="px-6 py-3 text-left font-semibold">Program</th>
            <th className="px-6 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.std_id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-3">{student.std_id}</td>
              <td className="px-6 py-3">{student.firstname}</td>
              <td className="px-6 py-3">{student.lastname}</td>
              <td className="px-6 py-3">{student.contact}</td>
              <td className="px-6 py-3">{student.program}</td>
              <td className="px-6 py-3 flex justify-center gap-2">
                {/* Buttons ka text aur padding bhi thodi choti ki hai */}
                <button 
                  onClick={() => navigate(`/students/${student.std_id}`)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  View
                </button>
                <button 
                  onClick={() => navigate(`/student/update/${student.std_id}`)} 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  Update
                </button>
                <button 
                  onClick={() => onDelete(student.std_id)} 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
