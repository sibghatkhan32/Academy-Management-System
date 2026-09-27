import React from "react";

function AttendanceSheet({ students, weekDays, selectedDate, attendanceData, onAttendanceChange }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]"> 
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Student Name</th>
              {/* Dynamic Columns for Days of the Week */}
              {weekDays.map((day) => (
                <th 
                  key={day.dateStr} 
                  className={`px-4 py-3 text-center text-xs font-semibold border-l border-indigo-500 min-w-[120px] ${
                    day.dateStr === selectedDate ? "bg-indigo-800 text-yellow-300 font-bold" : ""
                  }`}
                >
                  {day.displayLabel}
                  {day.dateStr === selectedDate && <span className="block text-[10px] text-yellow-200">(Selected)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-black divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.std_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-700">{student.std_id}</td>
                <td className="px-6 py-3 whitespace-nowrap font-medium">{`${student.firstname} ${student.lastname}`}</td>
                
                {/* Loop through week dates for dropdown cells */}
                {weekDays.map((day) => {
                  const cellKey = `${student.std_id}_${day.dateStr}`;
                  const currentStatus = attendanceData[cellKey] || "";

                  return (
                    <td key={day.dateStr} className="px-3 py-3 text-center border-l border-gray-100">
                      <select
                        value={currentStatus}
                        onChange={(e) => onAttendanceChange(student.std_id, day.dateStr, e.target.value)}
                        className={`w-full text-xs font-semibold p-1.5 rounded-md border transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          currentStatus === "Present" ? "bg-green-100 text-green-800 border-green-300" :
                          currentStatus === "Absent" ? "bg-red-100 text-red-800 border-red-300" :
                          currentStatus === "Leave" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                          "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        <option value="">-- Status --</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceSheet;
