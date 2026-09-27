import React from 'react'

const ParentInfo = ({ formData, handleInputChange }) => {
    const guardianFields = [
        {
            label : "Father/Guardian Name",
            name : "guardianName",
            type : "text",
            required : true,
        },
        {
            label : "Relationship with Student",
            name : "RelationshipStud",
            type : "text",
            required : true,
        },
        {
            label : "Father/Guardian CNIC",
            name : "par_cnic",
            type : "text",
            required : true,
            pattern : "\\d{13}",
            placeholder : "13 digits"
        },
        {
            label : "Occupation",
            name : "occupation",
            type : "text",
            required : true,
        },
        {
            label : "Contact No",
            name : "parContact",
            type : "text",
            required : true,
            pattern : "\\d{11}",
            placeholder : "11 digits",
        },
        {
        label: "Email",
        name: "parEmail",
        type: "email",
        required: false,
        placeholder: "parent@example.com",
        },
    ]
  return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Father's /Guardian Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {guardianFields.map((field) => (

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

export default ParentInfo
