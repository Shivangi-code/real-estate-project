import React, {

  useState,

} from "react";

import {

  useNavigate,

  useLocation,

  Link,

} from "react-router-dom";

import {

  Menu,

} from "lucide-react";

import logo from "../assets/logo.png";
import brandName from "../assets/brand-text.png";

import "../styles/navbar.css";

import { useAuth } from "../context/AuthContext";

// ======================================================
// ================= DRAWER =============================
// ======================================================

import Drawer from "./Drawer";

// ======================================================
// ================= NAVBAR =============================
// ======================================================

function Navbar() {

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [open, setOpen] =
    useState(false);

  // ======================================================
  // ================= ROUTER =============================
  // ======================================================

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ======================================================
  // ================= AUTH ===============================
  // ======================================================

  const {

    user,

    logout,

    isAuthenticated,

  } = useAuth();

  // ======================================================
  // ================= ROLE ===============================
  // ======================================================

  const role =
    user?.role;

  // ======================================================
  // ================= CLOSE ==============================
  // ======================================================

  const closeAll =
    () => setOpen(false);

  // ======================================================
  // ================= NAVIGATE ===========================
  // ======================================================

  const goTo =
    (path) => {

      closeAll();

      navigate(path);
    };

  // ======================================================
  // ================= ACTIVE ROUTE =======================
  // ======================================================

  const isActive =
    (path) =>

      location.pathname ===
      path;

  // ======================================================
  // ================= LOGOUT =============================
  // ======================================================

  const handleLogout =
    () => {

      logout();

      closeAll();

      navigate("/");
    };

  // ======================================================
  // ================= DASHBOARD ROUTE ====================
  // ======================================================

  const getDashboardRoute =
    () => {

      // ================= ADMIN =================

      if (
        role === "admin"
      ) {

        return "/admin";
      }

      // ================= SELLER ===============

      if (
        role === "seller"
      ) {

        return "/seller-dashboard";
      }

      // ================= BUILDER ==============

      if (
        role === "builder"
      ) {

        return "/builder-dashboard";
      }

      // ================= AGENT ================

      if (
        role === "agent"
      ) {

        return "/seller-dashboard";
      }

      return "/";
    };

  // ======================================================
  // ================= PROPERTY ROUTE =====================
  // ======================================================

  const getPropertyRoute =
    () => {

      // ================= ADMIN =================

      if (
        role === "admin"
      ) {

        return "/admin-properties";
      }

      // ================= BUILDER ===============

      if (
        role === "builder"
      ) {

        return "/builder-properties";
      }

      // ================= SELLER / AGENT ========

      if (

        role === "seller" ||

        role === "agent"
      ) {

        return "/my-properties";
      }

      return "/";
    };

  // ======================================================
  // ================= RETURN =============================
  // ======================================================

  return (

    <>

      {/* ====================================================== */}
      {/* ================= NAVBAR ============================= */}
      {/* ====================================================== */}

      <div className="navbar">

        {/* ====================================================== */}
        {/* ================= LEFT =============================== */}
        {/* ====================================================== */}

        <div className="nav-left">

          <div

            className="logo-wrapper"

            onClick={() =>
              navigate("/")
            }
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

        {/* ====================================================== */}
        {/* ================= RIGHT ============================== */}
        {/* ====================================================== */}

        <div className="nav-right">

          {/* HOME */}

          <Link

            to="/"

            className={

              isActive("/")
                ? "active"
                : ""
            }
          >

            Home

          </Link>

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

          {/* ====================================================== */}
          {/* ================= MY PROPERTIES ====================== */}
          {/* ====================================================== */}

          {isAuthenticated &&

            role !== "buyer" && (

            <Link

              to={getPropertyRoute()}

              className={

                isActive(
                  getPropertyRoute()
                )

                  ? "active"

                  : ""
              }
            >

              My Properties

            </Link>
          )}

          {/* ====================================================== */}
          {/* ================= DASHBOARD ========================== */}
          {/* ====================================================== */}

          {isAuthenticated &&

            role !== "buyer" && (

            <Link

              to={getDashboardRoute()}

              className={

                isActive(
                  getDashboardRoute()
                )

                  ? "active"

                  : ""
              }
            >

              Dashboard

            </Link>
          )}

          {/* ====================================================== */}
          {/* ================= LOGIN ============================== */}
          {/* ====================================================== */}

          {!isAuthenticated && (

            <button

              className="login-btn"

              onClick={() =>
                navigate(
                  "/login"
                )
              }
            >

              Login

            </button>
          )}

          {/* ====================================================== */}
          {/* ================= MENU BUTTON ======================== */}
          {/* ====================================================== */}

          <button

            className="menu-btn"

            onClick={() =>
              setOpen(true)
            }
          >

            <Menu

              size={24}

              strokeWidth={2.4}
            />

          </button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= DRAWER ============================= */}
      {/* ====================================================== */}

      <Drawer

        open={open}

        closeAll={closeAll}

        goTo={goTo}

        isAuthenticated={
          isAuthenticated
        }

        role={role}

        user={user}

        getDashboardRoute={
          getDashboardRoute
        }

        getPropertyRoute={
          getPropertyRoute
        }

        handleLogout={
          handleLogout
        }
      />

    </>
  );
}

export default Navbar;