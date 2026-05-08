import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/properties/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const total = data.length;
      const pending = data.filter(p => p.status === "pending").length;
      const approved = data.filter(p => p.status === "approved").length;
      const rejected = data.filter(p => p.status === "rejected").length;
      const deleted = data.filter(p => p.status === "deleted").length;

      setStats({ total, pending, approved, rejected, deleted });

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ percentage calculator
  const getPercent = (value) =>
    stats.total ? Math.round((value / stats.total) * 100) : 0;

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Platform Overview
      </h1>

      {/* ================= STAT CARDS ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

        {/* TOTAL */}
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-slate-500 text-sm">Total</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>

        {/* PENDING */}
        <div
          onClick={() => navigate("/admin/properties/pending")}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border-l-4 border-yellow-500"
        >
          <p className="text-slate-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{stats.pending}</h2>
        </div>

        {/* APPROVED */}
        <div
          onClick={() => navigate("/admin/properties/approved")}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border-l-4 border-green-500"
        >
          <p className="text-slate-500 text-sm">Approved</p>
          <h2 className="text-2xl font-bold text-green-600">{stats.approved}</h2>
        </div>

        {/* REJECTED */}
        <div
          onClick={() => navigate("/admin/properties/rejected")}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border-l-4 border-red-500"
        >
          <p className="text-slate-500 text-sm">Rejected</p>
          <h2 className="text-2xl font-bold text-red-600">{stats.rejected}</h2>
        </div>

        {/* DELETED */}
        <div
          onClick={() => navigate("/admin/properties/deleted")}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition border-l-4 border-gray-700"
        >
          <p className="text-slate-500 text-sm">Deleted</p>
          <h2 className="text-2xl font-bold text-gray-800">{stats.deleted}</h2>
        </div>
      </div>

      {/* ================= VERIFICATION HEALTH ================= */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Verification Health
        </h2>

        {/* APPROVED */}
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span>Approved</span>
            <span>{getPercent(stats.approved)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${getPercent(stats.approved)}%` }}
            />
          </div>
        </div>

        {/* PENDING */}
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span>Pending</span>
            <span>{getPercent(stats.pending)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-yellow-500 h-2 rounded"
              style={{ width: `${getPercent(stats.pending)}%` }}
            />
          </div>
        </div>

        {/* REJECTED */}
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span>Rejected</span>
            <span>{getPercent(stats.rejected)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-red-500 h-2 rounded"
              style={{ width: `${getPercent(stats.rejected)}%` }}
            />
          </div>
        </div>

        {/* DELETED */}
        <div>
          <div className="flex justify-between text-sm">
            <span>Deleted</span>
            <span>{getPercent(stats.deleted)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-gray-700 h-2 rounded"
              style={{ width: `${getPercent(stats.deleted)}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}