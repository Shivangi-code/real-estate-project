import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  IndianRupee,
  Trash2,
} from "lucide-react";

export default function PendingProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/admin/properties/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, type) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/property/${id}/${type}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success(`Moved to ${type} ✅`);
      fetchPending();
    } catch {
      toast.error("Action failed ❌");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this property?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/property/${id}/delete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Property deleted 🚀");
      fetchPending();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pending Properties</h1>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No pending properties.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition">
              <img src={item.image || "https://via.placeholder.com/400x250"} className="w-full h-52 object-cover" />

              <div className="p-5">
                <h2 className="text-xl font-bold">{item.title}</h2>

                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <MapPin size={16} /> {item.location}
                </div>

                <div className="flex items-center gap-2 mt-2 text-blue-600 font-semibold">
                  <IndianRupee size={16} /> {item.price}
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Owner: <b>{item.createdBy?.name}</b>
                </p>

                <div className="grid grid-cols-3 gap-3 mt-5">

                  {/* APPROVE */}
                  <button
                    onClick={() => updateStatus(item._id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => updateStatus(item._id, "reject")}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-black hover:bg-gray-800 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}