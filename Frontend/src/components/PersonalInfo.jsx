import React from "react";

const PersonalInfo = ({ formData, handleInputChange }) => {

    const personalFields = [
        {
            label: "First Name",
            name: "firstname",
            type: "text",
            required: true,
        },
        {
            label: "Last Name",
            name: "lastname",
            type: "text",
            required: true,
        },
        {
            label: "Caste",
            name: "caste",
            type: "text",
            required: true,
        },
        {
            label: "Guardian Name",
            name: "parName",
            type: "text",
            required: true,
        },
        {
            label: "Address",
            name: "adress",
            type: "text",
            required: true,
        },
        {
            label: "Date of Birth",
            name: "BirthDate",
            type: "date",
            required: true,
        },
        {
            label: "Religion",
            name: "religion",
            type: "text",
            required: true,
        },
        {
            label: "Student CNIC",
            name: "std_cnic",
            type: "text",
            required: true,
            pattern: "\\d{13}",
            placeholder: "13 digits",
        },
        {
            label: "Gender",
            name: "gender",
            type: "select",
            required: true,
            options: [
                "Male",
                "Female",
                "Others"
            ]
        },
        {
            label: "Contact Number",
            name: "contact",
            type: "text",
            required: true,
            pattern: "\\d{11}",
            placeholder: "11 digits",
        },
        {
            label: "WhatsApp Number",
            name: "whatsappNo",
            type: "text",
            required: true,
            pattern: "\\d{11}",
            placeholder: "11 digits",
        },
        {
            label: "Identification Mark",
            name: "IdMark",
            type: "text",
            required: true,
        },
        {
            label: "Email",
            name: "email",
            type: "email",
            required: false,
            placeholder: "student@example.com",
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Candidate Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {personalFields.map((field) => (

                    <div key={field.name}>

                        <label className="block mb-2 text-sm font-semibold text-gray-700">

                            {field.label}

                        </label>

                        {field.type === "select" ? (

                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                required={field.required}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >

                                <option value="">
                                    Select {field.label}
                                </option>

                                {field.options.map((option) => (

                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>

                                ))}

                            </select>

                        ) : (

                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                required={field.required}
                                pattern={field.pattern}
                                placeholder={field.placeholder}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />

                        )}

                    </div>

                ))}

            </div>

        </div>

    );
};

export default PersonalInfo;