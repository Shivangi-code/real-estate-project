import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  PlusCircle,
  Building2,
  Clock3,
  CheckCircle2,
  MapPin,
  IndianRupee,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Crown,
} from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  /* GIRL ↔ BOY AVATAR */
  const [avatarIndex, setAvatarIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProperties();

    const interval = setInterval(() => {
      setAvatarIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/property/my-properties",
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
    } finally {
      setLoading(false);
    }
  };

  const total = properties.length;

  const pending = properties.filter((p) => p.status === "pending").length;

  const approved = properties.filter((p) => p.status === "approved").length;

  const StatCard = ({ title, value, icon, glow }) => (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${glow}`} />

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

  return (
    <div className="min-h-screen bg-[#07111f] overflow-hidden relative px-6 md:px-10 py-8 text-white">

      {/* BACKGROUND IMAGE HERO */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 overflow-hidden rounded-[38px] border border-white/10 p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9")',
        }}
      >

        {/* DARK OVERLAY (STRONGER FOR TEXT VISIBILITY) */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 blur-2xl rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">

          {/* LEFT */}
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold mb-6">
              <Sparkles size={15} />
              Elite Seller Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              Welcome back,
            </h1>

            {/* NAME */}
            <div className="mt-5 flex flex-wrap items-center gap-3">

              <motion.div className="px-5 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-white drop-shadow-md">
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

            {/* DESCRIPTION */}
            <p className="mt-6 text-white/90 text-lg font-medium leading-relaxed max-w-2xl drop-shadow-md">
              Manage premium listings, monitor approvals, and grow your real estate business with clarity and control.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-8">

              <button
                onClick={() => navigate("/add-property")}
                className="bg-white text-black font-bold px-7 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <PlusCircle size={20} />
                Add Property
                <ArrowUpRight size={18} />
              </button>

              <button className="border border-white/30 bg-white/10 text-white px-7 py-4 rounded-2xl font-semibold">
                Explore Listings
              </button>

            </div>
          </div>

          {/* RIGHT AVATAR */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="relative"
          >

            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />

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

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20">
              Elite Seller
            </div>

          </motion.div>
        </div>
      </motion.div>

      {/* STATS (UNCHANGED) */}
      <div className="relative z-10 grid md:grid-cols-3 gap-6 mt-8">

        <StatCard
          title="Total Listings"
          value={total}
          icon={<Building2 size={24} />}
          glow="bg-cyan-500"
        />

        <StatCard
          title="Pending Approval"
          value={pending}
          icon={<Clock3 size={24} />}
          glow="bg-orange-500"
        />

        <StatCard
          title="Approved Listings"
          value={approved}
          icon={<CheckCircle2 size={24} />}
          glow="bg-emerald-500"
        />

      </div>

    </div>
  );
}