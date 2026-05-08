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

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role;

  // ✅ FIX: sync auth properly (no refresh needed)
  useEffect(() => {
    const syncAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken || null);
      } catch {
        setUser(null);
        setToken(null);
      }
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const closeAll = () => setOpen(false);

  const goTo = (path) => {
    closeAll();
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  // ✅ FIXED LOGOUT (no reload)
  const handleLogout = () => {
    localStorage.clear();

    setUser(null);
    setToken(null);

    window.dispatchEvent(new Event("storage"));

    closeAll();
    navigate("/");
  };

  const getDashboardRoute = () => {
    if (role === "admin") return "/admin";
    if (role === "seller") return "/seller";
    if (role === "builder") return "/builder";
    return "/";
  };

  return (
    <>
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
          <button className="icon-btn" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/about" className={isActive("/about") ? "active" : ""}>
            About
          </Link>

          <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
            Contact
          </Link>

          {/* DASHBOARD */}
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
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

          {/* MENU */}
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
                    <p>{user?.name || "User"}</p>
                    <span>{role}</span>
                  </div>
                </div>
              )}

              <div className="nav-item" onClick={() => goTo("/")}>
                <Home size={18} /> Home
              </div>

              {token && role !== "buyer" && (
                <div
                  className="nav-item"
                  onClick={() => goTo(getDashboardRoute())}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </div>
              )}

              <div className="nav-item" onClick={() => goTo("/about")}>
                About
              </div>

              <div className="nav-item" onClick={() => goTo("/contact")}>
                Contact
              </div>

              {!token ? (
                <div className="nav-item" onClick={() => goTo("/login")}>
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