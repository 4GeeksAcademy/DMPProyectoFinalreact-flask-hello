import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";

// Construye correctamente la URL del backend, evitando doble slash
const buildUrl = (path) => {
  const base = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); // quita barra final si la hay
  return `${base}${path}`;
};

export const Demo = () => {
  const { store, dispatch } = useGlobalReducer();
  const { actions } = useContext(SessionContext);
  const navigate = useNavigate();

  const [mostrarLogin, setMostrarLogin] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const toggleModo = () => {
    setMostrarLogin(!mostrarLogin);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({ username: "", email: "", password: "" });
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin ? "/login" : "/register";
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const res = await fetch(buildUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        actions.login(data.token, data.user);
        navigate("/");
      } else {
        setError(data.error || "Error de autenticación");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <button onClick={toggleModo} className="btn btn-outline-secondary">
          {mostrarLogin ? "Ver lista de tareas" : "Ir a Login / Registro"}
        </button>
      </div>

      {mostrarLogin ? (
        <div className="max-w-md mx-auto p-4 bg-light rounded shadow">
          <h2 className="text-center mb-4 text-primary">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  className="form-control"
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="form-control"
                required
              />
            </div>
            {error && <p className="text-danger small">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? "Entrar" : "Registrarse"}
            </button>
          </form>
          <button
            onClick={toggleForm}
            className="btn btn-link text-center d-block mt-3"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      ) : (
        <ul className="list-group">
          {store?.todos?.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between"
              style={{ background: item.background }}
            >
              <Link to={`/single/${item.id}`}>Link to: {item.title}</Link>
              <button
                className="btn btn-success"
                onClick={() =>
                  dispatch({ type: "add_task", payload: { id: item.id, color: "#ffa500" } })
                }
              >
                Cambiar color
              </button>
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link to="/">
        <button className="btn btn-primary">Volver al Home</button>
      </Link>
    </div>
  );
};
