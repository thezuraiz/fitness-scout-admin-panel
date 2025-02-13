import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useSidebar } from "../context/SidebarContext";
import Gyms from "../pages/Gyms";
import Approvels from "../pages/Approvels";
import DietPlans from "../pages/DietPlans";
import Events from "../pages/Events";
import Users from "../pages/Users";
import GymDetail from "../pages/GymDetail";
import Transactions from "../pages/Transactions";

const AppRoutes = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Add loading state
  const { isSidebarCollapsed } = useSidebar(); // Using context for sidebar state

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      login();
    }
    setLoading(false); // Mark loading as complete
  }, [login]);

  if (loading) {
    // Show a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
      </Routes>
      <div className={`${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
          {isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
          />
          <Route
            path="/gym-detail/:id"
            element={isAuthenticated ? <GymDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/transactions/:id"
            element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />}
          />
          <Route
            path="/gyms"
            element={isAuthenticated ? <Gyms /> : <Navigate to="/login" />}
          />
          <Route
            path="/approvals"
            element={isAuthenticated ? <Approvels /> : <Navigate to="/login" />}
          />
          <Route
            path="/diet-plans"
            element={isAuthenticated ? <DietPlans /> : <Navigate to="/login" />}
          />
          <Route
            path="/events"
            element={isAuthenticated ? <Events /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
