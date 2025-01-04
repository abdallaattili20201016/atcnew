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
      icon: "bi bi-people",
      link: "/users",
    },
    {
      id: "ViewCourses",
      label: "Courses",
      icon: "las la-th-list",
      link: "/ViewCourses",
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: "bi bi-megaphone",
      link: "/announcements-table",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },

    {
      id: "auditLog",
      label: "Audit Log",
      icon: "las la-house-damage",
      link: "/audit-log",
    },

    {
      id: "reports",
      label: "Reports",
      icon: "bi bi-printer",
      link: "/adminreports",
    },


    // {
    //   label: "More",
    //   isHeader: true,
    // },
    // {
    //   id: "aboutus",
    //   label: "About Us",
    //   icon: "las la-house-damage",
    //   link: "/aboutus",
    // },
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
      icon: "las la-th-list",
      link: "/trainer-courses-list",
    },
    {
      id: "TrainerAnnouncements",
      label: "Announcements",
      icon: "bi bi-megaphone",
      link: "/announcements-table",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },
    {
      id: "TrainerReports",
      label: "Reports",
      icon: "bi bi-printer",
      link: "/adminreports",
    },



    // {
    //   label: "More",
    //   isHeader: true,
    // },
    // {
    //   id: "aboutus",
    //   label: "About Us",
    //   icon: "las la-house-damage",
    //   link: "/aboutus",
    // },
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
      icon: "bi bi-book",
      link: "/trainee-courses-list",
    },

    {
      id: "messages",
      label: "Messages",
      icon: "las la-envelope",
      link: "/messages",
    },

    {
      id: "TrainerAnnouncements",
      label: "Announcements",
      icon: "bi bi-megaphone",
      link: "/announcements-table",
    },

    {
      id: "payment",
      label: "Payment",
      icon: "bi bi-credit-card",
      link: "/payment",
    },
    {
      id: "certificates",
      label: "certificates",
      icon: "bi bi-patch-check",
      link: "/certificates",
    },
    {
      label: "More",
      isHeader: true,
    },
    {
      id: "aboutus",
      label: "About Us",
      icon: "bi bi-info-circle",
      link: "/aboutus",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default { AdminNavdata, TrainerNavdata, TraineeNavdata };
