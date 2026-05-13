import { useEffect, useState } from "react";

import {
  CheckCircle,
  Clock3,
  Trash2,
  XCircle,
} from "lucide-react";

import socket from "../../socket";

export default function VerificationBoard() {

  const [properties, setProperties] =
    useState([]);

  // ================= FETCH =================
  const fetchAll = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/properties/all",
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

    } catch (error) {

      console.log(error);
    }
  };

  // ================= REALTIME =================
  useEffect(() => {

    fetchAll();

    socket.on(
      "propertyUpdated",
      () => {
        fetchAll();
      }
    );

    return () => {
      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  // ================= UPDATE =================
  const updateStatus = async (
    id,
    type
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/admin/property/${id}/${type}`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    } catch (error) {

      console.log(error);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (
    id
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/admin/property/${id}/delete`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    } catch (error) {

      console.log(error);
    }
  };

  // ================= BADGE =================
  const badge = (status) => {

    if (
      status === "approved"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      status === "rejected"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      status === "deleted"
    ) {
      return "bg-slate-200 text-slate-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Verification Status Board
          </h1>

          <p className="text-slate-500 mt-1">
            Live moderation control center
          </p>
        </div>

        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Live Sync Active
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm">

        <table className="w-full text-sm">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">
                Property
              </th>

              <th className="p-4 text-left">
                Owner
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Added
              </th>

              <th className="p-4 text-left">
                Verified
              </th>

              <th className="p-4 text-left">
                By
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {properties.map((item) => (

              <tr
                key={item._id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-4">

                  <div className="font-semibold">
                    {item.title}
                  </div>

                  <div className="text-slate-500">
                    ₹ {item.price}
                  </div>

                </td>

                <td className="p-4">
                  {item.createdBy?.name}
                </td>

                <td className="p-4 capitalize">
                  {item.createdBy?.role}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </td>

                <td className="p-4">
                  {item.verifiedAt
                    ? new Date(
                        item.verifiedAt
                      ).toLocaleString()
                    : "-"}
                </td>

                <td className="p-4">
                  {item.verifiedBy?.name || "-"}
                </td>

                <td className="p-4">

                  <div className="flex gap-2 flex-wrap">

                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          "approve"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl flex items-center gap-1 text-sm"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          "reject"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl flex items-center gap-1 text-sm"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          "pending"
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-xl flex items-center gap-1 text-sm"
                    >
                      <Clock3 size={14} />
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                      className="bg-black hover:bg-slate-800 text-white px-3 py-2 rounded-xl flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}