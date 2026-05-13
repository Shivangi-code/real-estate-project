import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle,
  Clock3,
  XCircle,
  MapPin,
  IndianRupee,
  Trash2,
} from "lucide-react";

import socket from "../../socket";

export default function DeletedProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================
  const fetchDeleted = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/properties/deleted",
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

    fetchDeleted();

    socket.on(
      "propertyUpdated",
      () => {
        fetchDeleted();
      }
    );

    return () => {
      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  // ================= RESTORE =================
  const updateStatus = async (
    id,
    status
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/property/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!res.ok)
        throw new Error();

      toast.success(
        `Restored to ${status}`
      );

    } catch {

      toast.error(
        "Restore failed"
      );
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Deleted Properties
          </h1>

          <p className="text-slate-500 mt-1">
            Restore deleted properties instantly
          </p>
        </div>

        <div className="bg-slate-200 text-slate-700 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
          Live Sync Active
        </div>
      </div>

      {loading ? (

        <div className="text-center py-20">
          Loading...
        </div>

      ) : properties.length === 0 ? (

        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          No deleted properties
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {properties.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden"
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

                <h2 className="text-lg font-bold">
                  {item.title}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                  <MapPin size={14} />
                  {item.location}
                </div>

                <div className="flex items-center gap-2 mt-2 font-semibold text-slate-700">
                  <IndianRupee size={14} />
                  {item.price}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Owner:
                  {" "}
                  <b>
                    {item.createdBy?.name}
                  </b>
                </p>

                <div className="grid grid-cols-3 gap-3 mt-4">

                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "pending"
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Clock3 size={16} />
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "approved"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "rejected"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm"
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