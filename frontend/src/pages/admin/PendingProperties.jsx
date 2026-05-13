import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle,
  XCircle,
  MapPin,
  IndianRupee,
  Trash2,
} from "lucide-react";

// ✅ SOCKET
import socket from "../../socket";

export default function PendingProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================
  const fetchPending = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/properties/pending",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setProperties(
        Array.isArray(data)
          ? data
          : []
      );

    } catch {

      setProperties([]);

    } finally {

      setLoading(false);
    }
  };

  // ================= REALTIME =================
  useEffect(() => {

    fetchPending();

    // ✅ LIVE SOCKET LISTENER
    socket.on(
      "propertyUpdated",
      () => {

        fetchPending();
      }
    );

    return () => {

      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (
    id,
    type
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/property/${id}/${type}`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!res.ok)
        throw new Error();

      toast.success(
        `Moved to ${type} ✅`
      );

    } catch {

      toast.error(
        "Action failed ❌"
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this property?"
      );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/property/${id}/delete`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!res.ok)
        throw new Error();

      toast.success(
        "Property deleted 🚀"
      );

    } catch {

      toast.error(
        "Delete failed ❌"
      );
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Pending Properties
          </h1>

          <p className="text-slate-500 mt-1">
            Live moderation dashboard
          </p>
        </div>

        {/* LIVE BADGE */}
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          Live Sync Active
        </div>
      </div>

      {/* LOADING */}
      {loading ? (

        <div className="text-center py-20 text-slate-500">
          Loading properties...
        </div>

      ) : properties.length === 0 ? (

        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-700">
            No pending properties
          </h2>

          <p className="text-slate-500 mt-2">
            Everything is reviewed.
          </p>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {properties.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
            >

              {/* IMAGE */}
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/400x250"
                }
                alt={item.title}
                className="w-full h-52 object-cover"
              />

              {/* CONTENT */}
              <div className="p-5">

                {/* TITLE */}
                <h2 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h2>

                {/* LOCATION */}
                <div className="flex items-center gap-2 mt-3 text-slate-500">
                  <MapPin size={16} />
                  {item.location}
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2 mt-2 text-blue-600 font-semibold text-lg">
                  <IndianRupee size={16} />
                  {item.price}
                </div>

                {/* OWNER */}
                <p className="mt-3 text-sm text-slate-600">
                  Owner:
                  {" "}
                  <b>
                    {item.createdBy?.name}
                  </b>
                </p>

                {/* STATUS */}
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-2xl text-sm font-medium">
                  Pending Review
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-3 gap-3 mt-6">

                  {/* APPROVE */}
                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "approve"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "reject"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      handleDelete(
                        item._id
                      )
                    }
                    className="bg-black hover:bg-slate-800 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition"
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