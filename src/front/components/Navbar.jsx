import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext.jsx";

const Navbar = () => {
  const { store, actions } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-purple-100 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-800">🎵 Rythm & Blues</h1>
      <div className="space-x-4">
        <Link to="/" className="text-purple-700 hover:underline">Inicio</Link>
        <Link to="/cart" className="text-purple-700 hover:underline">Carrito</Link>
        <Link to="/favorites" className="text-purple-700 hover:underline">Favoritos</Link>
        {store.token ? (
          <button
            onClick={handleLogout}
            className="text-purple-700 hover:underline"
          >
            Cerrar sesión
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-purple-700 hover:underline"
          >
            Iniciar sesión / Crear cuenta
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
