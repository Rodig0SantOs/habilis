import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import RouterApp from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterApp>
      <App />
    </RouterApp>
  </StrictMode>
);
