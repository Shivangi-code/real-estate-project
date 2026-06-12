import React from "react";

import {

  motion,

  AnimatePresence,

} from "framer-motion";

import {

  X,

  Home,

  LayoutDashboard,

  Building2,

  ShieldCheck,

  Info,

  Phone,

  User,

} from "lucide-react";

import "../styles/drawer.css";

// ======================================================
// ================= DRAWER =============================
// ======================================================

function Drawer({

  open,

  closeAll,

  goTo,

  isAuthenticated,

  role,

  user,

  getDashboardRoute,

  getPropertyRoute,

  handleLogout,

}) {

  // ======================================================
  // ================= ANIMATION ==========================
  // ======================================================

  const container = {

    hidden: {

      opacity: 0,
    },

    show: {

      opacity: 1,

      transition: {

        staggerChildren: 0.06,
      },
    },
  };

  const item = {

    hidden: {

      x: 18,

      opacity: 0,
    },

    show: {

      x: 0,

      opacity: 1,
    },
  };

  // ======================================================
  // ================= RETURN =============================
  // ======================================================

  return (

    <AnimatePresence>

      {open && (

        <>

          {/* ====================================================== */}
          {/* ================= OVERLAY ============================ */}
          {/* ====================================================== */}

          <motion.div

            className="drawer-overlay"

            onClick={closeAll}

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}
          />

          {/* ====================================================== */}
          {/* ================= PANEL ============================== */}
          {/* ====================================================== */}

          <motion.div

            className="drawer-panel"

            initial={{

              x: "100%",

              scale: 0.96,

              opacity: 0,
            }}

            animate={{

              x: 0,

              scale: 1,

              opacity: 1,
            }}

            exit={{

              x: "100%",

              scale: 0.96,

              opacity: 0,
            }}

            transition={{

              type: "spring",

              stiffness: 260,

              damping: 28,
            }}
          >

            {/* ====================================================== */}
            {/* ================= TOP ================================ */}
            {/* ====================================================== */}

            <div className="drawer-top">

              <div className="drawer-title">

                Navigation

              </div>

              <X

                size={24}

                className="close-icon"

                onClick={closeAll}
              />

            </div>

            {/* ====================================================== */}
            {/* ================= PROFILE ============================ */}
            {/* ====================================================== */}

            {isAuthenticated && (

              <motion.div

                className="drawer-profile"

                initial={{

                  y: -10,

                  opacity: 0,
                }}

                animate={{

                  y: 0,

                  opacity: 1,
                }}
              >

                <div className="profile-avatar">

                  <User size={18} />

                </div>

                <div>

                  <div className="profile-name">

                    {(
                      user?.name ||
                      "User"
                    ).toUpperCase()}

                  </div>

                  <div className="profile-role">

                    {role}

                  </div>

                </div>

              </motion.div>
            )}

            {/* ====================================================== */}
            {/* ================= LINKS ============================== */}
            {/* ====================================================== */}

            <motion.div

              className="drawer-links"

              variants={container}

              initial="hidden"

              animate="show"
            >

              {/* HOME */}

              <motion.div

                className="drawer-item"

                variants={item}

                onClick={() =>
                  goTo("/")
                }
              >

                <Home size={18} />

                Home

              </motion.div>

              {/* ABOUT */}

              <motion.div

                className="drawer-item"

                variants={item}

                onClick={() =>
                  goTo("/about")
                }
              >

                <Info size={18} />

                About

              </motion.div>

              {/* CONTACT */}

              <motion.div

                className="drawer-item"

                variants={item}

                onClick={() =>
                  goTo("/contact")
                }
              >

                <Phone size={18} />

                Contact

              </motion.div>

              {/* ====================================================== */}
              {/* ================= MY PROPERTIES ====================== */}
              {/* ====================================================== */}

              {isAuthenticated &&

                role !== "buyer" && (

                <motion.div

                  className="drawer-item"

                  variants={item}

                  onClick={() =>
                    goTo(
                      getPropertyRoute()
                    )
                  }
                >

                  <Building2 size={18} />

                  My Properties

                </motion.div>
              )}

              {/* ====================================================== */}
              {/* ================= DASHBOARD ========================== */}
              {/* ====================================================== */}

              {isAuthenticated &&

                role !== "buyer" && (

                <motion.div

                  className="drawer-item"

                  variants={item}

                  onClick={() =>
                    goTo(

                      getDashboardRoute()
                    )
                  }
                >

                  <LayoutDashboard size={18} />

                  Dashboard

                </motion.div>
              )}

              {/* ====================================================== */}
              {/* ================= VERIFIED BADGE ===================== */}
              {/* ====================================================== */}

              {isAuthenticated && (

                <motion.div

                  className="drawer-badge"

                  variants={item}
                >

                  <ShieldCheck size={16} />

                  Verified Account

                </motion.div>
              )}

            </motion.div>

            {/* ====================================================== */}
            {/* ================= BOTTOM ============================= */}
            {/* ====================================================== */}

            <div className="drawer-bottom">

              {isAuthenticated ? (

                <button

                  className="logout-btn"

                  onClick={handleLogout}
                >

                  Logout

                </button>

              ) : (

                <button

                  className="login-btn-drawer"

                  onClick={() =>
                    goTo(
                      "/login"
                    )
                  }
                >

                  Login

                </button>
              )}

            </div>

          </motion.div>

        </>
      )}

    </AnimatePresence>
  );
}

export default Drawer;