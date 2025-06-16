import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [store, setStore] = useState({
    token: null,
    user: null,
    userId: null,
  });

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");
    const savedUserId = sessionStorage.getItem("user_id");

    if (savedToken && savedUser) {
      setStore({
        token: savedToken,
        user: JSON.parse(savedUser),
        userId: parseInt(savedUserId),
      });
    }
  }, []);

  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("user_id", userData.id);
    setStore({ token, user: userData, userId: userData.id });
  };

  const logout = () => {
    sessionStorage.clear();
    setStore({ token: null, user: null, userId: null });
  };

  const actions = { login, logout };

  return (
    <SessionContext.Provider value={{ store, actions }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
