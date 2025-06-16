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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <span className="navbar-brand fw-bold text-purple">🎵 Rythm & Blues</span>
      <div className="ms-auto d-flex gap-3">
        <Link to="/" className="nav-link text-secondary">Inicio</Link>
        <Link to="/cart" className="nav-link text-secondary">Carrito</Link>
        <Link to="/favorites" className="nav-link text-secondary">Favoritos</Link>
        {store.token ? (
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/login")}>
            Iniciar sesión / Crear cuenta
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
