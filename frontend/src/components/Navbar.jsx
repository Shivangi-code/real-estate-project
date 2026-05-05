import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  Home,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");
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
    localStorage.clear();
    closeAll();
    navigate("/");
  };

  const getDashboardRoute = () => {
    if (role === "admin") return "/admin";
    if (role === "seller") return "/seller";
    if (role === "agent") return "/agent";
    if (role === "builder") return "/builder";
    return "/";
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar god-nav">
        {/* LEFT */}
        <div className="nav-left">
          <img
            src={logo}
            className="nav-logo"
            alt="logo"
            onClick={() => navigate("/")}
          />
        </div>

        {/* CENTER SEARCH */}
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

          {/* DASHBOARD BUTTON */}
          {token && role !== "buyer" && (
            <button
              className="login-btn"
              onClick={() => navigate(getDashboardRoute())}
            >
              Dashboard
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          {!token ? (
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
                <X
                  size={26}
                  onClick={closeAll}
                  style={{ cursor: "pointer" }}
                />
              </div>

              {/* PROFILE */}
              {token && (
                <div className="drawer-profile">
                  <User size={32} />
                  <div>
                    <p>{user?.name || "User"}</p>
                    <span>{role}</span>
                  </div>
                </div>
              )}

              {/* HOME */}
              <div
                className="nav-item"
                onClick={() => goTo("/")}
              >
                <Home size={18} /> Home
              </div>

              {/* DASHBOARD */}
              {token && role !== "buyer" && (
                <div
                  className="nav-item"
                  onClick={() => goTo(getDashboardRoute())}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </div>
              )}

              {/* ABOUT */}
              <div
                className="nav-item"
                onClick={() => goTo("/about")}
              >
                About
              </div>

              {/* CONTACT */}
              <div
                className="nav-item"
                onClick={() => goTo("/contact")}
              >
                Contact
              </div>

              {/* LOGIN / LOGOUT */}
              {!token ? (
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;