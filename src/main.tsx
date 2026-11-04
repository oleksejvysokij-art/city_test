import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/onest";
import "@fontsource-variable/oswald";
import "lenis/dist/lenis.css";
import App from "./App";
import "./styles.css";
import "./effects.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
