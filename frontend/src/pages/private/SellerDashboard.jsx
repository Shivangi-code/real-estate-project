import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PlusCircle,
  Building2,
  Clock3,
  CheckCircle2,
  MapPin,
  IndianRupee,
  BadgeCheck,
  Ban,
  Hash,
  Eye,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import socket from "../../socket";

export default function SellerDashboard() {

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

    socket.on("propertyUpdated", () => {
      fetchProperties();
      fetchStats();
    });

    return () => {
      socket.off("propertyUpdated");
    };

  }, []);

  // ================= STAT CARD =================
  const StatCard = ({ icon, title, value, color, bg }) => (
    <div className={`rounded-3xl p-6 shadow-sm border ${bg}`}>
      <div className={color}>{icon}</div>
      <p className="text-slate-500 text-sm mt-2">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value || 0}</h2>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-[32px] p-8 shadow-2xl mb-8 flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="text-blue-100 mt-3">
            {user?.role || "Seller"} Dashboard
          </p>
        </div>

        <button
          onClick={() => navigate("/add-property")}
          className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold"
        >
          <PlusCircle className="inline mr-2" />
          Add Property
        </button>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard icon={<Building2 />} title="Total" value={stats?.totalProperties} color="text-blue-600" bg="bg-white" />

        <StatCard icon={<CheckCircle2 />} title="Approved" value={stats?.approvedProperties} color="text-green-600" bg="bg-white" />

        <StatCard icon={<Clock3 />} title="Pending" value={stats?.pendingProperties} color="text-yellow-500" bg="bg-white" />

        <StatCard icon={<Ban />} title="Sold" value={stats?.soldProperties} color="text-red-600" bg="bg-white" />

      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-6">My Properties</h2>

        {properties.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {properties.map((item) => (
              <div key={item._id} className="border rounded-2xl p-4">

                <h3 className="font-bold">{item.title}</h3>
                <p className="text-slate-500">{item.location}</p>

                <div className="mt-3 font-bold text-blue-600">
                  ₹{item.price}
                </div>

                <button
                  onClick={() => navigate(`/properties/${item._id}`)}
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