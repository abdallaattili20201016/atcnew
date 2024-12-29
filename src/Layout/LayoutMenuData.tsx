import React, { useEffect, useState } from "react";

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
      id: "courses",
      label: "Courses",
      icon: "las la-house-damage",
      link: "/admin-courses",
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
      label: "Courses",
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
      id: "trainer-courses-list",
      label: "Courses",
      icon: "las la-house-damage",
      link: "/trainer-courses-list",
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
