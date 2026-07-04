import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

// ✅ AUTH CONTEXT
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/layout.css";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>

      {/* ✅ GLOBAL AUTH */}
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);