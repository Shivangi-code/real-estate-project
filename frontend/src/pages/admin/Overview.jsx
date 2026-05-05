import { useEffect, useState } from "react";
import {
  Building2,
  Clock3,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Overview() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [pendingRes, approvedRes, rejectedRes] =
        await Promise.all([
          fetch(
            "http://localhost:5000/api/admin/properties/pending",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/admin/properties/approved",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/admin/properties/rejected",
            { headers }
          ),
        ]);

      const pending = await pendingRes.json();
      const approved = await approvedRes.json();
      const rejected = await rejectedRes.json();

      const p = Array.isArray(pending)
        ? pending.length
        : 0;
      const a = Array.isArray(approved)
        ? approved.length
        : 0;
      const r = Array.isArray(rejected)
        ? rejected.length
        : 0;

      setStats({
        pending: p,
        approved: a,
        rejected: r,
        total: p + a + r,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Card = ({
    title,
    value,
    icon,
    color,
  }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className={color}>{icon}</div>

      <p className="text-slate-500 mt-4 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-1">
        {loading ? "--" : value}
      </h2>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl text-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold">
          Platform Overview
        </h1>

        <p className="text-slate-300 mt-2">
          Real-time moderation and listing health.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card
          title="Total Listings"
          value={stats.total}
          icon={<Building2 size={28} />}
          color="text-blue-600"
        />

        <Card
          title="Pending Review"
          value={stats.pending}
          icon={<Clock3 size={28} />}
          color="text-yellow-500"
        />

        <Card
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle size={28} />}
          color="text-green-600"
        />

        <Card
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle size={28} />}
          color="text-red-500"
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verification Health */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="text-indigo-600" />
            <h2 className="text-xl font-bold">
              Verification Health
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Approved Ratio</span>
                <span>
                  {stats.total === 0
                    ? "0%"
                    : `${Math.round(
                        (stats.approved /
                          stats.total) *
                          100
                      )}%`}
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width:
                      stats.total === 0
                        ? "0%"
                        : `${(
                            stats.approved /
                            stats.total
                          ) *
                          100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pending Ratio</span>
                <span>
                  {stats.total === 0
                    ? "0%"
                    : `${Math.round(
                        (stats.pending /
                          stats.total) *
                          100
                      )}%`}
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{
                    width:
                      stats.total === 0
                        ? "0%"
                        : `${(
                            stats.pending /
                            stats.total
                          ) *
                          100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              to="/admin/properties/pending"
              className="flex justify-between items-center bg-yellow-50 px-4 py-4 rounded-2xl hover:shadow"
            >
              <span>Review Pending Properties</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/admin/verification-board"
              className="flex justify-between items-center bg-indigo-50 px-4 py-4 rounded-2xl hover:shadow"
            >
              <span>Open Verification Board</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/admin/properties/approved"
              className="flex justify-between items-center bg-green-50 px-4 py-4 rounded-2xl hover:shadow"
            >
              <span>Approved Listings</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}