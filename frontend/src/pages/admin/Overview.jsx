import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Clock3,
  CheckCircle,
  XCircle,
  Trash2,
  Activity,
  TrendingUp,
  ShieldCheck,
  Building2,
} from "lucide-react";

import socket from "../../socket";

export default function AdminOverview() {

  const navigate =
    useNavigate();

  const [stats, setStats] =
    useState({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      deleted: 0,
    });

  // ================= FETCH =================
  const fetchStats = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setStats(data);

    } catch (err) {

      console.log(err);
    }
  };

  // ================= REALTIME =================
  useEffect(() => {

    fetchStats();

    socket.on(
      "propertyUpdated",
      () => {
        fetchStats();
      }
    );

    return () => {
      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  // ================= PERCENT =================
  const getPercent = (
    value
  ) => {

    return stats.total
      ? Math.round(
          (value /
            stats.total) *
            100
        )
      : 0;
  };

  // ================= CARDS =================
  const cards = [
    {
      title:
        "Total Properties",

      value:
        stats.total,

      icon:
        <LayoutDashboard size={24} />,

      color:
        "from-slate-800 to-slate-600",

      route:
        "/admin",
    },

    {
      title:
        "Pending",

      value:
        stats.pending,

      icon:
        <Clock3 size={24} />,

      color:
        "from-yellow-500 to-orange-500",

      route:
        "/admin/properties/pending",
    },

    {
      title:
        "Approved",

      value:
        stats.approved,

      icon:
        <CheckCircle size={24} />,

      color:
        "from-green-500 to-emerald-600",

      route:
        "/admin/properties/approved",
    },

    {
      title:
        "Rejected",

      value:
        stats.rejected,

      icon:
        <XCircle size={24} />,

      color:
        "from-red-500 to-rose-600",

      route:
        "/admin/properties/rejected",
    },

    {
      title:
        "Deleted",

      value:
        stats.deleted,

      icon:
        <Trash2 size={24} />,

      color:
        "from-slate-600 to-slate-800",

      route:
        "/admin/properties/deleted",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">

        <div>

          <p className="uppercase tracking-widest text-sm text-slate-500">
            Admin Analytics
          </p>

          <h1 className="text-4xl font-bold mt-2 text-slate-900">
            Platform Overview
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor properties, moderation
            and platform health in realtime.
          </p>
        </div>

        {/* LIVE */}
        <div className="mt-6 lg:mt-0 bg-green-100 text-green-700 px-5 py-3 rounded-2xl flex items-center gap-3 font-semibold">

          <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />

          Live Analytics Active

        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

        {cards.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              onClick={() =>
                navigate(
                  item.route
                )
              }
              className={`bg-gradient-to-br ${item.color} text-white rounded-3xl p-6 shadow-lg hover:scale-[1.03] transition-all cursor-pointer`}
            >

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-sm text-white/80">
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className="bg-white/20 p-3 rounded-2xl">
                  {item.icon}
                </div>
              </div>

              <div className="mt-6 text-sm text-white/80 flex items-center gap-2">

                <TrendingUp size={16} />

                Realtime Updated

              </div>
            </div>
          )
        )}
      </div>

      {/* ANALYTICS */}
      <div className="grid xl:grid-cols-3 gap-6 mt-10">

        {/* VERIFICATION HEALTH */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm p-8">

          <div className="flex items-center gap-3 mb-8">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
              <ShieldCheck size={22} />
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Verification Health
              </h2>

              <p className="text-slate-500 text-sm">
                Moderation performance overview
              </p>
            </div>
          </div>

          {/* APPROVED */}
          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                Approved
              </span>

              <span className="text-green-600 font-bold">
                {getPercent(
                  stats.approved
                )}
                %
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${getPercent(
                    stats.approved
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* PENDING */}
          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                Pending
              </span>

              <span className="text-yellow-600 font-bold">
                {getPercent(
                  stats.pending
                )}
                %
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{
                  width: `${getPercent(
                    stats.pending
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* REJECTED */}
          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                Rejected
              </span>

              <span className="text-red-600 font-bold">
                {getPercent(
                  stats.rejected
                )}
                %
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-red-500 rounded-full"
                style={{
                  width: `${getPercent(
                    stats.rejected
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* DELETED */}
          <div>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                Deleted
              </span>

              <span className="text-slate-700 font-bold">
                {getPercent(
                  stats.deleted
                )}
                %
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-slate-700 rounded-full"
                style={{
                  width: `${getPercent(
                    stats.deleted
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* SIDECARD */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl text-white p-8 shadow-lg">

          <div className="bg-white/10 w-fit p-4 rounded-2xl mb-6">
            <Building2 size={28} />
          </div>

          <h2 className="text-3xl font-bold leading-tight">
            Smart Moderation System
          </h2>

          <p className="mt-4 text-slate-300">
            Your platform now supports
            realtime moderation,
            analytics and scalable
            property management.
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">
              <Activity size={18} />
              Realtime Sync
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              Verification Tracking
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp size={18} />
              Live Analytics
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}