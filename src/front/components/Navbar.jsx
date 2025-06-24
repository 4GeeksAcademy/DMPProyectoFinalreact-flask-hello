import React, { useContext, useState } from "react";
import { SessionContext } from "../context/SessionContext";

const Navbar = () => {
  const { store, actions } = useContext(SessionContext);
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await actions.login(email, password);
      setShowModal(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Usuario registrado correctamente");
        setShowRegister(false);
        setEmail("");
        setPassword("");
        setUsername("");
      } else {
        alert(data.error || "Error al registrar");
      }
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand">🎶 Mi Tienda de Música</span>
        <div className="ms-auto d-flex align-items-center">
          {!store.token ? (
            <>
              <button className="btn btn-outline-light me-2" onClick={() => setShowModal(true)}>Iniciar sesión</button>
              <button className="btn btn-light" onClick={() => setShowRegister(true)}>Registrarse</button>
            </>
          ) : (
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
                {store.user?.username || "Usuario"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item text-danger" onClick={actions.deleteUser}>Eliminar cuenta</button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={actions.logout}>Cerrar sesión</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de Login */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form onSubmit={handleLogin} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Iniciar sesión</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="form-control" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Entrar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {showRegister && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form onSubmit={handleRegister} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrarse</h5>
                <button type="button" className="btn-close" onClick={() => setShowRegister(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input className="form-control mb-2" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="form-control" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Registrar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
