import { Navigate } from "react-router-dom";

// Dashboard

import Login from "../pages/Authentication/Login";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Register from "../pages/Authentication/Register";
import UserProfile from "../pages/Authentication/UserProfile";
import TrainerCoursesList from "../pages/Trainer/TrainerCoursesList";
import Dashboard from "../pages/DashBoard/Index";
import AboutUs from "../pages/AboutUs/Index";
import AdminReports from "../pages/SharedPages/reports";
import AdminAnnouncementsTable from "../pages/SharedPages/Announcements/AnnouncementsTable";
import CreateAnnouncement from "../pages/SharedPages/Announcements/NewAnnouncement";
import Users from "../pages/Admin/Users";
import CourseDetails from "../pages/SharedPages/CourseDetails";
import AddUserPage from "../pages/Admin/Users/AddUserPage";
import Payment from "../pages/Trainee/Payment";
import MessagesPage from "../components/messages/MessagesPage";
import MessagesPageWithAuth from "../components/messages/MessagesPageWithAuth";
import { getAuth } from "firebase/auth";
import AllCourses from "../pages/Trainee/AllCourses";
import TraineeCoursesList from "../pages/Trainee/TraineeCoursesList";
import TraineeCoursesDetails from "../pages/Trainee/TraineeCoursesDetails";
import AssignmentSubmitList from "../pages/Trainer/AssignmentSubmitList";
import TrainerCoursesDetails from "../pages/Trainer/TrainerCoursesDetails";


const auth = getAuth(); // Get the authenticated user

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


  { path: "/users", component: <Users /> },


  { path: "/aboutus", component: <AboutUs /> },
  

  //  Profile
  { path: "/user-profile", component: <UserProfile /> },

  //admin
  { path: "/adminreports", component: <AdminReports /> },
  { path: "/add-user", component: <AddUserPage /> },
  // Admin Announcements
  { path: "/announcements-table", component: <AdminAnnouncementsTable /> },
  { path: "/admin-announcements/new", component: <CreateAnnouncement /> },


  { path: "/messages", component: <MessagesPageWithAuth /> },

  { path: "/courses/:id", component: <CourseDetails /> },

  { path: "/payment", component: <Payment /> },


  { path: "/trainer-courses-list", component: <TrainerCoursesList /> },
  {
    path: "/trainer-courses-details/:id",
    component: <TrainerCoursesDetails />,
  },


  {
    path: "/all-courses",
    component: <AllCourses />,
  },

  { path: "/trainee-courses-list", component: <TraineeCoursesList /> },
  {
    path: "/trainee-courses-details/:id",
    component: <TraineeCoursesDetails />,
  },
  {
    path: "/assignment-submit-list",
    component: <AssignmentSubmitList />,
},
  
  // ...other routes...
];

const publicRoutes: Array<RouteObject> = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
