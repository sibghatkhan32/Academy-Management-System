import { useEffect, useState, useCallback } from "react";
import { getStudents, searchStudent, printReciept } from "../services/studentService";
import FeesTable from "../components/FeesTable";
import debounce from "lodash.debounce";

function Fees() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  
  // Modal aur Print state handlers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // Holds full 'YYYY-MM-DD' string now
  const [printLoading, setPrintLoading] = useState(false);

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

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
        const data = await searchStudent(query);
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

  // Open pop-up modal when print button is clicked
  const openPrintModal = (student) => {
    setSelectedStudent(student);
    // Sets exact full current date matching 'YYYY-MM-DD' as default starting value
    setSelectedMonth(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  // Process Receipt Generation and handling Blob file streams
  const handleDownloadReceipt = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedMonth) return;

    setPrintLoading(true);
    try {
      // Direct selectedMonth (YYYY-MM-DD) input value is sent cleanly to service function
      const blobData = await printReciept(selectedStudent.std_id, selectedMonth);
      
      // Creating JavaScript virtual trigger element to download PDF blob safely
      const fileUrl = window.URL.createObjectURL(new Blob([blobData], { type: "application/pdf" }));
      const linkElement = document.createElement("a");
      linkElement.href = fileUrl;
      linkElement.setAttribute("download", `Receipt_${selectedStudent.std_id}_${selectedMonth}.pdf`);
      document.body.appendChild(linkElement);
      linkElement.click();
      
      // Clean up layout dom references
      linkElement.parentNode.removeChild(linkElement);
      setIsModalOpen(false);
    } catch (error) {
      console.error("PDF execution download runtime crash:", error);
      alert("Receipt not found for this specific targeted due date configuration!");
    } finally {
      setPrintLoading(false);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6 text-black">Students</h1>

      {/* Search Input Bar Section */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search by name, ID, or program..."
            value={search}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2.5 pr-10 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
          />

          {search && (
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
        <FeesTable students={students} onPrintClick={openPrintModal} />
      ) : (
        <div className="text-center py-12 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
          No students found matching your search.
        </div>
      )}

      {/* --- POP-UP MODAL UI LAYER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border text-black transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Print Fee Receipt</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Student ID: <span className="font-semibold text-indigo-600">{selectedStudent?.std_id}</span> <br />
              Name: <span className="font-semibold">{selectedStudent?.firstname} {selectedStudent?.lastname}</span>
            </p>

            <form onSubmit={handleDownloadReceipt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Due Date</label>
                <input 
                  type="date" 
                  required
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full border p-2 rounded-lg font-medium text-black focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={printLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow disabled:bg-gray-400"
                >
                  {printLoading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fees;
