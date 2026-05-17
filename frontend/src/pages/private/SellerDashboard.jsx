import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  PlusCircle,
  Building2,
  Clock3,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Ban,
} from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* GIRL ↔ BOY AVATAR */
  const [avatarIndex, setAvatarIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH PROPERTIES =================
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/properties/my-properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setProperties([]);
    }
  };

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/properties/my-dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchProperties(),
        fetchStats(),
      ]);

      setLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      setAvatarIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ================= COUNTS =================
  const total = properties.length;

  const pending = properties.filter(
    (p) => p.status === "pending"
  ).length;

  const approved = properties.filter(
    (p) => p.status === "approved"
  ).length;

  // ================= STAT CARD =================
  const StatCard = ({ title, value, icon, glow }) => (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
    >
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${glow}`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-semibold tracking-wide">
            {title}
          </p>

          <h2 className="text-4xl font-extrabold mt-3 text-white drop-shadow-md">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-white bg-[#07111f]">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] overflow-hidden relative px-6 md:px-10 py-8 text-white">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 overflow-hidden rounded-[38px] border border-white/10 p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9")',
        }}
      >

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">

          {/* LEFT */}
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold mb-6">
              <Sparkles size={15} />
              Elite Seller Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Welcome back,
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <motion.div className="px-5 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white">
                  {user?.name || "SELLER"}
                </h2>

                <p className="text-white/80 text-[10px] tracking-[4px] uppercase mt-1 font-semibold">
                  Premium Seller
                </p>
              </motion.div>

              <div className="hidden md:flex items-center gap-2 text-white bg-white/10 border border-white/20 px-3 py-2 rounded-xl font-semibold">
                <TrendingUp size={14} />
                Verified
              </div>
            </div>

            <p className="mt-6 text-white/90 text-lg font-medium leading-relaxed max-w-2xl">
              Manage premium listings, monitor approvals, and grow your real estate business.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <button
                onClick={() => navigate("/add-property")}
                className="bg-white text-black font-bold px-7 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <PlusCircle size={20} />
                Add Property
                <ArrowUpRight size={18} />
              </button>

            </div>
          </div>

          {/* RIGHT AVATAR */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="relative"
          >

            <div className="relative w-[240px] h-[240px] rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/30">

              <motion.img
                key={avatarIndex}
                src={
                  avatarIndex === 0
                    ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                    : "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                }
                className="w-44 drop-shadow-xl"
                alt="avatar"
              />
            </div>

          </motion.div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="relative z-10 grid md:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="Total Listings"
          value={total}
          icon={<Building2 size={24} />}
          glow="bg-cyan-500"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock3 size={24} />}
          glow="bg-orange-500"
        />

        <StatCard
          title="Approved"
          value={approved}
          icon={<CheckCircle2 size={24} />}
          glow="bg-emerald-500"
        />

        <StatCard
          title="Sold"
          value={stats?.soldProperties || 0}
          icon={<Ban size={24} />}
          glow="bg-red-500"
        />

      </div>

      {/* PROPERTY LIST */}
      <div className="bg-white text-black rounded-3xl p-6 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          My Properties
        </h2>

        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {properties.map((item) => (
              <div
                key={item._id}
                className="border rounded-2xl p-4"
              >

                <h3 className="font-bold">
                  {item.title}
                </h3>

                <p className="text-slate-500">
                  {item.location}
                </p>

                <div className="mt-3 font-bold text-blue-600">
                  ₹{item.price}
                </div>

                <button
                  onClick={() =>
                    navigate(`/properties/${item._id}`)
                  }
                  className="mt-4 w-full bg-black text-white py-2 rounded-xl"
                >
                  View
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}