import React, { createContext, useState } from "react";

export const SessionContext = createContext();

const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

export const SessionProvider = ({ children }) => {
  const [store, setStore] = useState({
    token: sessionStorage.getItem("token") || null,
    user: JSON.parse(sessionStorage.getItem("user")) || null
  });

  const setToken = (token) => {
    sessionStorage.setItem("token", token);
    setStore((prev) => ({ ...prev, token }));
  };

  const setUser = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    setStore((prev) => ({ ...prev, user }));
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error en login");
    }

    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    sessionStorage.clear();
    setStore({ token: null, user: null });
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(`${API}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar cuenta");
      }

      logout();
      alert("Cuenta eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar cuenta:", err.message);
      alert("No se pudo eliminar la cuenta");
    }
  };

  // ✅ Manejo de expiración de token
  const handleTokenExpiration = (res) => {
    if (res && res.status === 401) {
      console.warn("Token expirado o inválido. Cerrando sesión...");
      logout();
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    }
  };

  return (
    <SessionContext.Provider
      value={{
        store,
        actions: {
          setToken,
          setUser,
          login,
          logout,
          deleteUser,
          handleTokenExpiration // ✅ exportado
        }
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
