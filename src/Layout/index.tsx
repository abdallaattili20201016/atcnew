import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import withRouter from "../Common/withRouter";

interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Sidebar />
        <Header />
        <div className="main-content">
          {props.children}
          {/* <Footer /> */}
        </div>
      </div>
      {/* <RightSidebar /> */}
    </React.Fragment>
  );
};

export default withRouter(Layout);
