import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RPlaceApp from "./RPlaceApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RPlaceApp />
  </StrictMode>
);
