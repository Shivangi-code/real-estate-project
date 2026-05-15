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
  ShieldCheck,
  Hash,
  Building2,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import logo from "../assets/logo.png";

import "../styles/navbar.css";

import { useAuth } from "../context/AuthContext";

function Navbar() {

  const [open, setOpen] =
    useState(false);

  const [dark, setDark] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const role =
    user?.role;

  const uniqueUserId =
    user?.uniqueUserId;

  // ======================================================
  // ================= DARK MODE ==========================
  // ======================================================

  useEffect(() => {

    document.body.classList.toggle(
      "dark",
      dark
    );

  }, [dark]);

  // ======================================================
  // ================= HELPERS ============================
  // ======================================================

  const closeAll = () =>
    setOpen(false);

  const goTo = (path) => {

    closeAll();

    navigate(path);
  };

  const isActive = (path) =>
    location.pathname === path;

  // ======================================================
  // ================= LOGOUT =============================
  // ======================================================

  const handleLogout = () => {

    logout();

    closeAll();

    navigate("/");
  };

  // ======================================================
  // ================= DASHBOARD ROUTE ====================
  // ======================================================

  const getDashboardRoute =
    () => {

      if (
        role === "admin"
      ) {

        return "/admin";
      }

      if (
        role === "seller"
      ) {

        return "/seller-dashboard";
      }

      if (
        role === "builder"
      ) {

        return "/builder-dashboard";
      }

      if (
        role === "agent"
      ) {

        return "/seller-dashboard";
      }

      return "/";
    };

  // ======================================================
  // ================= ROLE COLOR =========================
  // ======================================================

  const roleColor =
    () => {

      if (
        role === "admin"
      ) {

        return "bg-red-100 text-red-700";
      }

      if (
        role === "seller"
      ) {

        return "bg-blue-100 text-blue-700";
      }

      if (
        role === "builder"
      ) {

        return "bg-orange-100 text-orange-700";
      }

      if (
        role === "agent"
      ) {

        return "bg-purple-100 text-purple-700";
      }

      return "bg-slate-100 text-slate-700";
    };

  return (
    <>
      {/* ====================================================== */}
      {/* ================= NAVBAR ============================= */}
      {/* ====================================================== */}

      <div className="navbar god-nav">

        {/* LEFT */}
        <div className="nav-left">

          <motion.img
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            src={logo}
            className="nav-logo cursor-pointer"
            alt="logo"
            onClick={() =>
              navigate("/")
            }
          />

        </div>

        {/* SEARCH */}
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

          {/* MY PROPERTIES */}
          {isAuthenticated &&
            role !== "buyer" && (

              <button
                className="login-btn flex items-center gap-2"
                onClick={() =>
                  navigate(
                    "/my-properties"
                  )
                }
              >

                <Building2 size={16} />

                My Properties

              </button>
            )}

          {/* USER PANEL */}
          {isAuthenticated && (

            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="hidden lg:flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm"
            >

              {/* ICON */}
              <div className="bg-slate-100 p-2 rounded-xl">

                <User size={18} />

              </div>

              {/* USER INFO */}
              <div className="leading-tight">

                <div className="font-semibold text-sm">

                  {user?.name ||
                    "User"}

                </div>

                <div className="flex items-center gap-2 mt-1">

                  <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${roleColor()}`}>

                    {role}

                  </span>

                  {uniqueUserId && (

                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">

                      <Hash size={12} />

                      {uniqueUserId}

                    </span>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* DASHBOARD */}
          {isAuthenticated &&
            role !== "buyer" && (

              <button
                className="login-btn flex items-center gap-2"
                onClick={() =>
                  navigate(
                    getDashboardRoute()
                  )
                }
              >

                <LayoutDashboard size={16} />

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

      {/* ====================================================== */}
      {/* ================= MOBILE DRAWER ====================== */}
      {/* ====================================================== */}

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

                  <div className="bg-slate-100 p-4 rounded-2xl">

                    <User size={32} />

                  </div>

                  <div>

                    <p className="font-bold text-lg">

                      {user?.name ||
                        "User"}

                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">

                      <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${roleColor()}`}>

                        {role}

                      </span>

                      {uniqueUserId && (

                        <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">

                          <Hash size={12} />

                          {uniqueUserId}

                        </span>
                      )}

                    </div>

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

              {/* MY PROPERTIES */}
              {isAuthenticated &&
                role !== "buyer" && (

                  <div
                    className="nav-item"
                    onClick={() =>
                      goTo(
                        "/my-properties"
                      )
                    }
                  >

                    <Building2 size={18} />

                    My Properties

                  </div>
                )}

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

                    <LayoutDashboard size={18} />

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

              {/* VERIFIED */}
              {isAuthenticated && (

                <div className="nav-item">

                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />

                  Verified User

                </div>
              )}

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