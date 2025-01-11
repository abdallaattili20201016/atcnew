import React from "react";
import { Route, Routes } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";

import Layout from "../Layout";

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route: any, idx: any) => (
            <Route
              key={idx}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
        <Route>
          {authProtectedRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={<Layout>{route.component}</Layout>}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
