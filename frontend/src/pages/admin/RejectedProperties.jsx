import { useEffect, useState } from "react";
import {
  XCircle,
  CheckCircle,
  Clock3,
  MapPin,
  IndianRupee,
} from "lucide-react";

export default function RejectedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/properties/rejected",
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

    fetchRejected();
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Rejected Properties
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No rejected properties.</p>
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

                <div className="flex items-center gap-2 mt-2 text-red-600 font-semibold">
                  <IndianRupee size={16} />
                  {item.price}
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Owner:{" "}
                  <b>{item.createdBy?.name}</b> (
                  {item.createdBy?.role})
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  <XCircle size={14} />
                  Rejected
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Rejected:{" "}
                  {item.verifiedAt
                    ? new Date(
                        item.verifiedAt
                      ).toLocaleString()
                    : "-"}
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
                        "pending"
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                  >
                    <Clock3 size={16} />
                    Pending
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