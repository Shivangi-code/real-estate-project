import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  PlusCircle,
  Building2,
  Hammer,
  CheckCircle,
  MapPin,
  IndianRupee,
  BadgeCheck,
  Ban,
  Hash,
  Eye,
  BarChart3,
  ShieldCheck,
  CalendarDays,
  Building,
} from "lucide-react";

import socket from "../../socket";

export default function BuilderDashboard() {

  const navigate =
    useNavigate();

  const [properties, setProperties] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // ======================================================
  // ================= FETCH PROPERTIES ===================
  // ======================================================

  const fetchProjects =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/properties/my-properties",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setProperties(
          Array.isArray(
            data
          )
            ? data
            : []
        );

      } catch {

        setProperties(
          []
        );
      }
    };

  // ======================================================
  // ================= FETCH STATS ========================
  // ======================================================

  const fetchStats =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/properties/my-dashboard-stats",
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

      } catch (error) {

        console.log(
          error
        );
      }
    };

  // ======================================================
  // ================= INITIAL LOAD =======================
  // ======================================================

  useEffect(() => {

    const loadData =
      async () => {

        setLoading(
          true
        );

        await Promise.all([
          fetchProjects(),
          fetchStats(),
        ]);

        setLoading(
          false
        );
      };

    loadData();

    socket.on(
      "propertyUpdated",
      () => {

        fetchProjects();

        fetchStats();
      }
    );

    return () => {

      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  // ======================================================
  // ================= STATS CARD =========================
  // ======================================================

  const Card = ({
    icon,
    title,
    value,
    color,
    bg,
  }) => (

    <div className={`rounded-3xl p-6 shadow-sm border border-slate-100 ${bg}`}>

      <div className={color}>

        {icon}

      </div>

      <p className="text-slate-500 mt-4 text-sm">

        {title}

      </p>

      <h2 className="text-3xl font-bold mt-2">

        {value || 0}

      </h2>

    </div>
  );

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xl font-semibold">

        Loading Builder Dashboard...

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {/* ====================================================== */}
      {/* ================= HERO =============================== */}
      {/* ====================================================== */}

      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-slate-900 text-white rounded-[32px] p-8 shadow-2xl mb-8 flex flex-col xl:flex-row justify-between gap-8 items-start xl:items-center overflow-hidden relative">

        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        {/* LEFT */}
        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-4">

            <ShieldCheck className="text-orange-200" />

            <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur">

              Builder Inventory Active

            </span>

          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">

            Welcome back,
            {" "}
            Builder 👋

          </h1>

          <p className="text-orange-100 mt-4 text-lg">

            {user?.name || "Builder"}

          </p>

          {/* USER ID */}
          <div className="mt-5 flex items-center gap-2 text-sm text-orange-100">

            <Hash size={15} />

            <span>
              Builder ID:
            </span>

            <span className="font-bold tracking-widest">

              {user?.uniqueUserId ||
                "N/A"}

            </span>

          </div>

        </div>

        {/* RIGHT */}
        <div className="relative z-10 flex flex-col gap-4">

          <button
            onClick={() =>
              navigate(
                "/add-property"
              )
            }
            className="bg-white text-orange-600 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition flex items-center gap-3 shadow-lg"
          >

            <PlusCircle size={22} />

            Add Project

          </button>

          <div className="bg-white/10 backdrop-blur px-5 py-4 rounded-2xl">

            <div className="flex items-center gap-2 text-sm text-orange-100">

              <BarChart3 size={16} />

              Builder Portfolio

            </div>

            <div className="text-3xl font-bold mt-2">

              {stats?.totalProperties || 0}

            </div>

            <div className="text-sm text-orange-100">

              Total Projects

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <Card
          icon={
            <Building size={34} />
          }
          title="Total Projects"
          value={
            stats?.totalProperties
          }
          color="text-orange-600"
          bg="bg-white"
        />

        <Card
          icon={
            <Hammer size={34} />
          }
          title="Pending Approval"
          value={
            stats?.pendingProperties
          }
          color="text-yellow-500"
          bg="bg-white"
        />

        <Card
          icon={
            <CheckCircle size={34} />
          }
          title="Approved"
          value={
            stats?.approvedProperties
          }
          color="text-green-600"
          bg="bg-white"
        />

        <Card
          icon={
            <Ban size={34} />
          }
          title="Sold"
          value={
            stats?.soldProperties
          }
          color="text-red-600"
          bg="bg-white"
        />

      </div>

      {/* SECOND ROW */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <Card
          icon={
            <BadgeCheck size={34} />
          }
          title="Under Negotiation"
          value={
            stats?.underNegotiationProperties
          }
          color="text-yellow-600"
          bg="bg-yellow-50"
        />

        <Card
          icon={
            <Eye size={34} />
          }
          title="Total Views"
          value={
            stats?.totalViews
          }
          color="text-indigo-600"
          bg="bg-indigo-50"
        />

        <Card
          icon={
            <BarChart3 size={34} />
          }
          title="Total Inquiries"
          value={
            stats?.totalInquiries
          }
          color="text-green-700"
          bg="bg-green-50"
        />

      </div>

      {/* ====================================================== */}
      {/* ================= PROJECTS =========================== */}
      {/* ====================================================== */}

      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h2 className="text-3xl font-bold">

              My Projects

            </h2>

            <p className="text-slate-500 mt-2">

              Builder inventory monitoring panel

            </p>

          </div>

          <div className="bg-orange-100 text-orange-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 w-fit">

            <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />

            Live Sync Active

          </div>

        </div>

        {/* EMPTY */}
        {properties.length ===
        0 ? (

          <div className="text-center py-20">

            <div className="text-6xl mb-6">

              🏗️

            </div>

            <h3 className="text-3xl font-bold mb-3">

              No projects yet

            </h3>

            <p className="text-slate-500 text-lg">

              Start adding builder inventory.

            </p>

            <button
              onClick={() =>
                navigate(
                  "/add-property"
                )
              }
              className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >

              Add First Project

            </button>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {properties.map(
              (item) => {

                const isSold =
                  item.businessStatus ===
                  "sold";

                return (

                  <div
                    key={
                      item._id
                    }
                    className="border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all bg-white"
                  >

                    {/* IMAGE */}
                    <div className="relative">

                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/400x250"
                        }
                        alt={
                          item.title
                        }
                        className={`w-full h-56 object-cover ${
                          isSold
                            ? "grayscale-[20%]"
                            : ""
                        }`}
                      />

                      {/* SOLD */}
                      {isSold && (

                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">

                          SOLD

                        </div>
                      )}

                      {/* NEGOTIATION */}
                      {!isSold &&
                        item.underNegotiation && (

                          <div className="absolute bottom-4 left-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">

                            <BadgeCheck size={12} />

                            Under Negotiation

                          </div>
                        )}

                    </div>

                    {/* BODY */}
                    <div className="p-5">

                      {/* PROPERTY ID */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">

                        <Hash size={13} />

                        <span className="font-semibold tracking-wider">

                          {item.propertyUniqueId ||
                            `RE-${item._id.slice(-6).toUpperCase()}`}

                        </span>

                      </div>

                      {/* TITLE */}
                      <h3 className="font-bold text-xl line-clamp-1">

                        {item.title}

                      </h3>

                      {/* LOCATION */}
                      <div className="flex items-center gap-2 text-slate-500 mt-3">

                        <MapPin size={16} />

                        {item.location}

                      </div>

                      {/* PRICE */}
                      <div className={`flex items-center gap-2 font-bold mt-4 text-lg ${
                        isSold
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}>

                        <IndianRupee size={18} />

                        {item.price}

                      </div>

                      {/* STATUS */}
                      <div className="flex flex-wrap gap-2 mt-5">

                        <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          item.status ===
                          "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                              "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>

                          {item.status}

                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          isSold
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>

                          {item.businessStatus ||
                            "available"}

                        </div>

                      </div>

                      {/* DATE */}
                      <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">

                        <CalendarDays size={14} />

                        Added on
                        {" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </div>

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          navigate(
                            `/properties/${item._id}`
                          )
                        }
                        className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-semibold transition"
                      >

                        View Project

                      </button>

                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

      </div>
    </div>
  );
}