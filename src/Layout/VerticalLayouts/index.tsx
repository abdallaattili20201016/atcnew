import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withRouter from "../../Common/withRouter";

import { withTranslation } from "react-i18next";

// Import Data
import navdata from "../LayoutMenuData";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const VerticalLayout = (props: any) => {
  const [navData, setNavData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load user details when component mounts or when `user` changes
  useEffect(() => {
    setLoading(true);

    const user_details = sessionStorage.getItem("user_details");
    if (user_details) {
      const user = JSON.parse(user_details);
      if (user.status === 1) {
        setNavData(navdata.AdminNavdata().props.children);
      }
      if (user.role === "trainer") {
        setNavData(navdata.TrainerNavdata().props.children);
      }
      if (user.role === "trainee") {
        setNavData(navdata.TraineeNavdata().props.children);
      }
    }
    setLoading(false);
  }, []);

  return (
    <React.Fragment>
      {/* menu Items */}
      {loading ? (
        <Spinner animation="border" size="sm" role="status" className="me-2" />
      ) : (
        (navData || []).map((item: any, key: number) => {
          return (
            <React.Fragment key={key}>
              {/* Main Header */}
              {item["isHeader"] ? (
                <li className="menu-title">
                  <span>{props.t(item.label)} </span>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    to={item.link ? item.link : "/"}
                    className="nav-link menu-link"
                  >
                    <i className={item.icon}></i>{" "}
                    <span>{props.t(item.label)}</span>
                    {item.badgeName ? (
                      <span
                        className={
                          "badge badge-pill badge-soft-" + item.badgeColor
                        }
                        data-key="t-new"
                      >
                        {item.badgeName}
                      </span>
                    ) : null}
                  </Link>
                </li>
              )}
            </React.Fragment>
          );
        })
      )}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
