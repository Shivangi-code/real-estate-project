import { NavLink, Outlet } from "react-router-dom";
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
} from "lucide-react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${
      isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col">
        {/* BRAND */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-3 rounded-2xl">
              <Building2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-500">
                Real Estate Control Center
              </p>
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500">
              System
            </p>
            <p className="font-bold text-slate-900">
              Active
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500">
              Mode
            </p>
            <p className="font-bold text-green-600">
              Live
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mb-3 px-2 text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Dashboard
        </div>

        <nav className="space-y-2">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={18} />
            Overview
          </NavLink>

          <NavLink
            to="/admin/leads"
            className={navClass}
          >
            <Users size={18} />
            Leads Dashboard
          </NavLink>

          <NavLink
            to="/admin/properties/pending"
            className={navClass}
          >
            <Clock3 size={18} />
            Pending Properties
          </NavLink>

          <NavLink
            to="/admin/properties/approved"
            className={navClass}
          >
            <CheckCircle size={18} />
            Approved Properties
          </NavLink>

          <NavLink
            to="/admin/properties/rejected"
            className={navClass}
          >
            <XCircle size={18} />
            Rejected Properties
          </NavLink>

          <NavLink
            to="/admin/verification-board"
            className={navClass}
          >
            <ShieldCheck size={18} />
            Verification Board
          </NavLink>
        </nav>

        {/* FOOTER CARD */}
        <div className="mt-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={18} />
              <p className="font-semibold">
                Pro Admin Suite
              </p>
            </div>

            <p className="text-sm text-slate-200 leading-6">
              Manage listings, leads,
              verification and growth from
              one place.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <BarChart3 size={16} />
              Analytics Ready
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-h-screen">
        {/* TOPBAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Admin 👋
              </h2>

              <p className="text-sm text-slate-500">
                Manage platform operations
                smoothly
              </p>
            </div>

            <div className="bg-slate-100 px-5 py-3 rounded-2xl text-right">
              <p className="font-semibold text-sm text-slate-900">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email ||
                  "Administrator"}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="p-6 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}