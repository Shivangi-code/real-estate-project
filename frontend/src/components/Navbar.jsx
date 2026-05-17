import React, { useState, useEffect } from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  Menu,
  X,
  User,
  Home,
  LayoutDashboard,
  Moon,
  Sun,
  ShieldCheck,
  Building2,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import logo from "../assets/logo.png";
import brandName from "../assets/brand-text.png";

import "../styles/navbar.css";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isAuthenticated } = useAuth();

  const role = user?.role;

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const closeAll = () => setOpen(false);

  const goTo = (path) => {
    closeAll();
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

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
          <div className="logo-wrapper" onClick={() => navigate("/")}>
            
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

        {/* CENTER */}
        <div className="nav-center"></div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* DARK MODE */}
          <button
            className="icon-btn"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ABOUT */}
          <Link
            to="/about"
            className={isActive("/about") ? "active" : ""}
          >
            About
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            className={isActive("/contact") ? "active" : ""}
          >
            Contact
          </Link>

          {/* MY PROPERTIES */}
          {isAuthenticated && role !== "buyer" && (
            <button
              className="login-btn"
              onClick={() => navigate("/my-properties")}
            >
              <Building2 size={16} />
              My Properties
            </button>
          )}

          {/* USER PANEL */}
          {isAuthenticated && (
            <motion.div className="user-box">

              <div className="bg-slate-100 p-2 rounded-xl">
                <User size={18} />
              </div>

              <div className="leading-tight">
                <div className="font-semibold text-sm">
                  {user?.name || "User"}
                </div>
              </div>

            </motion.div>
          )}

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

          {/* LOGIN / LOGOUT */}
          {!isAuthenticated ? (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
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

      {/* ================= DRAWER ================= */}
      <AnimatePresence>

        {open && (
          <>

            <motion.div
              className="overlay"
              onClick={closeAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >

              <div className="drawer-header">
                <X
                  size={26}
                  onClick={closeAll}
                />
              </div>

              <div
                className="nav-item"
                onClick={() => goTo("/")}
              >
                <Home size={18} />
                Home
              </div>

              <div
                className="nav-item"
                onClick={() => goTo("/about")}
              >
                About
              </div>

              <div
                className="nav-item"
                onClick={() => goTo("/contact")}
              >
                Contact
              </div>

              {isAuthenticated && role !== "buyer" && (
                <div
                  className="nav-item"
                  onClick={() => goTo("/my-properties")}
                >
                  <Building2 size={18} />
                  My Properties
                </div>
              )}

              {isAuthenticated && role !== "buyer" && (
                <div
                  className="nav-item"
                  onClick={() => goTo(getDashboardRoute())}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </div>
              )}

              {isAuthenticated && (
                <div className="nav-item">
                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />
                  Verified User
                </div>
              )}

              {isAuthenticated ? (
                <button
                  className="drawer-btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <div
                  className="nav-item"
                  onClick={() => goTo("/login")}
                >
                  Login
                </div>
              )}

            </motion.div>
          </>
        )}

      </AnimatePresence>
    </>
  );
}

export default Navbar;