import React from "react";
import { SessionContext } from "../context/SessionContext.jsx";


const Footer = () => {
  return (
    <footer className="bg-purple-100 text-purple-700 text-center py-4 mt-8 shadow-inner">
      <p className="text-sm">&copy; {new Date().getFullYear()} Music Store. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;