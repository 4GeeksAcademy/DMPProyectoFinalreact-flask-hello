import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.jsx";
import SessionProvider from "./context/SessionContext.jsx";
import { StoreProvider } from "./hooks/useGlobalReducer.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </SessionProvider>
  </React.StrictMode>
);
