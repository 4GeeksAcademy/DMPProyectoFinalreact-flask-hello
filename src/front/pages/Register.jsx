import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext.jsx";

const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { actions } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      // Registro
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error en el registro");
        setLoading(false);
        return;
      }

      // Login automático
      const loginRes = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        alert("Registrado correctamente, pero error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Guardar sesión
      actions.setUser(loginData.user);
      actions.setToken(loginData.token);
      sessionStorage.setItem("token", loginData.token);

      navigate("/");
    } catch (err) {
      console.error("Error en el registro:", err);
      alert("No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;
