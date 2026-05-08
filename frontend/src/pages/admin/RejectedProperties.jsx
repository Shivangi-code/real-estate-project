import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Clock3,
  MapPin,
  IndianRupee,
  Trash2,
} from "lucide-react";

export default function RejectedProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/properties/rejected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
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

      toast.success(`Moved to ${type}`);
      fetchRejected();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete property?")) return;

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

      toast.success("Deleted");
      fetchRejected();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Rejected Properties</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <img
              src={item.image || "https://via.placeholder.com/400x250"}
              alt={item.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">
              <h2 className="text-lg font-bold">{item.title}</h2>

              <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                <MapPin size={14} />
                {item.location}
              </div>

              <div className="flex items-center gap-2 mt-2 font-semibold text-red-600">
                <IndianRupee size={14} />
                {item.price}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Owner: <b>{item.createdBy?.name}</b>
              </p>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <button
                  title="Approve"
                  onClick={() => updateStatus(item._id, "approve")}
                  className="bg-green-600 text-white py-2 rounded-xl"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  title="Move to Pending"
                  onClick={() => updateStatus(item._id, "pending")}
                  className="bg-yellow-500 text-white py-2 rounded-xl"
                >
                  <Clock3 size={16} />
                  Pending
                </button>

                <button
                  title="Delete"
                  onClick={() => handleDelete(item._id)}
                  className="bg-black text-white py-2 rounded-xl"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}