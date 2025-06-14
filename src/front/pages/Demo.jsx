// Import necessary components from react-router-dom and other parts of the application.
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
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
        <div className="max-w-md mx-auto p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-800">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                className="w-full p-2 border rounded border-purple-300"
                required
              />
            )}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full p-2 border rounded border-purple-300"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full p-2 border rounded border-purple-300"
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
            >
              {isLogin ? "Entrar" : "Registrarse"}
            </button>
          </form>
          <button
            onClick={toggleForm}
            className="text-sm text-purple-600 mt-4 underline"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      ) : (
        <ul className="list-group">
          {store && store.todos?.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between"
              style={{ background: item.background }}
            >
              <Link to={`/single/${item.id}`}>Link to: {item.title}</Link>
              <p>Open file ./store.js to see the global store that contains and updates the list of colors</p>
              <button
                className="btn btn-success"
                onClick={() => dispatch({ type: "add_task", payload: { id: item.id, color: '#ffa500' } })}
              >
                Change Color
              </button>
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
