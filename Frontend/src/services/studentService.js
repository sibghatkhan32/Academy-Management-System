import api from "./api";

export const getStudents = async () => {

    const response = await api.get("/student/");

    return response.data;

};

export const getStudent = async (std_id) => {

    const response = await api.get(`/student/${std_id}`);

    return response.data;

};

// Get one student for the update form
export const getStudentForUpdate = async (std_id) => {
    const response = await api.get(`/student/${std_id}`);

    return response.data;
};

export const updateStudent = async (std_id, studentData) => {
    const response = await api.patch(`/student/update/${std_id}`, studentData);

    return response.data
}

export const deleteStudent = async (std_id) => {
    const response = await api.delete(`/student/delete/${std_id}`)

    return response.data
}

export const searchStudent = async (query) => {
    // This sends the request to: /student/search?q=your_search_term
    const response = await api.get('/student/search', {
        params: {
            query : query // 'q' is a standard backend key, change it if your backend expects 'search' or 'name'
        }
    });

    return response.data;
};

export const addStudent = async (studentData) => {
    const response = await api.post('/student/create', studentData)

    return response.data;
}

export const addFees = async (std_id, studentData) => {
    const response = await api.post(`/student/fees/${std_id}`, studentData)

    return response.data;
}

export const viewStudentFees = async (std_id) => {
    const response = await api.get(`/student/viewfees/${std_id}`)

    return response.data;
}

export const markAttendance = async (std_id, student) => {
    const response = await api.post(`/student/attendance/${std_id}`, student)

    return response.data;
}

export const viewAttendanceHistory = async (std_id) => {
    const response = await api.get(`/student/attendance/history/${std_id}`);

    return response.data;
};

export const printReciept = async (std_id, dateString) => {
    const response = await api.get(`/student/receipt/${std_id}`, {
        params: {
            duemonth: dateString
        },
        responseType: "blob"
    });

    return response.data;
};

export const getDashboard = async () => {
    const response = await api.get(`/student/dashboard`)
    
    return response.data
}

export const printStudentForm = async (std_id) => {
    const response = await api.get(`/student/print-form/${std_id}`, {
        responseType: "blob",
    });

    return response.data;
};

export const getAllAttendanceHistory = async (search = "") => {
    const response = await api.get("/student/attendance/history", {
        params: search ? { search } : {}
    });

    return response.data;
};