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
  Trash2,
} from "lucide-react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
      isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      
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
            <p className="text-xs text-slate-500">System</p>
            <p className="font-bold text-slate-900">Active</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs text-slate-500">Mode</p>
            <p className="font-bold text-green-600">Live</p>
          </div>
        </div>

        {/* NAV */}
        <div className="mb-3 px-2 text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Dashboard
        </div>

        <nav className="space-y-2">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/admin/leads" className={navClass}>
            <Users size={18} />
            <span>Leads Dashboard</span>
          </NavLink>

          <NavLink to="/admin/properties/pending" className={navClass}>
            <Clock3 size={18} />
            <span>Pending Properties</span>
          </NavLink>

          <NavLink to="/admin/properties/approved" className={navClass}>
            <CheckCircle size={18} />
            <span>Approved Properties</span>
          </NavLink>

          <NavLink to="/admin/properties/rejected" className={navClass}>
            <XCircle size={18} />
            <span>Rejected Properties</span>
          </NavLink>

          <NavLink to="/admin/properties/deleted" className={navClass}>
            <Trash2 size={18} />
            <span>Deleted Properties</span>
          </NavLink>

          <NavLink to="/admin/verification-board" className={navClass}>
            <ShieldCheck size={18} />
            <span>Verification Board</span>
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={18} />
              <p className="font-semibold">Pro Admin Suite</p>
            </div>

            <p className="text-sm text-slate-200">
              Manage listings, leads, verification and growth.
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
        <header className="bg-white border-b px-6 py-5">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome Admin 👋</h2>
              <p className="text-sm text-slate-500">
                Manage platform operations smoothly
              </p>
            </div>

            <div className="bg-slate-100 px-4 py-2 rounded-xl text-right">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}