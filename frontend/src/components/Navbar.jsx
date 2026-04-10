import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    closeAll();
    navigate("/login");
  };

  const handleSellClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (["seller", "agent", "builder"].includes(role)) {
      navigate("/add-property");
    } else {
      alert("Login as seller, agent or builder to add property.");
    }
  };

  return (
    <>
      {/* NAVBAR */}
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
        <div className="nav-center">
          <div className="search-box">
            <input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* DARK MODE */}
          <button className="icon-btn" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/about" className="login-btn">About</Link>
          <Link to="/chat" className="login-btn">Chat</Link>
          <Link to="/contact" className="login-btn">Contact</Link>

          {!token ? (
            <Link to="/login" className="login-btn">Login</Link>
          ) : (
            <button className="login-btn god-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAll}
            />

            <motion.div
              className="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="drawer-header">
                <X size={26} onClick={closeAll} />
              </div>

              {token && (
                <div className="drawer-profile">
                  <User size={32} />
                  <div>
                    <p>{user?.name}</p>
                    <span>{role}</span>
                  </div>
                </div>
              )}

              <div className="nav-item" onClick={() => goTo("/")}>
                <Home size={18} /> Home
              </div>

              <button className="nav-item" onClick={handleSellClick}>
                <Building size={18} /> Sell Property
              </button>

              <div className="nav-item" onClick={() => goTo("/saved")}>
                <Heart size={18} /> Saved
              </div>

              <div className="nav-item" onClick={() => goTo("/agent")}>
                <User size={18} /> Agents
              </div>

              <div className="nav-item" onClick={() => goTo("/builder")}>
                <Building size={18} /> Builders
              </div>

              <div className="nav-item" onClick={() => goTo("/about")}>
                About
              </div>

              <div className="nav-item" onClick={() => goTo("/chat")}>
                Chat
              </div>

              <div className="nav-item" onClick={() => goTo("/contact")}>
                Contact
              </div>

              {role === "admin" && (
                <div className="nav-item" onClick={() => goTo("/admin")}>
                  Admin Dashboard
                </div>
              )}

              {!token ? (
                <div className="nav-item" onClick={() => goTo("/login")}>
                  Login
                </div>
              ) : (
                <button className="drawer-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;