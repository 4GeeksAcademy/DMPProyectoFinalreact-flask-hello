import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

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
    const res = await fetch("https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api/login", {
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

  return (
    <SessionContext.Provider value={{ store, actions: { setToken, setUser, login, logout } }}>
      {children}
    </SessionContext.Provider>
  );
};
