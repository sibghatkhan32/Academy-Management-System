import { useEffect, useState, useCallback } from "react"; // Fixed: Added useCallback here
import { getStudents, deleteStudent, searchStudent, addStudent } from "../services/studentService"; // Fixed: Combined imports
import StudentTable from "../components/StudentTable";
import debounce from "lodash.debounce";
import AdmissionForm from "./AdmissionForm";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState(""); // Your state variable name is 'search'

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("facing error in fetching students: ", error);
    }
  };

  const handleDelete = async (std_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await deleteStudent(std_id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.std_id !== std_id)
      );
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
        const data = await searchStudent(query); // Fixed: Changed 'data' to 'query'
        setStudents(data);
      } catch (error) {
        console.error("Search failed: ", error);
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      debouncedSearch.cancel();
      fetchStudents();
    } else {
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Search Input Bar Section */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by name, ID, or program..."
            value={search} // Fixed: Changed 'searchTerm' to 'search'
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
          />

          {/* Instant Clear Button (Appears only when text exists) */}
          {search && ( // Fixed: Changed 'searchTerm' to 'search'
            <button
              onClick={() => handleInputChange({ target: { value: "" } })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Student Table Display */}
      {students.length > 0 ? (
        <StudentTable students={students} onDelete={handleDelete} />
      ) : (
        <div className="text-center py-12 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
          No students found matching your search.
        </div>
      )}
    </div>
  );
}

export default Students;
