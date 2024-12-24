import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { createSelector } from "reselect";
import { getFirebaseBackend } from "../helpers/firebase_helper";
import avatar1 from "../assets/images/users/user-dummy-img.jpg"; // Fallback avatar

const ProfileDropdown = () => {
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string>(avatar1);
  const firebaseBackend = getFirebaseBackend();

  // Function to load the username from Firebase
  const loadUserName = async (uid: string) => {
    try {
      const data = await firebaseBackend.getUserDetailsByUid(uid);
      setUserName(data ? data.username : "Admin"); // Default to "Admin" if username is not found
      setUserImage(data ? data.picture : "");
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  // Load user details when component mounts or when `user` changes
  useEffect(() => {
    const authUser = sessionStorage.getItem("authUser");
    if (authUser) {
      const obj = JSON.parse(authUser);
      if (obj?.uid) loadUserName(obj.uid);
    }
  }, []);

  return (
    <React.Fragment>
      <Dropdown className="header-item">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            {/* Image */}
            <img
              className="rounded-circle header-profile-user"
              src={userImage} // Use profilePicture state
              alt="Header Avatar"
              onError={() => {
                console.error("Failed to load image, falling back to default.");
                setUserImage(avatar1); // Fallback to default avatar on error
              }}
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block fw-medium user-name-text fs-16">
                {userName || "Loading..."}{" "}
                {/* Display username or loading if not set */}
                <i className="las la-angle-down fs-12 ms-1"></i>
              </span>
            </span>
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item className="dropdown-item" href="/user-profile">
            <i className="bx bx-user fs-15 align-middle me-1"></i>{" "}
            <span key="t-profile">Profile</span>
          </Dropdown.Item>
          <div className="dropdown-divider"></div>
          <Dropdown.Item
            className="dropdown-item text-danger"
            onClick={async () => {
              await firebaseBackend.logout();
              window.location.href = "/login";
            }}
          >
            <i className="bx bx-power-off fs-15 align-middle me-1 text-danger"></i>{" "}
            <span key="t-logout">Logout</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
