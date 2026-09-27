import React from "react";

const AcademicInfo = ({ formData, handleInputChange }) => {

    const qualificationFields = [
        {
            title: "Qualification 1",
            degree: "qualDegree1",
            board: "Board1",
            grade: "grade1",
            year: "year1",
            subject: "subject1",
        },
        {
            title: "Qualification 2",
            degree: "qualDegree2",
            board: "Board2",
            grade: "grade2",
            year: "year2",
            subject: "subject2",
        },
        {
            title: "Qualification 3",
            degree: "qualDegree3",
            board: "Board3",
            grade: "grade3",
            year: "year3",
            subject: "subject3",
        },
    ];

    const inputClass =
        "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Academic Qualifications
            </h2>

            {qualificationFields.map((qualification) => (

                <div
                    key={qualification.title}
                    className="mb-8 border rounded-xl p-5 bg-gray-50"
                >

                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {qualification.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        <div>
                            <label className="block mb-2 text-sm font-semibold">
                                Degree
                            </label>

                            <input
                                type="text"
                                name={qualification.degree}
                                value={formData[qualification.degree]}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold">
                                Board / Institute
                            </label>

                            <input
                                type="text"
                                name={qualification.board}
                                value={formData[qualification.board]}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold">
                                Grade / Division
                            </label>

                            <input
                                type="text"
                                name={qualification.grade}
                                value={formData[qualification.grade]}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold">
                                Year
                            </label>

                            <input
                                type="date"
                                name={qualification.year}
                                value={formData[qualification.year]}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold">
                                Subject
                            </label>

                            <input
                                type="text"
                                name={qualification.subject}
                                value={formData[qualification.subject]}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
};

export default AcademicInfo;