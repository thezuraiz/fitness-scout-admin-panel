import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaBars, FaSignOutAlt, FaUser} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { CgGym } from "react-icons/cg";
import { LuCupSoda } from "react-icons/lu";
import { IoCalendarNumberOutline } from "react-icons/io5";

const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();  // Use the global state
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    logout();
  };

  return (
    <div
      className={`h-screen ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-gray-700 text-white fixed transition-all duration-300 flex flex-col`}
    >
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 self-center text-gray-700 bg-white hover:bg-gray-200 p-2 rounded-full"
        >
          <FaBars size={20} />
        </button>
      )}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b border-gray-500 ${
          isSidebarCollapsed ? "justify-center" : ""
        }`}
      >
        <Link to="/dashboard" className="flex justify-between items-center">
          <img
            src="/assets/logo.png" // Replace with your actual logo path
            alt="Logo"
            className={`${
              isSidebarCollapsed ? "w-12 h-10 mt-16" : "w-20 h-12"
            } transition-all duration-300`}
          />
        </Link>
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none mt-1 -mr-2 hover:bg-gray-500 rounded p-2"
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      <nav className="mt-4 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-md  hover:bg-gray-500 hover:text-white ${
                isActive ? "bg-white text-gray-700" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaHome className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Dashboard</span>}
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-md  hover:bg-gray-500 hover:text-white ${
                isActive ? "bg-white text-gray-700" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <FaUser className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Users</span>}
          </NavLink>
          <NavLink
            to="/gyms"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-md  hover:bg-gray-500 hover:text-white ${
                isActive ? "bg-white text-gray-700" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <CgGym className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Gyms</span>}
          </NavLink>
          <NavLink
            to="/diet-plans"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-md  hover:bg-gray-500 hover:text-white ${
                isActive ? "bg-white text-gray-700" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <LuCupSoda className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Diet Plans</span>}
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-4 rounded-md  hover:bg-gray-500 hover:text-white ${
                isActive ? "bg-white text-gray-700" : "" 
              } ${isSidebarCollapsed? 'justify-center': 'justify-start'}`
            }
          >
            <IoCalendarNumberOutline className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Events</span>}
          </NavLink>
        </div>

        {/* Logout Button */}
        <div className="mt-auto mb-4">
          <NavLink
            onClick={handleLogout}
            className={`flex items-center px-4 mx-4 rounded-md py-2  hover:bg-red-600 ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <FaSignOutAlt className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">Logout</span>}
          </NavLink>
        </div>
      </nav>

      {/* Toggler Icon for collapsed sidebar */}
      
    </div>
  );
};

export default Sidebar;
