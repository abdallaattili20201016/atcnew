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
import AdminReports from "../pages/Admin/AdminReports/Index";
import AdminAnnouncementsTable from "../pages/Admin/AdminAnnouncements/AnnouncementsTable";
import CreateAnnouncement from "../pages/Admin/AdminAnnouncements/NewAnnouncement";
import Users from "../pages/Admin/Users";
import AdminCourses from "../pages/Admin/AdminCourses/AdminCourses";
import AddCourse from "../pages/Admin/AdminCourses/AddCourse";
import CourseDetails from "../pages/SharedPages/CourseDetails";
import AddUserPage from "../pages/Admin/Users/AddUserPage";


interface RouteObject {
  path: string;
  component: any;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/index", component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/", exact: true, component: <Navigate to="/login" /> },
  { path: "*", component: <Navigate to="/login" /> },

  { path: "/trainer-courses-list", component: <TrainerCoursesList /> },
  { path: "/users", component: <Users /> },

  {
    path: "/trainer-courses-details/:id",
    component: <TrainerCoursesDetails />,
  },
  { path: "/aboutus", component: <AboutUs /> },
  { path: "/trainerannouncements", component: <TrainerAnnouncements /> },
  { path: "/tarinerreports", component: <TrainerReports /> },

  //  Profile
  { path: "/user-profile", component: <UserProfile /> },

  //admin
  { path: "/adminreports", component: <AdminReports /> },
  { path: "/add-user", component: <AddUserPage /> },
  // Admin Announcements
  { path: "/announcements-table", component: <AdminAnnouncementsTable /> },
  { path: "/admin-announcements/new", component: <CreateAnnouncement /> },

  { path: "/admin-courses", component: <AdminCourses /> },
  { path: "/admin-courses/add", component: <AddCourse /> },


  { path: "/courses/:id", component: <CourseDetails /> },


];

const publicRoutes: Array<RouteObject> = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
