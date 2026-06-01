import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

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
  TrendingUp,
  ArrowUpRight,
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
      localStorage.getItem("user")
    );

  const fetchProjects = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/properties/my-properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setProperties(
        Array.isArray(data) ? data : []
      );

    } catch {
      setProperties([]);
    }
  };

  const fetchStats = async () => {
    try {
      const token =
        localStorage.getItem("token");

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

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchProjects(),
        fetchStats(),
      ]);

      setLoading(false);
    };

    loadData();

    socket.on("propertyUpdated", () => {
      fetchProjects();
      fetchStats();
    });

    return () => {
      socket.off("propertyUpdated");
    };

  }, []);

  const Card = ({
    icon,
    title,
    value,
    color,
    bg,
  }) => (

    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-[30px] p-[1.5px] overflow-hidden"
    >

      <div className="absolute inset-0 rounded-[30px] bg-[conic-gradient(from_0deg,#061a3a,#0b3aa4,#061a3a,#0b3aa4,#061a3a)] animate-[spin_4s_linear_infinite]" />

      <div className={`relative overflow-hidden rounded-[30px] backdrop-blur-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)] ${bg}`}>

        <div
          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${color}`}
        />

        <div className="relative z-10 flex items-start justify-between">

          <div>

            <p className="text-slate-600 text-sm font-semibold tracking-wide">
              {title}
            </p>

            <h2 className="text-4xl font-extrabold mt-3 text-slate-900">
              {value || 0}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            {icon}
          </div>

        </div>

      </div>

    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-xl font-semibold">
        Loading Builder Dashboard...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes typing {
          0% { width: 0; }
          40% { width: 100%; }
          60% { width: 100%; }
          100% { width: 0; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes moveBorder {
          0% { transform: translateX(0%); }
          100% { transform: translateX(350%); }
        }
      `}</style>

      <div className="min-h-screen bg-white overflow-hidden relative px-6 md:px-10 py-8 text-white">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 rounded-[38px] overflow-hidden p-[3px] mb-8"
        >

          <div className="absolute inset-0 rounded-[38px] overflow-hidden">
            <div className="absolute top-0 left-[-40%] h-full w-[40%] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-90 animate-[moveBorder_3s_linear_infinite]" />
          </div>

          <div
            className="relative rounded-[36px] p-8 md:p-10 bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9")',
            }}
          >

            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">

              <div className="max-w-3xl">

                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-orange-100">
                  Welcome back,
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3">

                  <motion.div className="px-5 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">

                    <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-orange-100">
                      {user?.name || "BUILDER"}
                    </h2>

                    <p className="text-orange-200 text-[10px] tracking-[4px] uppercase mt-1 font-semibold">
                      BUILDER
                    </p>

                  </motion.div>

                  <div className="hidden md:flex items-center gap-2 text-orange-100 bg-white/10 border border-white/20 px-3 py-2 rounded-xl font-semibold">
                    <TrendingUp size={14} />
                    Verified
                  </div>

                </div>

                <p className="mt-6 text-slate-200 text-lg leading-8 max-w-2xl overflow-hidden whitespace-nowrap border-r-2 border-white animate-[typing_6s_steps(60,end)_infinite,blink_.8s_infinite]">
                  Manage premium builder projects, approvals, and grow your real estate business.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">

                  <button
                    onClick={() => navigate("/add-property")}
                    className="bg-white text-slate-900 px-7 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3"
                  >
                    <PlusCircle size={20} />
                    Add Project
                    <ArrowUpRight size={18} />
                  </button>

                </div>

              </div>

              {/* 🏙️ ONLY BUILDING IMAGE CHANGED */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="relative"
              >
                <div className="relative w-[240px] h-[240px] rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/30">

                  <motion.img
                    src="https://cdn-icons-png.flaticon.com/512/619/619034.png"
                    className="w-36 h-36 object-contain drop-shadow-xl"
                    alt="building"
                    animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                </div>
              </motion.div>

            </div>

          </div>

        </motion.div>

        {/* STATS */}
        <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <Card
            icon={<Building size={24} />}
            title="Total Projects"
            value={stats?.totalProperties}
            color="bg-orange-500"
            bg="bg-white"
          />

          <Card
            icon={<Hammer size={24} />}
            title="Pending Approval"
            value={stats?.pendingProperties}
            color="bg-yellow-500"
            bg="bg-white"
          />

          <Card
            icon={<CheckCircle size={24} />}
            title="Approved"
            value={stats?.approvedProperties}
            color="bg-green-500"
            bg="bg-white"
          />

          <Card
            icon={<Ban size={24} />}
            title="Sold"
            value={stats?.soldProperties}
            color="bg-red-500"
            bg="bg-white"
          />

        </div>

        {/* PROJECTS */}
        <div className="bg-white text-black rounded-3xl p-6 mt-8">

          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            My Projects
          </h2>

          {properties.length === 0 ? (
            <p className="text-slate-600">No projects found</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {properties.map((item) => (
                <div
                  key={item._id}
                  className="border border-[#061a3a] rounded-2xl p-4 bg-white"
                >

                  <h3 className="font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-slate-600">
                    {item.location}
                  </p>

                  <div className="mt-3 font-bold text-slate-900">
                    ₹{item.price}
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/properties/${item._id}`)
                    }
                    className="mt-4 w-full bg-black text-white py-2 rounded-xl"
                  >
                    View Project
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </>
  );
}