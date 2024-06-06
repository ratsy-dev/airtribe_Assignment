// components/Layout.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/header";
import { DataProvider } from "../components/context/context";

const Layout = () => {
  const location = useLocation();
  const noHeaderRoutes = ["/login", "/register"];

  return (
    <DataProvider>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <main>
        <Outlet />
      </main>
    </DataProvider>
  );
};

export default Layout;
