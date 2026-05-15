import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  CheckCircle,
  Clock3,
  MapPin,
  IndianRupee,
  Trash2,
  Hash,
  BadgeCheck,
  XCircle,
} from "lucide-react";

import socket from "../../socket";

export default function RejectedProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchRejected = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/properties/rejected",
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

  useEffect(() => {

    fetchRejected();

    socket.on(
      "propertyUpdated",
      () => {

        fetchRejected();
      }
    );

    return () => {

      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

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
        `Moved to ${type}`
      );

    } catch {

      toast.error(
        "Action failed"
      );
    }
  };

  const handleDelete = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete property?"
      )
    )
      return;

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
        "Deleted"
      );

    } catch {

      toast.error(
        "Delete failed"
      );
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">

            Rejected Properties

          </h1>

          <p className="text-slate-500 mt-1">

            Rejected moderation inventory

          </p>

        </div>

        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 w-fit">

          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />

          Live Sync Active

        </div>

      </div>

      {loading ? (

        <div className="text-center py-24 text-lg font-semibold">

          Loading properties...

        </div>

      ) : properties.length ===
        0 ? (

        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

          <h2 className="text-2xl font-bold">

            No rejected properties

          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {properties.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition overflow-hidden border border-slate-100"
            >

              <div className="relative">

                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">

                  Rejected

                </div>

              </div>

              <div className="p-5">

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">

                  <Hash size={13} />

                  <span className="font-semibold">

                    {item.propertyUniqueId ||
                      `RE-${item._id.slice(-6).toUpperCase()}`}

                  </span>

                </div>

                <h2 className="text-lg font-bold">

                  {item.title}

                </h2>

                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">

                  <MapPin size={14} />

                  {item.location}

                </div>

                <div className="flex items-center gap-2 mt-3 font-bold text-red-600">

                  <IndianRupee size={14} />

                  {item.price}

                </div>

                <p className="mt-3 text-xs text-slate-500">

                  Owner:
                  {" "}
                  <b>
                    {item.createdBy?.name}
                  </b>

                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">

                    Rejected

                  </div>

                  {item.underNegotiation && (

                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">

                      <BadgeCheck size={12} />

                      Negotiation ON

                    </div>
                  )}

                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">

                  <button
                    onClick={() =>
                      updateStatus(
                        item._id,
                        "approve"
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
                      handleDelete(
                        item._id
                      )
                    }
                    className="bg-black hover:bg-slate-800 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm"
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