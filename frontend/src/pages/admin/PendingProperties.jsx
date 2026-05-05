import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  IndianRupee,
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/admin/property/${id}/${type}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchPending();
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Pending Properties
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No pending properties.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
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
                <h2 className="text-xl font-bold">
                  {item.title}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <MapPin size={16} />
                  {item.location}
                </div>

                <div className="flex items-center gap-2 mt-2 text-blue-600 font-semibold">
                  <IndianRupee size={16} />
                  {item.price}
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Owner:{" "}
                  <b>{item.createdBy?.name}</b> (
                  {item.createdBy?.role})
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  <Clock3 size={14} />
                  Pending Review
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Added:{" "}
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "approve"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "reject"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                  >
                    <XCircle size={16} />
                    Reject
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