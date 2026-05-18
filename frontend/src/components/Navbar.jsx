import React, { useState } from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  Menu,
  LayoutDashboard,
} from "lucide-react";

import logo from "../assets/logo.png";
import brandName from "../assets/brand-text.png";

import "../styles/navbar.css";

import { useAuth } from "../context/AuthContext";

// ✅ IMPORT DRAWER
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

    if (role === "admin") return "/admin";
    if (role === "seller") return "/seller-dashboard";
    if (role === "builder") return "/builder-dashboard";
    if (role === "agent") return "/seller-dashboard";

    return "/";
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="navbar">

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
          {isAuthenticated && role !== "buyer" && (
            <button
              className="login-btn"
              onClick={() => navigate(getDashboardRoute())}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
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

          {/* MENU BUTTON */}
          <button
            className="menu-btn"
            onClick={() => setOpen(true)}
          >
            <Menu size={26} />
          </button>

        </div>
      </div>

      {/* ================= DRAWER (FIXED CONNECTION) ================= */}
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