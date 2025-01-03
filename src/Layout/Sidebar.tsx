import React from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import logoLight from "../assets/images/logo-dark.png";
import VerticalLayout from "./VerticalLayouts/index";
import { Container } from "react-bootstrap";

const Sidebar = ({ layoutType }: any) => {
  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-light">
            <span className="logo-lg">
              <img src={logoLight} alt="" height="120" width="218" />
            </span>
          </Link>
        </div>
        <React.Fragment>
          <SimpleBar id="scrollbar" className="h-100">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <VerticalLayout layoutType={layoutType} />
              </ul>
            </Container>
          </SimpleBar>
          <div className="sidebar-background"></div>
        </React.Fragment>
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
