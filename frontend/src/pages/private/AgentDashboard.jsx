import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Users,
  PhoneCall,
  Building2,
  MapPin,
  IndianRupee,
} from "lucide-react";

export default function AgentDashboard() {
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
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const total = properties.length;
  const pending = properties.filter((p) => p.status === "pending").length;
  const approved = properties.filter((p) => p.status === "approved").length;

  const Card = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className={color}>{icon}</div>
      <p className="text-slate-500 mt-3">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg mb-8 flex flex-col md:flex-row justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, Agent 👋
          </h1>
          <p className="text-purple-100 mt-2">
            {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={() => navigate("/add-property")}
          className="bg-white text-purple-700 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add Property
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card
          icon={<Users size={30} />}
          title="Total Leads"
          value={total}
          color="text-purple-600"
        />

        <Card
          icon={<PhoneCall size={30} />}
          title="Pending Deals"
          value={pending}
          color="text-yellow-500"
        />

        <Card
          icon={<Building2 size={30} />}
          title="Approved Listings"
          value={approved}
          color="text-green-600"
        />
      </div>

      {/* LISTINGS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          My Listings
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : properties.length === 0 ? (
          <p className="text-slate-500">
            No listings yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item._id}
                className="border rounded-2xl overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h3 className="font-bold text-lg">
                    {item.title}
                  </h3>

                  <div className="flex gap-2 mt-2 text-slate-500">
                    <MapPin size={16} />
                    {item.location}
                  </div>

                  <div className="flex gap-2 mt-3 text-purple-600 font-semibold">
                    <IndianRupee size={16} />
                    {item.price}
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