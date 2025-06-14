import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.jsx"
import Navbar from "../components/Navbar.jsx"; // Asegúrate de que el nombre del archivo sea correcto
import Footer from "../components/Footer.jsx";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
