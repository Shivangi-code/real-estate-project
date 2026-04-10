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

<<<<<<< HEAD
  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const closeAll = () => {
    setOpen(false);
    setSubMenu(false);
=======
  const handleSellClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "seller" || role === "agent" || role === "builder") {
      navigate("/add-property");
    } else {
      alert("Please login as seller, agent or builder to add property.");
    }
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
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

<<<<<<< HEAD
        {/* SEARCH */}
        <div className="search-box god-search">
          <input placeholder="Search properties..." />
          <Search size={18} />
=======
        {/* CENTER SEARCH */}
        <div className="nav-center">
          <div className="search-box">
            <span className="location-fixed">Jabalpur</span>
            <input
              type="text"
              placeholder="Search locality, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} />
          </div>
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
        </div>

        {/* RIGHT BUTTONS */}
        <div className="nav-right">

<<<<<<< HEAD
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
=======
          <Link to="/about" className="login-btn">
            About Us
          </Link>

          {/* ✅ NEW */}
          <Link to="/chat" className="login-btn">
            Chat
          </Link>

          <Link to="/contact" className="login-btn">
            Contact
          </Link>

          {/* Login / Logout */}
          {!token ? (
            <Link to="/login" className="login-btn">
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
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

<<<<<<< HEAD
          {/* MENU */}
=======
          {/* Mobile Menu Button */}
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* DRAWER (Mobile Menu) */}
      <div className={`drawer ${open ? "active" : ""}`}>

        {/* HEADER */}
        <div className="drawer-header">
          <X size={26} onClick={() => setOpen(false)} />
        </div>

        {/* PROFILE */}
        {token && (
          <div className="drawer-profile">
            <User size={32} />
            <div>
              <p className="profile-name">Logged In</p>
              <p className="profile-role">{role}</p>
            </div>
          </div>
        )}

        {/* LINKS */}
        <Link to="/" onClick={() => setOpen(false)}>
          Buy Property
        </Link>

        <button onClick={handleSellClick} className="drawer-btn">
          Sell Property
        </button>

        {/* USER OPTIONS */}
        {token && (
          <>
            <Link to="/my-properties" onClick={() => setOpen(false)}>
              My Properties
            </Link>
            <Link to="/saved" onClick={() => setOpen(false)}>
              Saved Properties
            </Link>
          </>
        )}

        <Link to="/agent" onClick={() => setOpen(false)}>
          Agents
        </Link>

        <Link to="/builder" onClick={() => setOpen(false)}>
          Builders
        </Link>

        <Link to="/about" onClick={() => setOpen(false)}>
          About Us
        </Link>

        {/* ✅ NEW */}
        <Link to="/chat" onClick={() => setOpen(false)}>
          Chat
        </Link>

        <Link to="/contact" onClick={() => setOpen(false)}>
          Contact
        </Link>

        {/* ADMIN */}
        {role === "admin" && (
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin Dashboard
          </Link>
        )}

        {/* LOGIN / LOGOUT */}
        {!token ? (
          <Link to="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
        ) : (
          <button className="drawer-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
    </>
  );
}

export default Navbar;