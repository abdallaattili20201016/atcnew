import React from "react";

const AdminNavdata = () => {
  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "las la-house-damage",
      link: "/dashboard",
    },
    {
      label: "Pages",
      isHeader: true,
    },
    {
      id: "users",
      label: "Users",
      icon: "las la-house-damage",
      link: "/users",
    },
    {
      id: "reports",
      label: "Reports",
      icon: "las la-house-damage",
      link: "/adminreports",
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: "las la-house-damage",
      link: "/announcements-table",
    },
    {
      id: "ViewCourses",
      label: "Courses",
      icon: "las la-house-damage",
      link: "/ViewCourses",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },
    {
      label: "More",
      isHeader: true,
    },
    {
      id: "aboutus",
      label: "About Us",
      icon: "las la-house-damage",
      link: "/aboutus",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};

const TrainerNavdata = () => {
  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "las la-house-damage",
      link: "/dashboard",
    },
    {
      label: "Pages",
      isHeader: true,
    },
    {
      id: "trainer-courses-list",
      label: "My Courses",
      icon: "las la-house-damage",
      link: "/trainer-courses-list",
    },
    {
      id: "TrainerAnnouncements",
      label: "Announcements",
      icon: "las la-house-damage",
      link: "/announcements-table",
    },
    {
      id: "TrainerReports",
      label: "Reports",
      icon: "las la-house-damage",
      link: "/adminreports",
    },

    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },

    {
      label: "More",
      isHeader: true,
    },
    {
      id: "aboutus",
      label: "About Us",
      icon: "las la-house-damage",
      link: "/aboutus",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};

const TraineeNavdata = () => {
  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "las la-house-damage",
      link: "/dashboard",
    },
    {
      label: "Pages",
      isHeader: true,
    },
    {
      id: "all-courses",
      label: "All Courses",
      icon: "las la-th-list",
      link: "/all-courses",
    },

    {
      id: "trainee-courses-list",
      label: "My Courses",
      icon: "las la-house-damage",
      link: "/trainee-courses-list",
    },

    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },
    {
      id: "payment",
      label: "Payment",
      icon: "las la-house-damage",
      link: "/payment",
    },
    {
      label: "More",
      isHeader: true,
    },
    {
      id: "aboutus",
      label: "About Us",
      icon: "las la-house-damage",
      link: "/aboutus",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default { AdminNavdata, TrainerNavdata, TraineeNavdata };
