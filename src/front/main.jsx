import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.jsx";
import { StoreProvider } from "./hooks/useGlobalReducer.jsx";
import { SessionProvider } from "./context/SessionContext.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StoreProvider>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </StoreProvider>
);
