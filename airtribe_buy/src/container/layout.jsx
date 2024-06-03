// components/Layout.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/header";

const Layout = () => {
  const location = useLocation();
  const noHeaderRoutes = ["/login", "/register"];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
