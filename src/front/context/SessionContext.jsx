import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [store, setStore] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken) {
      setStore({
        token: savedToken,
        user: savedUser ? JSON.parse(savedUser) : null,
      });
    }
  }, []);

  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setStore({ token, user: userData });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setStore({ token: null, user: null });
  };

  const actions = { login, logout };

  return (
    <SessionContext.Provider value={{ store, actions }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
