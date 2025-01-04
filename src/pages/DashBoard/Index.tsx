import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import TrainerDashboard from "./TrainerDashboard";
import TraineeDashboard from "./TraineeDashboard";
import Spinner from "react-bootstrap/Spinner";

const MainDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const user_details = sessionStorage.getItem("user_details");
    if (user_details) {
      const user = JSON.parse(user_details);
      if (user.status === 1) {
        setRole(user.role);
      }
    }
    setLoading(false);
  }, []);

  // Show a loading spinner while determining the role
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Render the appropriate dashboard based on the role
  return (
    <div className="page-content">
      <div className="dashboard-content">
        {role === "admin" && <AdminDashboard />}
        {role === "trainer" && <TrainerDashboard />}
        {role === "trainee" && <TraineeDashboard />}
        {!role && <p>No role assigned or invalid user.</p>}
      </div>
    </div>
  );
};

export default MainDashboard;
