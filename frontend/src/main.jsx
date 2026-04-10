import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
<<<<<<< HEAD
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
=======
import App from "./App";

// Import styles
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/layout.css";
import "./index.css";

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);