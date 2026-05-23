import React, { useState } from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  Menu,
  Phone,
} from "lucide-react";

import logo from "../assets/logo.png";
import brandName from "../assets/brand-text.png";

import "../styles/navbar.css";

import { useAuth } from "../context/AuthContext";

import Drawer from "./Drawer";

function Navbar() {

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isAuthenticated } = useAuth();

  const role = user?.role;

  const closeAll = () => setOpen(false);

  const goTo = (path) => {

    closeAll();

    navigate(path);
  };

  const isActive = (path) =>
    location.pathname === path;

  const handleLogout = () => {

    logout();

    closeAll();

    navigate("/");
  };

  const getDashboardRoute = () => {

    if (role === "admin")
      return "/admin";

    if (role === "seller")
      return "/seller-dashboard";

    if (role === "builder")
      return "/builder-dashboard";

    if (role === "agent")
      return "/seller-dashboard";

    return "/";
  };

  return (
    <>
      {/* ====================================================== */}
      {/* ================= FULL STICKY HEADER ================= */}
      {/* ====================================================== */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 9999,
          background: "#fff",
        }}
      >

        {/* ====================================================== */}
        {/* ================= TOP BAR ============================ */}
        {/* ====================================================== */}

        <div
          style={{
            background: "#071133",
            color: "#fff",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >

          <div
            style={{
              maxWidth: "1280px",
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            <div>
              📍 Jabalpur, Madhya Pradesh • Local team • Quick response
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.12)",
                padding: "6px 14px",
                borderRadius: "999px",
              }}
            >

              <Phone size={15} />

              Call / WhatsApp:
              {" "}
              7415930089

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* ================= MAIN NAVBAR ======================= */}
        {/* ====================================================== */}

        <div
          className="navbar"
          style={{
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >

          {/* LEFT */}

          <div className="nav-left">

            <div
              className="logo-wrapper"
              onClick={() => navigate("/")}
            >

              <img
                src={logo}
                className="nav-logo"
                alt="logo"
              />

              <img
                src={brandName}
                className="brand-name-img"
                alt="brand"
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="nav-right">

            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={isActive("/about") ? "active" : ""}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={isActive("/contact") ? "active" : ""}
            >
              Contact
            </Link>

            {/* DASHBOARD */}

            {isAuthenticated &&
              role !== "buyer" && (

                <Link
                  to={getDashboardRoute()}
                  className={
                    isActive(getDashboardRoute())
                      ? "active"
                      : ""
                  }
                >

                  Dashboard

                </Link>
              )}

            {/* LOGIN */}

            {!isAuthenticated && (

              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >

                Login

              </button>
            )}

            {/* MENU */}

            <button
              className="menu-btn"
              onClick={() => setOpen(true)}
            >

              <Menu size={26} />

            </button>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= HEADER SPACER ====================== */}
      {/* ====================================================== */}

      <div style={{ height: "90px" }} />

      {/* ====================================================== */}
      {/* ================= DRAWER ============================= */}
      {/* ====================================================== */}

      <Drawer
        open={open}
        closeAll={closeAll}
        goTo={goTo}
        isAuthenticated={isAuthenticated}
        role={role}
        user={user}
        getDashboardRoute={getDashboardRoute}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;