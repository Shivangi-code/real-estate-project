import {
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {

  LayoutDashboard,

  Clock3,

  CheckCircle,

  XCircle,

  ShieldCheck,

  Building2,

  Users,

  BarChart3,

  Sparkles,

  Trash2,

  PlusSquare,

  Menu,

  X,

  ImageIcon,

  Activity,

  Layers3,

} from "lucide-react";

// ======================================================
// ================= SAFE USER PARSER ===================
// ======================================================

const getSafeUser = () => {

  try {

    return JSON.parse(

      localStorage.getItem(
        "user"
      ) || "{}"
    );

  } catch (error) {

    console.log(
      "User Parse Error ❌",
      error
    );

    return {};
  }
};

export default function AdminDashboard() {

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // ======================================================
  // ================= USER ===============================
  // ======================================================

  const user =
    useMemo(
      () => getSafeUser(),
      []
    );

  // ======================================================
  // ================= NAV ACTIVE CLASS ===================
  // ======================================================

  const navClass = ({
    isActive,
  }) =>

    `

      flex
      items-center
      gap-3

      px-4
      py-3

      rounded-2xl

      font-medium

      transition-all
      duration-200

      border

      ${
        isActive

          ? `
              bg-slate-900
              text-white
              border-slate-900
              shadow-lg
            `

          : `
              text-slate-600
              border-transparent
              hover:bg-slate-100
              hover:text-slate-900
            `
      }

    `;

  // ======================================================
  // ================= CLOSE MOBILE MENU ==================
  // ======================================================

  const closeMobileMenu = () => {

    setMobileOpen(
      false
    );
  };

  return (

    <>

      {/* ====================================================== */}
      {/* ================= MOBILE HEADER ====================== */}
      {/* ====================================================== */}

      <div
        className="

          lg:hidden

          fixed
          top-[100px]
          left-0
          right-0

          z-40

          bg-white/95
          backdrop-blur-md

          border-b
          border-slate-200

          px-4
          py-3

          flex
          items-center
          justify-between

          shadow-sm
        "
      >

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div
            className="
              bg-slate-900
              text-white
              p-2
              rounded-xl
            "
          >

            <Building2 size={18} />

          </div>

          <div>

            <h2
              className="
                font-bold
                text-slate-900
              "
            >

              Admin Panel

            </h2>

            <p
              className="
                text-xs
                text-slate-500
              "
            >

              Moderation CRM

            </p>

          </div>

        </div>

        {/* RIGHT */}
        <button

          onClick={() =>
            setMobileOpen(
              true
            )
          }

          className="

            p-2

            rounded-xl

            bg-slate-100

            hover:bg-slate-200

            transition
          "
        >

          <Menu size={22} />

        </button>

      </div>

      {/* ====================================================== */}
      {/* ================= MAIN LAYOUT ======================== */}
      {/* ====================================================== */}

      <div
        className="

          min-h-screen
          w-full

          flex

          bg-slate-100
        "
      >

        {/* ====================================================== */}
        {/* ================= MOBILE OVERLAY ===================== */}
        {/* ====================================================== */}

        {mobileOpen && (

          <div

            className="
              fixed
              inset-0

              bg-black/40

              z-40

              lg:hidden
            "

            onClick={
              closeMobileMenu
            }
          />
        )}

        {/* ====================================================== */}
        {/* ================= SIDEBAR ============================ */}
        {/* ====================================================== */}

        <aside
          className={`

            fixed
            lg:static

            top-0
            left-0

            z-50

            w-[290px]
            sm:w-80

            h-screen

            bg-white

            border-r
            border-slate-200

            flex
            flex-col

            transition-transform
            duration-300

            shadow-xl
            lg:shadow-none

            overflow-hidden

            ${

              mobileOpen

                ? "translate-x-0"

                : "-translate-x-full lg:translate-x-0"
            }

          `}
        >

          {/* ====================================================== */}
          {/* ================= SIDEBAR SCROLL ===================== */}
          {/* ====================================================== */}

          <div
            className="

              h-full

              overflow-y-auto

              px-4
              sm:px-6

              py-4

              scrollbar-thin
            "
          >

            {/* ====================================================== */}
            {/* ================= MOBILE CLOSE ======================= */}
            {/* ====================================================== */}

            <div
              className="
                lg:hidden

                flex
                justify-end

                mb-4
              "
            >

              <button

                onClick={
                  closeMobileMenu
                }

                className="

                  p-2

                  rounded-xl

                  bg-slate-100

                  hover:bg-slate-200

                  transition
                "
              >

                <X size={20} />

              </button>

            </div>

            {/* ====================================================== */}
            {/* ================= BRAND ============================== */}
            {/* ====================================================== */}

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <div
                  className="
                    bg-slate-900
                    text-white
                    p-3
                    rounded-2xl
                  "
                >

                  <Building2 size={22} />

                </div>

                <div>

                  <h1
                    className="

                      text-xl
                      sm:text-2xl

                      font-bold

                      text-slate-900
                    "
                  >

                    Admin Panel

                  </h1>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    Real Estate CRM

                  </p>

                </div>

              </div>

            </div>

            {/* ====================================================== */}
            {/* ================= SYSTEM STATUS ====================== */}
            {/* ====================================================== */}

            <div
              className="

                grid
                grid-cols-2

                gap-3

                mb-7
              "
            >

              <div
                className="
                  bg-slate-50
                  rounded-2xl
                  p-4
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-500
                    mb-1
                  "
                >

                  System

                </p>

                <p
                  className="
                    font-bold
                    text-slate-900
                  "
                >

                  Active

                </p>

              </div>

              <div
                className="
                  bg-slate-50
                  rounded-2xl
                  p-4
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-500
                    mb-1
                  "
                >

                  Moderation

                </p>

                <p
                  className="
                    font-bold
                    text-green-600
                  "
                >

                  Live

                </p>

              </div>

            </div>

            {/* ====================================================== */}
            {/* ================= MAIN NAVIGATION ==================== */}
            {/* ====================================================== */}

            <div
              className="
                mb-3
                px-2

                text-xs
                uppercase
                tracking-wider

                text-slate-400

                font-semibold
              "
            >

              Dashboard

            </div>

            <nav
              className="
                space-y-2
              "
            >

              {/* OVERVIEW */}
              <NavLink

                to="/admin"

                end

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <LayoutDashboard size={18} />

                <span>
                  Overview
                </span>

              </NavLink>

              {/* ANALYTICS */}
              <NavLink

                to="/admin/analytics"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <BarChart3 size={18} />

                <span>
                  Analytics
                </span>

              </NavLink>

              {/* ACTIVITY */}
              <NavLink

                to="/admin/activity"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <Activity size={18} />

                <span>
                  Activity Feed
                </span>

              </NavLink>

            </nav>

            {/* ====================================================== */}
            {/* ================= VERIFICATION ======================= */}
            {/* ====================================================== */}

            <div
              className="
                mt-8
                mb-3
                px-2

                text-xs
                uppercase
                tracking-wider

                text-slate-400

                font-semibold
              "
            >

              Verification

            </div>

            <nav
              className="
                space-y-2
              "
            >

              {/* PENDING */}
              <NavLink

                to="/admin/properties/pending"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <Clock3 size={18} />

                <span>
                  Pending Properties
                </span>

              </NavLink>

              {/* APPROVED */}
              <NavLink

                to="/admin/properties/approved"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <CheckCircle size={18} />

                <span>
                  Approved Properties
                </span>

              </NavLink>

              {/* REJECTED */}
              <NavLink

                to="/admin/properties/rejected"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <XCircle size={18} />

                <span>
                  Rejected Properties
                </span>

              </NavLink>

              {/* DELETED */}
              <NavLink

                to="/admin/properties/deleted"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <Trash2 size={18} />

                <span>
                  Deleted Properties
                </span>

              </NavLink>

              {/* PROPERTY VERIFICATION */}
              <NavLink

                to="/admin/verification-board"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <ShieldCheck size={18} />

                <span>
                  Verification Board
                </span>

              </NavLink>

              {/* IMAGE VERIFICATION */}
              <NavLink

                to="/admin/image-verification"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <ImageIcon size={18} />

                <span>
                  Image Verification
                </span>

              </NavLink>

            </nav>

            {/* ====================================================== */}
            {/* ================= OPERATIONS ========================= */}
            {/* ====================================================== */}

            <div
              className="
                mt-8
                mb-3
                px-2

                text-xs
                uppercase
                tracking-wider

                text-slate-400

                font-semibold
              "
            >

              Operations

            </div>

            <nav
              className="
                space-y-2
              "
            >

              {/* LEADS */}
              <NavLink

                to="/admin/leads"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <Users size={18} />

                <span>
                  Leads Dashboard
                </span>

              </NavLink>

              {/* ADD PROPERTY */}
              <NavLink

                to="/admin/add-property"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <PlusSquare size={18} />

                <span>
                  Add Property
                </span>

              </NavLink>

              {/* MY PROPERTIES */}
              <NavLink

                to="/admin-properties"

                className={navClass}

                onClick={
                  closeMobileMenu
                }
              >

                <Layers3 size={18} />

                <span>
                  My Properties
                </span>

              </NavLink>

            </nav>

            {/* ====================================================== */}
            {/* ================= FOOTER ============================= */}
            {/* ====================================================== */}

            <div className="pt-8 pb-4">

              <div
                className="

                  bg-gradient-to-br

                  from-slate-900
                  to-slate-700

                  rounded-3xl

                  p-5

                  text-white
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  "
                >

                  <Sparkles size={18} />

                  <p className="font-semibold">

                    Pro Admin Suite

                  </p>

                </div>

                <p
                  className="
                    text-sm
                    text-slate-200
                    leading-relaxed
                  "
                >

                  Manage moderation,
                  verification,
                  analytics and
                  operations from one
                  centralized CRM.

                </p>

                <div
                  className="
                    mt-4

                    flex
                    items-center
                    gap-2

                    text-sm
                  "
                >

                  <BarChart3 size={16} />

                  Analytics Ready

                </div>

              </div>

            </div>

          </div>

        </aside>

        {/* ====================================================== */}
        {/* ================= MAIN CONTENT ======================= */}
        {/* ====================================================== */}

        <main
          className="

            flex-1

            min-h-screen

            w-full

            mt-[78px]
            lg:mt-0
          "
        >

          {/* ====================================================== */}
          {/* ================= TOPBAR ============================= */}
          {/* ====================================================== */}

          <header
            className="

              bg-white

              border-b

              px-4
              sm:px-6

              py-4
              sm:py-5
            "
          >

            <div
              className="

                flex
                flex-col
                sm:flex-row

                gap-4

                sm:gap-0
                sm:items-center

                justify-between
              "
            >

              {/* LEFT */}
              <div>

                <h2
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold

                    text-slate-900
                  "
                >

                  Welcome Admin 👋

                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Manage platform
                  moderation and
                  operations smoothly

                </p>

              </div>

              {/* USER CARD */}
              <div
                className="

                  bg-slate-100

                  px-4
                  py-3

                  rounded-xl

                  text-left
                  sm:text-right

                  w-full
                  sm:w-auto
                "
              >

                <p
                  className="
                    font-semibold
                    text-sm
                    text-slate-900
                  "
                >

                  {user?.name ||
                    "Admin"}

                </p>

                <p
                  className="
                    text-xs
                    text-slate-500

                    break-all
                  "
                >

                  {user?.email ||
                    "admin@example.com"}

                </p>

              </div>

            </div>

          </header>

          {/* ====================================================== */}
          {/* ================= PAGE CONTENT ======================= */}
          {/* ====================================================== */}

          <section
            className="

              p-4
              sm:p-6

              overflow-x-hidden
            "
          >

            <Outlet />

          </section>

        </main>

      </div>

    </>
  );
}