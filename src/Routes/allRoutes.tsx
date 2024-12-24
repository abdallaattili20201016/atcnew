import { Navigate } from "react-router-dom";

// Dashboard

import Login from "../pages/Authentication/Login";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Register from "../pages/Authentication/Register";
import UserProfile from "../pages/Authentication/UserProfile";
import TrainerCoursesList from "../pages/Trainer/TrainerCoursesList";
import TrainerCoursesDetails from "../pages/Trainer/TrainerCoursesDetails";
import Dashboard from "../pages/DashBoard/Index";
import AboutUs from "../pages/AboutUs/Index";
import TrainerAnnouncements from "../pages/Trainer/TrainerAnnouncements/Index";
import TrainerReports from "../pages/Trainer/TrainerReports/Index";

interface RouteObject {
  path: string;
  component: any;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/index", component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

  { path: "/trainer-courses-list", component: <TrainerCoursesList /> },
  { path: "/user", component: <TrainerCoursesList /> },

  {
    path: "/trainer-courses-details/:id",
    component: <TrainerCoursesDetails />,
  },
  { path: "/aboutus", component: <AboutUs /> },
  { path: "/trainerannouncements", component: <TrainerAnnouncements /> },
  { path: "/tarinerreports", component: <TrainerReports /> },

  //  Profile
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes: Array<RouteObject> = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
