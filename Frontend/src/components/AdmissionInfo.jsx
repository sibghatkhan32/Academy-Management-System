import React from "react";

const AdmissionInfo = ({ formData, handleInputChange }) => {

    const admissionFields = [
        {
            label: "Student ID",
            name: "std_id",
            type: "text",
            required: true,
        },
        {
            label: "Course",
            name: "program",
            type: "text",
            required: true,
        },
        {
            label: "Date of Admission",
            name: "admission_date",
            type: "date",
            required: true,
        },
        {
            label: "Session",
            name: "Session",
            type: "text",
            required: true,
        },
        {
            label: "Admission Fees",
            name: "AdmissionFees",
            type: "number",
            required: true,
            placeholder: "Enter admission fees",
        },
        {
            label: "Balance",
            name: "Balance",
            type: "number",
            required: true,
            placeholder: "Enter remaining balance",
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Filled by the Office
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {admissionFields.map((field) => (

                    <div key={field.name}>

                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            {field.label}
                        </label>

                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />

                    </div>

                ))}

            </div>

        </div>
    );
};

export default AdmissionInfo;