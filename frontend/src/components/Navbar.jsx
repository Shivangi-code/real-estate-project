import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, Search, User,
  Home, Building, Briefcase, Heart, Moon, Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar() {

  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const closeAll = () => {
    setOpen(false);
    setSubMenu(false);
  };

  const goTo = (path) => {
    closeAll();
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  // ✅ NEW: CLEAN LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    closeAll();
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="navbar god-nav">

        {/* LOGO */}
        <img
          src={logo}
          className="nav-logo"
          alt="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {/* SEARCH */}
        <div className="search-box god-search">
          <input placeholder="Search properties..." />
          <Search size={18} />
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* DARK MODE */}
          <button className="icon-btn" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* LOGIN / LOGOUT */}
          {!user ? (
            <button
              className="login-btn god-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="login-btn god-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {/* MENU */}
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>

        </div>
      </div>

      {/* ================= DRAWER ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="overlay god-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
            />

            {/* DRAWER */}
            <motion.div
              className="drawer god-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >

              {/* HEADER */}
              <div className="drawer-header">
                <X size={26} onClick={closeAll} />
              </div>

              {/* ================= MAIN MENU ================= */}
              {!subMenu && (
                <>
                  {/* PROFILE */}
                  {user && (
                    <div className="profile-card neon">
                      <User size={32} />
                      <div>
                        <p>{user.name}</p>
                        <span>{role}</span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`nav-item ${isActive("/") ? "active" : ""}`}
                    onClick={() => goTo("/")}
                  >
                    <Home size={18} /> Home
                  </div>

                  <div
                    className="nav-item"
                    onClick={() => setSubMenu(true)}
                  >
                    <Building size={18} /> Sell Property →
                  </div>

                  <div
                    className={`nav-item ${isActive("/saved") ? "active" : ""}`}
                    onClick={() => goTo("/saved")}
                  >
                    <Heart size={18} /> Saved
                  </div>

                  <div
                    className="nav-item"
                    onClick={() => goTo("/agent")}
                  >
                    <User size={18} /> Agents
                  </div>

                  <div
                    className="nav-item"
                    onClick={() => goTo("/builder")}
                  >
                    <Building size={18} /> Builders
                  </div>

                  {/* ADMIN */}
                  {role === "admin" && (
                    <div
                      className="nav-item"
                      onClick={() => goTo("/admin")}
                    >
                      Admin Dashboard
                    </div>
                  )}

                  {/* LOGIN / LOGOUT */}
                  {!user ? (
                    <div
                      className="nav-item"
                      onClick={() => goTo("/login")}
                    >
                      Login
                    </div>
                  ) : (
                    <button
                      className="drawer-btn logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  )}
                </>
              )}

              {/* ================= SUB MENU ================= */}
              {subMenu && (
                <motion.div
                  className="sub-drawer"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                >
                  <div className="sub-header">
                    <span
                      className="back-btn"
                      onClick={() => setSubMenu(false)}
                    >
                      ← Back
                    </span>
                  </div>

                  <h3 className="submenu-title">Login as</h3>

                  <div
                    className="nav-item"
                    onClick={() => goTo("/login/seller")}
                  >
                    <Briefcase size={18} /> Seller
                  </div>

                  <div
                    className="nav-item"
                    onClick={() => goTo("/login/agent")}
                  >
                    <User size={18} /> Agent
                  </div>

                  <div
                    className="nav-item"
                    onClick={() => goTo("/login/builder")}
                  >
                    <Building size={18} /> Builder
                  </div>
                </motion.div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;