import { useState, useEffect } from "react";
import AttendanceSheet from "../components/AttendanceSheet"; 
import { getStudents, markAttendance } from "../services/studentService"; 
import { useNavigate } from "react-router-dom";


const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekDays, setWeekDays] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 1. Fetch Students List
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        // Fallback demo data agar API down ho ya database khali ho
        setStudents([
          { std_id: "STU001", firstname: "Ali", lastname: "Khan" },
          { std_id: "STU002", firstname: "Sana", lastname: "Ahmed" },
          { std_id: "STU003", firstname: "Zain", lastname: "Raza" },
        ]);
      }
    };
    fetchStudentsData();
  }, []);

  // 2. Automatically calculate complete week when date changes
  useEffect(() => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday...
    
    // Calculate distance to current week's Monday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);

    const days = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 6; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      
      days.push({
        dateStr: nextDay.toISOString().split("T")[0],
        displayLabel: `${dayNames[i]} (${nextDay.getDate()}/${nextDay.getMonth() + 1})`,
      });
    }
    setWeekDays(days);
  }, [selectedDate]);

  // 3. Handle data modification from child dropdowns
  const handleAttendanceChange = (studentId, date, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [`${studentId}_${date}`]: status,
    }));
  };

  // 4. Save individual attendance records through a loop execution matching your backend
  const handleSaveAttendance = async () => {
  // Sirf selected date ke records consider karo
  const recordsToSave = students
    .map((student) => {
      const cellKey = `${student.std_id}_${selectedDate}`;
      const status = attendanceData[cellKey];

      // Empty status ko save mat karo
      if (!status) return null;

      // Sirf allowed statuses accept karo
      if (!["Present", "Absent", "Leave"].includes(status)) {
        return null;
      }

      return {
        std_id: student.std_id,
        status,
        attendance_date: selectedDate,
      };
    })
    .filter(Boolean);

  console.log("Records being submitted:", recordsToSave);

  // Agar koi status select nahi hua
  if (recordsToSave.length === 0) {
    alert("Please select at least one attendance status for the selected date.");
    return;
  }

  setLoading(true);

  try {
    // Har student ki selected-date attendance save karo
    const results = await Promise.allSettled(
      recordsToSave.map((record) =>
        markAttendance(record.std_id, record)
      )
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failed = results.length - successful;

    if (failed === 0) {
      alert(
        `Attendance saved successfully for ${selectedDate}. Records saved: ${successful}.`
      );
    } else {
      alert(
        `Attendance partially saved for ${selectedDate}. Successful: ${successful}, Failed: ${failed}. Please check failed requests.`
      );

      console.error(
        "Failed attendance requests:",
        results.filter((result) => result.status === "rejected")
      );
    }
  } catch (error) {
    console.error("Attendance save error:", error);
    alert(
      error.response?.data?.detail ||
      "An error occurred while saving attendance."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Upper Context Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-black text-2xl font-bold">Manage Attendance</h1>
          <p className="text-gray-600 text-sm">Select target date to view and input structural metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/attendance-history")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition active:scale-95"
          >
            📊 Attendance History
          </button>
</div>
        
        {/* Date Selector Input Box */}
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-md border">
          <label className="text-gray-700 font-medium text-sm">Select Reference Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-1.5 rounded text-black font-semibold focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Main Extracted Attendance Sheet Component Insertion */}
      <AttendanceSheet 
        students={students}
        weekDays={weekDays}
        selectedDate={selectedDate}
        attendanceData={attendanceData}
        onAttendanceChange={handleAttendanceChange}
      />

      {/* Action Footer Trigger */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveAttendance}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md disabled:bg-gray-400 text-sm"
        >
          {loading ? "Processing Entries..." : "Save Attendance Sheet"}
        </button>
      </div>
    </div>
  );
};

export default Attendance;
