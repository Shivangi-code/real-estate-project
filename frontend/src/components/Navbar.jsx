import React, {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

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

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import logo from "../assets/logo.png";

import "../styles/navbar.css";

// ✅ AUTH CONTEXT
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const [open, setOpen] =
    useState(false);

  const [dark, setDark] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const navigate = useNavigate();

  const location = useLocation();

  // ✅ GLOBAL AUTH
  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const role = user?.role;

  // ================= DARK MODE =================
  useEffect(() => {

    document.body.classList.toggle(
      "dark",
      dark
    );

  }, [dark]);

  // ================= HELPERS =================
  const closeAll = () =>
    setOpen(false);

  const goTo = (path) => {

    closeAll();

    navigate(path);
  };

  const isActive = (path) =>
    location.pathname === path;

  // ✅ FIXED LOGOUT
  const handleLogout = () => {

    // clear auth instantly
    logout();

    // close mobile drawer
    closeAll();

    // ✅ redirect to homepage
    navigate("/");
  };

  // ================= DASHBOARD ROUTE =================
  const getDashboardRoute = () => {

    if (role === "admin") {
      return "/admin";
    }

    if (role === "seller") {
      return "/seller";
    }

    if (role === "builder") {
      return "/builder";
    }

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
            onClick={() =>
              navigate("/")
            }
          />
        </div>

        {/* CENTER SEARCH */}
        <div className="nav-center">

          <div className="search-box">

            <input
              placeholder="Search properties..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <Search size={18} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* DARK MODE */}
          <button
            className="icon-btn"
            onClick={() =>
              setDark(!dark)
            }
          >
            {dark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* ABOUT */}
          <Link
            to="/about"
            className={
              isActive("/about")
                ? "active"
                : ""
            }
          >
            About
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            className={
              isActive("/contact")
                ? "active"
                : ""
            }
          >
            Contact
          </Link>

          {/* DASHBOARD */}
          {isAuthenticated &&
            role !== "buyer" && (
              <button
                className="login-btn"
                onClick={() =>
                  navigate(
                    getDashboardRoute()
                  )
                }
              >
                Dashboard
              </button>
            )}

          {/* LOGIN / LOGOUT */}
          {!isAuthenticated ? (
            <button
              className="login-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>
          ) : (
            <button
              className="login-btn"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          )}

          {/* MOBILE MENU */}
          <button
            className="menu-btn"
            onClick={() =>
              setOpen(true)
            }
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="overlay"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeAll}
            />

            {/* DRAWER */}
            <motion.div
              className="drawer"
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
            >
              {/* HEADER */}
              <div className="drawer-header">

                <X
                  size={26}
                  onClick={closeAll}
                />
              </div>

              {/* PROFILE */}
              {isAuthenticated && (
                <div className="drawer-profile">

                  <User size={32} />

                  <div>
                    <p>
                      {user?.name ||
                        "User"}
                    </p>

                    <span>
                      {role}
                    </span>
                  </div>
                </div>
              )}

              {/* HOME */}
              <div
                className="nav-item"
                onClick={() =>
                  goTo("/")
                }
              >
                <Home size={18} />
                Home
              </div>

              {/* DASHBOARD */}
              {isAuthenticated &&
                role !== "buyer" && (
                  <div
                    className="nav-item"
                    onClick={() =>
                      goTo(
                        getDashboardRoute()
                      )
                    }
                  >
                    <LayoutDashboard
                      size={18}
                    />
                    Dashboard
                  </div>
                )}

              {/* ABOUT */}
              <div
                className="nav-item"
                onClick={() =>
                  goTo("/about")
                }
              >
                About
              </div>

              {/* CONTACT */}
              <div
                className="nav-item"
                onClick={() =>
                  goTo("/contact")
                }
              >
                Contact
              </div>

              {/* LOGIN / LOGOUT */}
              {!isAuthenticated ? (
                <div
                  className="nav-item"
                  onClick={() =>
                    goTo("/login")
                  }
                >
                  Login
                </div>
              ) : (
                <button
                  className="drawer-btn logout-btn"
                  onClick={
                    handleLogout
                  }
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