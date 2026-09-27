import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    RiArrowRightSLine,
    RiDashboardHorizontalFill,
    RiUserFollowFill,
    RiMoneyDollarCircleFill,
    RiFileTextFill,
    RiUserFill
} from "@remixicon/react";


const Sidebar = () => {

    const [activeTab, setActiveTab] = useState("Dashboard");

    const navigate = useNavigate();

    const { logout } = useAuth();


    const menuItems = [
        {
            id: "Dashboard",
            label: "Dashboard",
            icon: RiDashboardHorizontalFill,
            to: "/dashboard"
        },
        {
            id: "Attendance",
            label: "Attendance",
            icon: RiUserFollowFill,
            to: "/attendance"
        },
        {
            id: "Fees",
            label: "Fees",
            icon: RiMoneyDollarCircleFill,
            to: "/fees"
        },
        {
            id: "AdmissionForm",
            label: "Admission Form",
            icon: RiFileTextFill,
            to: "/admission-form"
        },
        {
            id: "Students",
            label: "Students",
            icon: RiUserFill,
            to: "/students"
        }
    ];


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">

            {/* ================= LOGO ================= */}

            <div className="flex items-center justify-center px-6 py-6 border-b border-gray-100">

                <img
                    src={logo}
                    alt="Academy Logo"
                    className="w-36 h-auto object-contain"
                />

            </div>


            {/* ================= MENU ================= */}

            <nav className="flex-1 px-3 py-6">

                <div className="flex flex-col gap-2">

                    {menuItems.map((item) => {

                        const isActive = activeTab === item.id;

                        const IconComponent = item.icon;


                        return (

                            <Link
                                key={item.id}
                                to={item.to}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center justify-between
                                    w-full
                                    px-4 py-3
                                    rounded-lg
                                    text-base
                                    transition-all duration-200
                                    ${isActive
                                        ? "bg-emerald-100 text-emerald-900 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                    }
                                `}
                            >

                                {/* Left side */}

                                <div className="flex items-center gap-3">

                                    <IconComponent
                                        size={21}
                                        className={
                                            isActive
                                                ? "text-emerald-900"
                                                : "text-gray-400"
                                        }
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                </div>


                                {/* Right arrow */}

                                <RiArrowRightSLine
                                    size={19}
                                    className={
                                        isActive
                                            ? "text-emerald-900"
                                            : "text-gray-400"
                                    }
                                />

                            </Link>

                        );

                    })}

                </div>

            </nav>


            {/* ================= LOGOUT ================= */}

            <div className="px-4 py-5 border-t border-gray-100">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        w-full
                        px-4 py-3
                        rounded-lg
                        bg-blue-800
                        text-white
                        font-semibold
                        hover:bg-blue-900
                        active:scale-95
                        transition-all duration-150
                    "
                >
                    Logout
                </button>

            </div>

        </aside>

    );

};


export default Sidebar;