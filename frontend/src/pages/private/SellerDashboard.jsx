import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Building2,
  Clock3,
  CheckCircle,
  MapPin,
  IndianRupee,
} from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProperties();
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

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className={`mb-4 ${color}`}>{icon}</div>
      <p className="text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg mb-8 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, Seller 👋
          </h1>
          <p className="text-blue-100 mt-2 text-lg">
            {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={() => navigate("/add-property")}
          className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add Property
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Building2 size={32} />}
          title="Total Listings"
          value={total}
          color="text-blue-600"
        />

        <StatCard
          icon={<Clock3 size={32} />}
          title="Pending Approval"
          value={pending}
          color="text-yellow-500"
        />

        <StatCard
          icon={<CheckCircle size={32} />}
          title="Approved"
          value={approved}
          color="text-green-600"
        />
      </div>

      {/* PROPERTIES */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">
          My Properties
        </h2>

        {loading ? (
          <p className="text-slate-500">Loading properties...</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 text-lg">
              No properties added yet.
            </p>

            <button
              onClick={() => navigate("/add-property")}
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              Add First Property
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item._id}
                className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <MapPin size={16} />
                    {item.location}
                  </div>

                  <div className="flex items-center gap-2 text-blue-600 font-semibold mt-3">
                    <IndianRupee size={16} />
                    {item.price}
                  </div>

                  <div className="mt-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}