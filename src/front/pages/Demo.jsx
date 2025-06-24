import React, { useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext.jsx";

const Demo = () => {
  const { store, actions } = useContext(SessionContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await actions.login(formData.email, formData.password);
      alert("Inicio de sesión exitoso");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registro fallido");

      await actions.login(formData.email, formData.password);
      alert("Registro exitoso");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres borrar tu cuenta?")) return;
    try {
      const res = await fetch("https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api/delete_account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      });
      if (res.ok) {
        actions.logout();
        alert("Cuenta eliminada");
      } else {
        const data = await res.json();
        alert(data.error || "Error al borrar cuenta");
      }
    } catch (err) {
      alert("Error en la solicitud");
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          isLogin ? handleLogin() : handleRegister();
        }}
      >
        {!isLogin && (
          <div className="mb-3">
            <label>Usuario:</label>
            <input name="username" value={formData.username} onChange={handleChange} className="form-control" />
          </div>
        )}
        <div className="mb-3">
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Contraseña:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link mt-2">
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>

      {store.token && (
        <div className="mt-4">
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑️ Borrar mi cuenta
          </button>
        </div>
      )}
    </div>
  );
};

export default Demo;
