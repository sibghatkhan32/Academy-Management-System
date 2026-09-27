import { useState } from "react";

import PersonalInfo from "../components/PersonalInfo";
import ParentInfo from "../components/ParentInfo";
import AcademicInfo from "../components/AcademicInfo";
import AdmissionInfo from "../components/AdmissionInfo";

import { addStudent } from "../services/studentService";
import { useNavigate } from "react-router-dom";

const AdmissionForm = () => {
  const navigate = useNavigate();

    const [formData, setFormData] = useState({

        firstname: "",
        lastname: "",
        caste: "",
        parName: "",
        adress: "",
        BirthDate: "",
        religion: "",
        std_cnic: "",
        gender: "",
        contact: "",
        whatsappNo: "",
        IdMark: "",

        guardianName: "",
        RelationshipStud: "",
        par_cnic: "",
        occupation: "",
        parContact: "",

        qualDegree1: "",
        Board1: "",
        grade1: "",
        year1: "",

        subject1: "",

        qualDegree2: "",
        Board2: "",
        grade2: "",
        year2: "",
        subject2: "",

        qualDegree3: "",
        Board3: "",
        grade3: "",
        year3: "",
        subject3: "",

        std_id: "",
        program: "",
        admission_date: "",
        Session: "",
        AdmissionFees: "",
        Balance: "",

        email : "",
        parEmail: "",
    });

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    const payload = {
    ...formData,

    email:
        formData.email.trim() === ""
            ? null
            : formData.email,

    parEmail:
        formData.parEmail.trim() === ""
            ? null
            : formData.parEmail,

    year1:
        formData.year1 === ""
            ? null
            : formData.year1,

    year2:
        formData.year2 === ""
            ? null
            : formData.year2,

    year3:
        formData.year3 === ""
            ? null
            : formData.year3,
};

    try {

        await addStudent(payload);

        alert("Student registered successfully!");

        navigate("/students");

    } catch (error) {

        console.error("Error creating student:", error);

        if (error.response?.status === 422) {

            alert(
                "Validation Error. Please check all required fields and formats."
            );

            console.log(error.response.data.detail);

        } else {

            alert("Failed to register student.");

        }

    }

};

    return (

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold text-indigo-700 mb-8">
                Student Registration Form
            </h1>

            <form className="space-y-10" onSubmit={handleSubmit}>

                <PersonalInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <ParentInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <AcademicInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <AdmissionInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <div className="flex justify-end gap-4 pt-6">

                    <button
                        type="reset"
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Register Student
                    </button>

                </div>

            </form>

        </div>

    );
};

export default AdmissionForm;